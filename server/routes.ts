import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import * as schema from "@shared/schema";
import { z } from "zod";
import { setupAuth, requireRole } from "./localAuth";
import bcrypt from "bcrypt";
import { sendCredentialEmail } from "./email";
import { BioTimeService } from "./services/zkteco";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  await setupAuth(app);

  // Protect all API routes except authentication endpoints
  app.use("/api/*", (req, res, next) => {
    if (req.originalUrl.startsWith("/api/login") ||
      req.originalUrl.startsWith("/api/logout") ||
      req.originalUrl === "/api/auth/user") {
      return next();
    }
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }
    next();
  });

  // ========== EMPLOYEES MODULE ==========
  app.get("/api/employees", async (req, res) => {
    try {
      const employees = await storage.getAllEmployees();
      res.json(employees);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch employees" });
    }
  });

  app.get("/api/employees/:id", async (req, res) => {
    try {
      const employee = await storage.getEmployee(req.params.id);
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }
      res.json(employee);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch employee" });
    }
  });

  app.post("/api/employees", requireRole("hr_manager"), async (req, res) => {
    try {
      const validated = schema.insertEmployeeSchema.parse(req.body);
      const employee = await storage.createEmployee(validated);
      res.status(201).json(employee);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create employee" });
      }
    }
  });

  app.put("/api/employees/:id", requireRole("hr_manager"), async (req, res) => {
    try {
      const validated = schema.insertEmployeeSchema.partial().parse(req.body);
      const employee = await storage.updateEmployee(req.params.id, validated);
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }
      res.json(employee);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update employee" });
      }
    }
  });

  // ========== EMPLOYEE REQUESTS MODULE ==========
  // Get all employee requests (HR sees all, Dept Manager sees only their own)
  app.get("/api/employee-requests", requireRole("hr_manager", "department_manager"), async (req, res) => {
    try {
      const user = req.user as schema.User;
      let requests;

      if (user.role === "hr_manager") {
        requests = await storage.getAllEmployeeRequests();
      } else {
        // Department managers only see their own requests
        requests = await storage.getEmployeeRequestsByUser(user.id);
      }

      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch employee requests" });
    }
  });

  // Get a specific employee request
  app.get("/api/employee-requests/:id", requireRole("hr_manager", "department_manager"), async (req, res) => {
    try {
      const request = await storage.getEmployeeRequest(req.params.id);
      if (!request) {
        return res.status(404).json({ error: "Employee request not found" });
      }

      const user = req.user as schema.User;
      // Department managers can only view their own requests
      if (user.role === "department_manager" && request.requestedById !== user.id) {
        return res.status(403).json({ error: "Access denied" });
      }

      res.json(request);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch employee request" });
    }
  });

  // Create a new employee request (Department Manager only)
  app.post("/api/employee-requests", requireRole("department_manager"), async (req, res) => {
    try {
      const user = req.user as schema.User;

      // Validate request body
      const requestSchema = z.object({
        requestType: z.enum(["new_employee", "transfer"]),
        requestData: z.object({}).passthrough(), // Allow any structure for flexible data
      });

      const validated = requestSchema.parse(req.body);

      // Create the request with the current user as requestedBy
      const requestData: schema.InsertEmployeeRequest = {
        requestType: validated.requestType,
        requestedById: user.id,
        requestData: validated.requestData,
        status: "pending",
      };

      const newRequest = await storage.createEmployeeRequest(requestData);
      res.status(201).json(newRequest);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create employee request" });
      }
    }
  });

  // Update employee request status (HR Manager only)
  app.patch("/api/employee-requests/:id/status", requireRole("hr_manager"), async (req, res) => {
    try {
      const user = req.user as schema.User;

      // Validate request body
      const statusSchema = z.object({
        status: z.enum(["approved", "rejected"]),
        notes: z.string().optional(),
      });

      const { status, notes } = statusSchema.parse(req.body);

      // If approving, use atomic approval method
      if (status === "approved") {
        try {
          // Fetch and validate request first
          const currentRequest = await storage.getEmployeeRequest(req.params.id);
          if (!currentRequest) {
            return res.status(404).json({ error: "Employee request not found" });
          }

          // Validate that request_data contains required employee fields
          const employeeDataSchema = z.object({
            firstName: z.string().min(1, "First name is required"),
            lastName: z.string().min(1, "Last name is required"),
            email: z.string().email("Invalid email address"),
            phone: z.string().optional(),
            departmentId: z.string().min(1, "Department is required"),
            role: z.string().min(1, "Role/position is required"),
            joiningDate: z.string().min(1, "Joining date is required"),
            biometricId: z.string().optional(),
            status: z.enum(["active", "inactive", "terminated"]).optional(),
          });

          const employeeData = employeeDataSchema.parse(currentRequest.requestData);

          // Verify department exists
          const department = await storage.getDepartment(employeeData.departmentId);
          if (!department) {
            return res.status(400).json({
              error: "Invalid department ID in request data"
            });
          }

          // Use atomic approval method (handles idempotency and creates employee)
          const result = await storage.approveEmployeeRequest(
            req.params.id,
            user.id,
            notes
          );

          res.json({
            request: result.request,
            employee: result.employee,
            message: "Employee request approved and employee created successfully"
          });
        } catch (error: any) {
          // Handle unique constraint violation (duplicate email)
          if (error.code === "23505" || error.message?.includes("unique") || error.message?.includes("duplicate")) {
            return res.status(409).json({
              error: "Employee with this email already exists"
            });
          }

          // Handle already processed requests
          if (error.message?.includes("already")) {
            return res.status(400).json({ error: error.message });
          }

          throw error;
        }
      } else {
        // For rejection, just update the status
        const currentRequest = await storage.getEmployeeRequest(req.params.id);
        if (!currentRequest) {
          return res.status(404).json({ error: "Employee request not found" });
        }

        if (currentRequest.status !== "pending") {
          return res.status(400).json({
            error: `Request already ${currentRequest.status}. Cannot update status.`
          });
        }

        const updated = await storage.updateEmployeeRequestStatus(
          req.params.id,
          status,
          user.id,
          notes
        );

        if (!updated) {
          return res.status(500).json({ error: "Failed to update request status" });
        }

        res.json(updated);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error("Error processing employee request:", error);
        res.status(500).json({ error: "Failed to process employee request" });
      }
    }
  });

  // ========== DEPARTMENTS MODULE ==========
  app.get("/api/departments", async (req, res) => {
    try {
      const departments = await storage.getAllDepartments();
      res.json(departments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch departments" });
    }
  });

  app.post("/api/departments", requireRole("system_admin"), async (req, res) => {
    try {
      const validated = schema.insertDepartmentSchema.parse(req.body);
      const department = await storage.createDepartment(validated);
      res.status(201).json(department);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create department" });
      }
    }
  });

  // ========== ADMIN MODULE - User Management ==========
  app.get("/api/admin/users", requireRole("system_admin"), async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.post("/api/admin/users", requireRole("system_admin"), async (req, res) => {
    try {
      // Validate request body with password
      const requestSchema = z.object({
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        role: z.enum(["system_admin", "hr_manager", "department_manager", "employee"]),
        departmentId: z.string().optional(),
      });

      const { password, departmentId, ...userData } = requestSchema.parse(req.body);

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Prepare data for storage (convert "none" to undefined)
      const storageData = {
        ...userData,
        passwordHash,
        departmentId: departmentId === "none" ? undefined : departmentId,
      };

      const validated = schema.insertUserSchema.parse(storageData);
      const user = await storage.createUser(validated);

      // Send credential email
      try {
        await sendCredentialEmail(
          user.email!,
          user.firstName || "",
          user.lastName || "",
          user.email!,
          password
        );
      } catch (emailError) {
        console.error("Failed to send credential email:", emailError);
        // Don't fail the user creation if email fails
      }

      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create user" });
      }
    }
  });

  app.put("/api/admin/users/:id", requireRole("system_admin"), async (req, res) => {
    try {
      // Validate request body with optional password
      const requestSchema = z.object({
        firstName: z.string().min(1).optional(),
        lastName: z.string().min(1).optional(),
        email: z.string().email().optional(),
        password: z.string().min(6).optional(),
        role: z.enum(["system_admin", "hr_manager", "department_manager", "employee"]).optional(),
        departmentId: z.string().optional(),
      });

      const { password, departmentId, ...userData } = requestSchema.parse(req.body);

      // Prepare update data
      let updateData: any = { ...userData };

      // If password is provided, hash it
      if (password) {
        updateData.passwordHash = await bcrypt.hash(password, 10);
      }

      // Convert "none" to undefined for departmentId
      if (departmentId !== undefined) {
        updateData.departmentId = departmentId === "none" ? undefined : departmentId;
      }

      const validated = schema.insertUserSchema.partial().parse(updateData);
      const user = await storage.updateUser(req.params.id, validated);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update user" });
      }
    }
  });

  app.delete("/api/admin/users/:id", requireRole("system_admin"), async (req, res) => {
    try {
      await storage.deleteUser(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // ========== ADMIN MODULE - Department Management ==========
  app.put("/api/admin/departments/:id", requireRole("system_admin"), async (req, res) => {
    try {
      const validated = schema.insertDepartmentSchema.partial().parse(req.body);
      const department = await storage.updateDepartment(req.params.id, validated);
      if (!department) {
        return res.status(404).json({ error: "Department not found" });
      }
      res.json(department);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update department" });
      }
    }
  });

  app.delete("/api/admin/departments/:id", requireRole("system_admin"), async (req, res) => {
    try {
      await storage.deleteDepartment(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete department" });
    }
  });

  // ========== ADMIN MODULE - Leave Types Management ==========
  app.get("/api/admin/leave-types", requireRole("system_admin"), async (req, res) => {
    try {
      const types = await storage.getAllLeaveTypes();
      res.json(types);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch leave types" });
    }
  });

  app.post("/api/admin/leave-types", requireRole("system_admin"), async (req, res) => {
    try {
      const validated = schema.insertLeaveTypeSchema.parse(req.body);
      const type = await storage.createLeaveType(validated);
      res.status(201).json(type);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create leave type" });
      }
    }
  });

  app.put("/api/admin/leave-types/:id", requireRole("system_admin"), async (req, res) => {
    try {
      const validated = schema.insertLeaveTypeSchema.partial().parse(req.body);
      const type = await storage.updateLeaveType(req.params.id, validated);
      if (!type) {
        return res.status(404).json({ error: "Leave type not found" });
      }
      res.json(type);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update leave type" });
      }
    }
  });

  app.delete("/api/admin/leave-types/:id", requireRole("system_admin"), async (req, res) => {
    try {
      await storage.deleteLeaveType(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete leave type" });
    }
  });

  // ========== ADMIN MODULE - Expense Categories Management ==========
  app.get("/api/admin/expense-categories", requireRole("system_admin"), async (req, res) => {
    try {
      const categories = await storage.getAllExpenseCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch expense categories" });
    }
  });

  app.post("/api/admin/expense-categories", requireRole("system_admin"), async (req, res) => {
    try {
      const validated = schema.insertExpenseCategorySchema.parse(req.body);
      const category = await storage.createExpenseCategory(validated);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create expense category" });
      }
    }
  });

  app.put("/api/admin/expense-categories/:id", requireRole("system_admin"), async (req, res) => {
    try {
      const validated = schema.insertExpenseCategorySchema.partial().parse(req.body);
      const category = await storage.updateExpenseCategory(req.params.id, validated);
      if (!category) {
        return res.status(404).json({ error: "Expense category not found" });
      }
      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update expense category" });
      }
    }
  });

  app.delete("/api/admin/expense-categories/:id", requireRole("system_admin"), async (req, res) => {
    try {
      await storage.deleteExpenseCategory(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete expense category" });
    }
  });

  // ========== ATTENDANCE DEVICES MODULE (Admin/Manager for mutations) ==========
  app.get("/api/devices", async (req, res) => {
    try {
      const devices = await storage.getAllDevices();
      res.json(devices);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch devices" });
    }
  });

  app.get("/api/devices/:id", async (req, res) => {
    try {
      const device = await storage.getDevice(req.params.id);
      if (!device) {
        return res.status(404).json({ error: "Device not found" });
      }
      res.json(device);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch device" });
    }
  });

  app.post("/api/devices", requireRole("system_admin", "hr_manager"), async (req, res) => {
    try {
      const validated = schema.insertAttendanceDeviceSchema.parse(req.body);
      const device = await storage.createDevice(validated);
      res.status(201).json(device);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error("Failed to create device:", error);
        res.status(500).json({ error: "Failed to create device" });
      }
    }
  });

  app.put("/api/devices/:id", requireRole("system_admin", "hr_manager"), async (req, res) => {
    try {
      const validated = schema.insertAttendanceDeviceSchema.partial().parse(req.body);
      const device = await storage.updateDevice(req.params.id, validated);
      if (!device) {
        return res.status(404).json({ error: "Device not found" });
      }
      res.json(device);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update device" });
      }
    }
  });

  app.delete("/api/devices/:id", requireRole("system_admin", "hr_manager"), async (req, res) => {
    try {
      const device = await storage.getDevice(req.params.id);
      if (!device) {
        return res.status(404).json({ error: "Device not found" });
      }
      await storage.deleteDevice(req.params.id);
      res.json({ message: "Device deleted successfully" });
    } catch (error) {
      console.error("Failed to delete device:", error);
      res.status(500).json({ error: "Failed to delete device" });
    }
  });

  app.get("/api/devices/:id/logs", requireRole("system_admin", "hr_manager"), async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const logs = await storage.getDeviceLogs(req.params.id, limit);
      res.json(logs);
    } catch (error) {
      console.error("Failed to fetch device logs:", error);
      res.status(500).json({ error: "Failed to fetch device logs" });
    }
  });

  app.patch("/api/devices/:id/status", requireRole("system_admin", "hr_manager"), async (req, res) => {
    try {
      const statusSchema = z.object({
        status: z.enum(["online", "offline"])
      });
      const { status } = statusSchema.parse(req.body);
      await storage.updateDeviceStatus(req.params.id, status);
      res.json({ message: "Device status updated successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update device status" });
      }
    }
  });

  app.post("/api/devices/:id/sync", requireRole("system_admin", "hr_manager"), async (req, res) => {
    try {
      const device = await storage.getDevice(req.params.id);
      if (!device) {
        return res.status(404).json({ error: "Device not found" });
      }

      // Trigger async sync
      BioTimeService.syncDevice(device).catch((err: any) => {
        console.error("Background sync error:", err);
      });

      res.status(202).json({ message: "Device sync started in background" });
    } catch (error) {
      res.status(500).json({ error: "Failed to initiate device sync" });
    }
  });

  app.post("/api/devices/test-connection", requireRole("system_admin", "hr_manager"), async (req, res) => {
    try {
      const connectionSchema = z.object({
        ipAddress: z.string(),
        port: z.string(),
        username: z.string(),
        password: z.string(),
        connectionMode: z.string().optional(),
      });

      const config = connectionSchema.parse(req.body);

      const biotime = new BioTimeService({
        host: config.ipAddress,
        port: config.port,
        username: config.username,
        password: config.password,
      });

      const result = await biotime.testConnection();

      if (result.success) {
        res.json({ connected: true, message: result.message });
      } else {
        res.status(400).json({ connected: false, error: result.message });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to test connection" });
      }
    }
  });

  // ========== ATTENDANCE MODULE ==========
  app.get("/api/attendance", async (req, res) => {
    try {
      const dateParam = req.query.date as string;
      if (!dateParam) {
        return res.status(400).json({ error: "Date parameter is required" });
      }
      const date = new Date(dateParam);
      const logs = await storage.getAttendanceLogsByDate(date);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch attendance logs" });
    }
  });

  app.get("/api/attendance/employee/:id", async (req, res) => {
    try {
      const logs = await storage.getAttendanceLogsByEmployee(req.params.id);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch employee attendance" });
    }
  });

  app.post("/api/attendance", requireRole("employee", "department_manager", "hr_manager", "system_admin"), async (req, res) => {
    try {
      const validated = schema.insertAttendanceLogSchema.parse(req.body);
      const log = await storage.createAttendanceLog(validated);
      res.status(201).json(log);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create attendance log" });
      }
    }
  });

  // ========== LEAVE MODULE ==========
  app.get("/api/leave/types", async (req, res) => {
    try {
      const types = await storage.getAllLeaveTypes();
      res.json(types);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch leave types" });
    }
  });

  app.get("/api/leave/requests", async (req, res) => {
    try {
      const requests = await storage.getAllLeaveRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch leave requests" });
    }
  });

  app.post("/api/leave/requests", requireRole("employee", "department_manager", "hr_manager", "system_admin"), async (req, res) => {
    try {
      const validated = schema.insertLeaveRequestSchema.parse(req.body);
      const request = await storage.createLeaveRequest(validated);
      res.status(201).json(request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create leave request" });
      }
    }
  });

  app.patch("/api/leave/requests/:id/approve", requireRole("hr_manager", "department_manager"), async (req, res) => {
    try {
      const reviewerSchema = z.object({
        reviewerId: z.string()
      });
      const { reviewerId } = reviewerSchema.parse(req.body);
      await storage.updateLeaveRequestStatus(req.params.id, "approved", reviewerId);
      res.json({ message: "Leave request approved successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to approve leave request" });
      }
    }
  });

  app.patch("/api/leave/requests/:id/reject", requireRole("hr_manager", "department_manager"), async (req, res) => {
    try {
      const reviewerSchema = z.object({
        reviewerId: z.string()
      });
      const { reviewerId } = reviewerSchema.parse(req.body);
      await storage.updateLeaveRequestStatus(req.params.id, "rejected", reviewerId);
      res.json({ message: "Leave request rejected successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to reject leave request" });
      }
    }
  });

  // ========== EXPENSE MODULE ==========
  app.get("/api/expenses/categories", async (req, res) => {
    try {
      const categories = await storage.getAllExpenseCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch expense categories" });
    }
  });

  app.get("/api/expenses/claims", async (req, res) => {
    try {
      const claims = await storage.getAllExpenseClaims();
      res.json(claims);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch expense claims" });
    }
  });

  app.post("/api/expenses/claims", requireRole("employee", "department_manager", "hr_manager", "system_admin"), async (req, res) => {
    try {
      const validated = schema.insertExpenseClaimSchema.parse(req.body);
      const claim = await storage.createExpenseClaim(validated);
      res.status(201).json(claim);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create expense claim" });
      }
    }
  });

  app.patch("/api/expenses/claims/:id/approve", requireRole("hr_manager", "department_manager"), async (req, res) => {
    try {
      const reviewerSchema = z.object({
        reviewerId: z.string()
      });
      const { reviewerId } = reviewerSchema.parse(req.body);
      await storage.updateExpenseClaimStatus(req.params.id, "approved", reviewerId);
      res.json({ message: "Expense claim approved successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to approve expense claim" });
      }
    }
  });

  app.patch("/api/expenses/claims/:id/reject", requireRole("hr_manager", "department_manager"), async (req, res) => {
    try {
      const reviewerSchema = z.object({
        reviewerId: z.string()
      });
      const { reviewerId } = reviewerSchema.parse(req.body);
      await storage.updateExpenseClaimStatus(req.params.id, "rejected", reviewerId);
      res.json({ message: "Expense claim rejected successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to reject expense claim" });
      }
    }
  });

  // ========== PERFORMANCE MODULE ==========
  app.get("/api/performance/goals", async (req, res) => {
    try {
      const goals = await storage.getAllGoals();
      res.json(goals);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch goals" });
    }
  });

  app.post("/api/performance/goals", requireRole("employee", "department_manager", "hr_manager", "system_admin"), async (req, res) => {
    try {
      const validated = schema.insertPerformanceGoalSchema.parse(req.body);
      const goal = await storage.createGoal(validated);
      res.status(201).json(goal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create goal" });
      }
    }
  });

  app.patch("/api/performance/goals/:id", requireRole("employee", "department_manager", "hr_manager", "system_admin"), async (req, res) => {
    try {
      const progressSchema = z.object({
        progress: z.number().min(0).max(100)
      });
      const { progress } = progressSchema.parse(req.body);
      await storage.updateGoalProgress(req.params.id, progress);
      res.json({ message: "Goal progress updated successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update goal progress" });
      }
    }
  });

  app.get("/api/performance/appraisals", async (req, res) => {
    try {
      const appraisals = await storage.getAllAppraisals();
      res.json(appraisals);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch appraisals" });
    }
  });

  app.post("/api/performance/appraisals", requireRole("hr_manager", "department_manager"), async (req, res) => {
    try {
      const validated = schema.insertAppraisalSchema.parse(req.body);
      const appraisal = await storage.createAppraisal(validated);
      res.status(201).json(appraisal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create appraisal" });
      }
    }
  });

  app.get("/api/performance/feedback", async (req, res) => {
    try {
      const feedback = await storage.getAllFeedback();
      res.json(feedback);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch feedback" });
    }
  });

  app.post("/api/performance/feedback", requireRole("employee", "department_manager", "hr_manager", "system_admin"), async (req, res) => {
    try {
      const validated = schema.insertFeedbackSchema.parse(req.body);
      const feedback = await storage.createFeedback(validated);
      res.status(201).json(feedback);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create feedback" });
      }
    }
  });

  // ========== PAYROLL MODULE (Admin/Manager only) ==========
  app.get("/api/payroll/salary-configs/:employeeId", requireRole("hr_manager"), async (req, res) => {
    try {
      const config = await storage.getSalaryConfig(req.params.employeeId);
      if (!config) {
        return res.status(404).json({ error: "Salary config not found" });
      }
      res.json(config);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch salary config" });
    }
  });

  app.post("/api/payroll/salary-configs", requireRole("hr_manager"), async (req, res) => {
    try {
      const validated = schema.insertSalaryConfigSchema.parse(req.body);
      const config = await storage.createOrUpdateSalaryConfig(validated);
      res.status(201).json(config);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create/update salary config" });
      }
    }
  });

  app.get("/api/payroll/records", requireRole("hr_manager"), async (req, res) => {
    try {
      const records = await storage.getAllPayrollRecords();
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch payroll records" });
    }
  });

  app.post("/api/payroll/process", requireRole("hr_manager"), async (req, res) => {
    try {
      const processSchema = z.object({
        employeeId: z.string(),
        period: z.string(),
        basicSalary: z.string(),
        totalAllowances: z.string(),
        totalDeductions: z.string(),
        netPay: z.string()
      });
      const validated = processSchema.parse(req.body);
      const record = await storage.createPayrollRecord(validated);
      res.status(201).json(record);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to process payroll" });
      }
    }
  });

  // ========== RECRUITMENT MODULE (Admin/Manager for management) ==========
  app.get("/api/recruitment/jobs", async (req, res) => {
    try {
      const jobs = await storage.getAllJobPostings();
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch job postings" });
    }
  });

  app.post("/api/recruitment/jobs", requireRole("hr_manager"), async (req, res) => {
    try {
      const validated = schema.insertJobPostingSchema.parse(req.body);
      const job = await storage.createJobPosting(validated);
      res.status(201).json(job);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create job posting" });
      }
    }
  });

  app.get("/api/recruitment/candidates", requireRole("hr_manager"), async (req, res) => {
    try {
      const candidates = await storage.getAllCandidates();
      res.json(candidates);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch candidates" });
    }
  });

  app.post("/api/recruitment/candidates", requireRole("hr_manager"), async (req, res) => {
    try {
      const validated = schema.insertCandidateSchema.parse(req.body);
      const candidate = await storage.createCandidate(validated);
      res.status(201).json(candidate);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create candidate" });
      }
    }
  });

  app.patch("/api/recruitment/candidates/:id/stage", requireRole("hr_manager"), async (req, res) => {
    try {
      const stageSchema = z.object({
        stage: z.enum(["applied", "screening", "interview", "offer", "hired", "rejected"])
      });
      const { stage } = stageSchema.parse(req.body);
      await storage.updateCandidateStage(req.params.id, stage);
      res.json({ message: "Candidate stage updated successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update candidate stage" });
      }
    }
  });

  // ========== DASHBOARD MODULE ==========
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const employees = await storage.getAllEmployees();
      const leaveRequests = await storage.getAllLeaveRequests();
      const expenseClaims = await storage.getAllExpenseClaims();

      const today = new Date();
      const attendanceLogs = await storage.getAttendanceLogsByDate(today);

      const stats = {
        totalEmployees: employees.filter(e => e.status === "active").length,
        presentToday: attendanceLogs.length,
        pendingApprovals: leaveRequests.filter(r => r.status === "pending").length +
          expenseClaims.filter(c => c.status === "pending").length,
        payrollThisMonth: "$0"
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  app.get("/api/admin/dashboard/stats", requireRole("system_admin"), async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const departments = await storage.getAllDepartments();
      const leaveTypes = await storage.getAllLeaveTypes();
      const expenseCategories = await storage.getAllExpenseCategories();

      const stats = {
        totalUsers: users.length,
        totalDepartments: departments.length,
        leaveTypesConfigured: leaveTypes.length,
        expenseCategoriesConfigured: expenseCategories.length,
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch admin dashboard stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
