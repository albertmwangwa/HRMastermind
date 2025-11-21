import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import * as schema from "@shared/schema";
import { z } from "zod";
import { setupAuth, requireRole } from "./localAuth";
import bcrypt from "bcrypt";
import { sendCredentialEmail } from "./email";

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
      const { password, ...userData } = req.body;
      
      if (!password) {
        return res.status(400).json({ error: "Password is required for new users" });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const validated = schema.insertUserSchema.parse({
        ...userData,
        passwordHash,
      });
      
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
      const { password, ...userData } = req.body;
      
      let updateData: any = userData;
      
      // If password is provided, hash it
      if (password) {
        const passwordHash = await bcrypt.hash(password, 10);
        updateData.passwordHash = passwordHash;
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
        res.status(500).json({ error: "Failed to create device" });
      }
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
      await storage.updateDeviceLastSync(req.params.id);
      res.json({ message: "Device synced successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to sync device" });
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

  const httpServer = createServer(app);
  return httpServer;
}
