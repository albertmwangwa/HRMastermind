import { db } from "@db";
import * as schema from "@shared/schema";
import { eq, and, gte, lte, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<schema.User | undefined>;
  getUserByEmail(email: string): Promise<schema.User | undefined>;
  getAllUsers(): Promise<schema.User[]>;
  createUser(user: schema.InsertUser): Promise<schema.User>;
  upsertUser(user: schema.UpsertUser): Promise<schema.User>;
  updateUser(id: string, user: Partial<schema.InsertUser>): Promise<schema.User | undefined>;
  deleteUser(id: string): Promise<void>;
  getUserCount(): Promise<number>;

  // Departments
  getAllDepartments(): Promise<schema.Department[]>;
  getDepartment(id: string): Promise<schema.Department | undefined>;
  createDepartment(dept: schema.InsertDepartment): Promise<schema.Department>;
  updateDepartment(id: string, dept: Partial<schema.InsertDepartment>): Promise<schema.Department | undefined>;
  deleteDepartment(id: string): Promise<void>;

  // Employees
  getAllEmployees(): Promise<schema.Employee[]>;
  getEmployee(id: string): Promise<schema.Employee | undefined>;
  createEmployee(employee: schema.InsertEmployee): Promise<schema.Employee>;
  updateEmployee(id: string, employee: Partial<schema.InsertEmployee>): Promise<schema.Employee | undefined>;

  // Attendance Devices
  getAllDevices(): Promise<schema.AttendanceDevice[]>;
  getDevice(id: string): Promise<schema.AttendanceDevice | undefined>;
  createDevice(device: schema.InsertAttendanceDevice): Promise<schema.AttendanceDevice>;
  updateDevice(id: string, device: Partial<schema.InsertAttendanceDevice>): Promise<schema.AttendanceDevice | undefined>;
  deleteDevice(id: string): Promise<void>;
  updateDeviceStatus(id: string, status: "online" | "offline" | "syncing" | "idle" | "error"): Promise<void>;
  updateDeviceLastSync(id: string): Promise<void>;
  updateDeviceSyncStats(id: string, stats: { recordCount: number; duration: number; success: boolean }): Promise<void>;
  createDeviceLog(log: schema.InsertDeviceActivityLog): Promise<schema.DeviceActivityLog>;
  getDeviceLogs(deviceId: string, limit?: number): Promise<schema.DeviceActivityLog[]>;

  // Attendance Logs
  getAttendanceLogsByDate(date: Date): Promise<schema.AttendanceLog[]>;
  getAttendanceLogsByEmployee(employeeId: string): Promise<schema.AttendanceLog[]>;
  createAttendanceLog(log: schema.InsertAttendanceLog): Promise<schema.AttendanceLog>;

  // Leave Types
  getAllLeaveTypes(): Promise<schema.LeaveType[]>;
  getLeaveType(id: string): Promise<schema.LeaveType | undefined>;
  createLeaveType(type: schema.InsertLeaveType): Promise<schema.LeaveType>;
  updateLeaveType(id: string, type: Partial<schema.InsertLeaveType>): Promise<schema.LeaveType | undefined>;
  deleteLeaveType(id: string): Promise<void>;

  // Leave Requests
  getAllLeaveRequests(): Promise<schema.LeaveRequest[]>;
  getLeaveRequest(id: string): Promise<schema.LeaveRequest | undefined>;
  createLeaveRequest(request: schema.InsertLeaveRequest): Promise<schema.LeaveRequest>;
  updateLeaveRequestStatus(id: string, status: "approved" | "rejected", reviewerId: string): Promise<void>;

  // Expense Categories
  getAllExpenseCategories(): Promise<schema.ExpenseCategory[]>;
  getExpenseCategory(id: string): Promise<schema.ExpenseCategory | undefined>;
  createExpenseCategory(category: schema.InsertExpenseCategory): Promise<schema.ExpenseCategory>;
  updateExpenseCategory(id: string, category: Partial<schema.InsertExpenseCategory>): Promise<schema.ExpenseCategory | undefined>;
  deleteExpenseCategory(id: string): Promise<void>;

  // Expense Claims
  getAllExpenseClaims(): Promise<schema.ExpenseClaim[]>;
  getExpenseClaim(id: string): Promise<schema.ExpenseClaim | undefined>;
  createExpenseClaim(claim: schema.InsertExpenseClaim): Promise<schema.ExpenseClaim>;
  updateExpenseClaimStatus(id: string, status: "approved" | "rejected", reviewerId: string): Promise<void>;

  // Performance Goals
  getAllGoals(): Promise<schema.PerformanceGoal[]>;
  getGoal(id: string): Promise<schema.PerformanceGoal | undefined>;
  createGoal(goal: schema.InsertPerformanceGoal): Promise<schema.PerformanceGoal>;
  updateGoalProgress(id: string, progress: number): Promise<void>;

  // Appraisals
  getAllAppraisals(): Promise<schema.Appraisal[]>;
  getAppraisal(id: string): Promise<schema.Appraisal | undefined>;
  createAppraisal(appraisal: schema.InsertAppraisal): Promise<schema.Appraisal>;

  // Feedback
  getAllFeedback(): Promise<schema.Feedback[]>;
  createFeedback(feedback: schema.InsertFeedback): Promise<schema.Feedback>;

  // Salary Configs
  getSalaryConfig(employeeId: string): Promise<schema.SalaryConfig | undefined>;
  createOrUpdateSalaryConfig(config: schema.InsertSalaryConfig): Promise<schema.SalaryConfig>;

  // Payroll
  getAllPayrollRecords(): Promise<schema.PayrollRecord[]>;
  getPayrollRecordsByPeriod(period: string): Promise<schema.PayrollRecord[]>;
  createPayrollRecord(record: schema.InsertPayrollRecord): Promise<schema.PayrollRecord>;

  // Job Postings
  getAllJobPostings(): Promise<schema.JobPosting[]>;
  getJobPosting(id: string): Promise<schema.JobPosting | undefined>;
  createJobPosting(job: schema.InsertJobPosting): Promise<schema.JobPosting>;

  // Candidates
  getAllCandidates(): Promise<schema.Candidate[]>;
  getCandidate(id: string): Promise<schema.Candidate | undefined>;
  createCandidate(candidate: schema.InsertCandidate): Promise<schema.Candidate>;
  updateCandidateStage(id: string, stage: string): Promise<void>;

  // Employee Requests
  getAllEmployeeRequests(): Promise<schema.EmployeeRequest[]>;
  getEmployeeRequestsByUser(userId: string): Promise<schema.EmployeeRequest[]>;
  getEmployeeRequest(id: string): Promise<schema.EmployeeRequest | undefined>;
  createEmployeeRequest(request: schema.InsertEmployeeRequest): Promise<schema.EmployeeRequest>;
  updateEmployeeRequestStatus(id: string, status: "approved" | "rejected", approverId: string, notes?: string): Promise<schema.EmployeeRequest | undefined>;
  approveEmployeeRequest(requestId: string, approverId: string, notes?: string): Promise<{ request: schema.EmployeeRequest; employee?: schema.Employee }>;
}

export class DbStorage implements IStorage {
  // Users
  async getUser(id: string) {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return user;
  }

  async getUserByEmail(email: string) {
    // Perform a case-insensitive lookup to avoid mismatches due to mixed-case emails
    const normalized = (email || "").trim().toLowerCase();
    const [user] = await db
      .select()
      .from(schema.users)
      .where(sql`lower(${schema.users.email}) = ${normalized}`);
    return user;
  }

  async createUser(user: schema.InsertUser) {
    const [newUser] = await db.insert(schema.users).values(user).returning();
    return newUser;
  }

  async upsertUser(userData: schema.UpsertUser) {
    const [user] = await db
      .insert(schema.users)
      .values(userData)
      .onConflictDoUpdate({
        target: schema.users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getAllUsers() {
    return await db.select().from(schema.users).orderBy(desc(schema.users.createdAt));
  }

  async updateUser(id: string, userData: Partial<schema.InsertUser>) {
    const [updated] = await db
      .update(schema.users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(schema.users.id, id))
      .returning();
    return updated;
  }

  async deleteUser(id: string) {
    await db.delete(schema.users).where(eq(schema.users.id, id));
  }

  async getUserCount() {
    const [result] = await db.select({ count: sql<number>`count(*)` }).from(schema.users);
    return Number(result.count);
  }

  // Departments
  async getAllDepartments() {
    return await db.select().from(schema.departments);
  }

  async getDepartment(id: string) {
    const [dept] = await db.select().from(schema.departments).where(eq(schema.departments.id, id));
    return dept;
  }

  async createDepartment(dept: schema.InsertDepartment) {
    const [newDept] = await db.insert(schema.departments).values(dept).returning();
    return newDept;
  }

  async updateDepartment(id: string, deptData: Partial<schema.InsertDepartment>) {
    const [updated] = await db
      .update(schema.departments)
      .set(deptData)
      .where(eq(schema.departments.id, id))
      .returning();
    return updated;
  }

  async deleteDepartment(id: string) {
    await db.delete(schema.departments).where(eq(schema.departments.id, id));
  }

  // Employees
  async getAllEmployees() {
    return await db.select().from(schema.employees).orderBy(desc(schema.employees.createdAt));
  }

  async getEmployee(id: string) {
    const [employee] = await db.select().from(schema.employees).where(eq(schema.employees.id, id));
    return employee;
  }

  async createEmployee(employee: schema.InsertEmployee) {
    const [newEmployee] = await db.insert(schema.employees).values(employee).returning();
    return newEmployee;
  }

  async updateEmployee(id: string, employee: Partial<schema.InsertEmployee>) {
    const [updated] = await db.update(schema.employees).set(employee).where(eq(schema.employees.id, id)).returning();
    return updated;
  }

  // Attendance Devices
  async getAllDevices() {
    return await db.select().from(schema.attendanceDevices);
  }

  async getDevice(id: string) {
    const [device] = await db.select().from(schema.attendanceDevices).where(eq(schema.attendanceDevices.id, id));
    return device;
  }

  async createDevice(device: schema.InsertAttendanceDevice) {
    const [newDevice] = await db.insert(schema.attendanceDevices).values(device).returning();
    return newDevice;
  }

  async updateDevice(id: string, device: Partial<schema.InsertAttendanceDevice>) {
    const [updated] = await db
      .update(schema.attendanceDevices)
      .set(device)
      .where(eq(schema.attendanceDevices.id, id))
      .returning();
    return updated;
  }

  async deleteDevice(id: string) {
    await db.delete(schema.attendanceDevices).where(eq(schema.attendanceDevices.id, id));
  }

  async updateDeviceStatus(id: string, status: "online" | "offline" | "syncing" | "idle" | "error") {
    await db.update(schema.attendanceDevices).set({ status }).where(eq(schema.attendanceDevices.id, id));
  }

  async updateDeviceLastSync(id: string) {
    await db.update(schema.attendanceDevices).set({ lastSyncAt: new Date() }).where(eq(schema.attendanceDevices.id, id));
  }

  async updateDeviceSyncStats(id: string, stats: { recordCount: number; duration: number; success: boolean }) {
    await db.update(schema.attendanceDevices)
      .set({
        lastSyncRecordCount: stats.recordCount,
        lastSyncDuration: stats.duration,
        lastSyncSuccess: stats.success,
        lastSyncAt: new Date()
      })
      .where(eq(schema.attendanceDevices.id, id));
  }

  async createDeviceLog(log: schema.InsertDeviceActivityLog) {
    const [newLog] = await db.insert(schema.deviceActivityLogs).values(log).returning();
    return newLog;
  }

  async getDeviceLogs(deviceId: string, limit: number = 50) {
    return await db.select()
      .from(schema.deviceActivityLogs)
      .where(eq(schema.deviceActivityLogs.deviceId, deviceId))
      .orderBy(desc(schema.deviceActivityLogs.createdAt))
      .limit(limit);
  }

  // Attendance Logs
  async getAttendanceLogsByDate(date: Date) {
    const dateStr = date.toISOString().split('T')[0];
    return await db.select().from(schema.attendanceLogs).where(eq(schema.attendanceLogs.date, dateStr));
  }

  async getAttendanceLogsByEmployee(employeeId: string) {
    return await db.select().from(schema.attendanceLogs)
      .where(eq(schema.attendanceLogs.employeeId, employeeId))
      .orderBy(desc(schema.attendanceLogs.date));
  }

  async createAttendanceLog(log: schema.InsertAttendanceLog) {
    const [newLog] = await db.insert(schema.attendanceLogs).values(log).returning();
    return newLog;
  }

  // Leave Types
  async getAllLeaveTypes() {
    return await db.select().from(schema.leaveTypes);
  }

  async getLeaveType(id: string) {
    const [type] = await db.select().from(schema.leaveTypes).where(eq(schema.leaveTypes.id, id));
    return type;
  }

  async createLeaveType(type: schema.InsertLeaveType) {
    const [newType] = await db.insert(schema.leaveTypes).values(type).returning();
    return newType;
  }

  async updateLeaveType(id: string, typeData: Partial<schema.InsertLeaveType>) {
    const [updated] = await db
      .update(schema.leaveTypes)
      .set(typeData)
      .where(eq(schema.leaveTypes.id, id))
      .returning();
    return updated;
  }

  async deleteLeaveType(id: string) {
    await db.delete(schema.leaveTypes).where(eq(schema.leaveTypes.id, id));
  }

  // Leave Requests
  async getAllLeaveRequests() {
    return await db.select().from(schema.leaveRequests).orderBy(desc(schema.leaveRequests.createdAt));
  }

  async getLeaveRequest(id: string) {
    const [request] = await db.select().from(schema.leaveRequests).where(eq(schema.leaveRequests.id, id));
    return request;
  }

  async createLeaveRequest(request: schema.InsertLeaveRequest) {
    const [newRequest] = await db.insert(schema.leaveRequests).values(request).returning();
    return newRequest;
  }

  async updateLeaveRequestStatus(id: string, status: "approved" | "rejected", reviewerId: string) {
    await db.update(schema.leaveRequests)
      .set({ status, reviewedBy: reviewerId, reviewedAt: new Date() })
      .where(eq(schema.leaveRequests.id, id));
  }

  // Expense Categories
  async getAllExpenseCategories() {
    return await db.select().from(schema.expenseCategories);
  }

  async getExpenseCategory(id: string) {
    const [category] = await db.select().from(schema.expenseCategories).where(eq(schema.expenseCategories.id, id));
    return category;
  }

  async createExpenseCategory(category: schema.InsertExpenseCategory) {
    const [newCategory] = await db.insert(schema.expenseCategories).values(category).returning();
    return newCategory;
  }

  async updateExpenseCategory(id: string, categoryData: Partial<schema.InsertExpenseCategory>) {
    const [updated] = await db
      .update(schema.expenseCategories)
      .set(categoryData)
      .where(eq(schema.expenseCategories.id, id))
      .returning();
    return updated;
  }

  async deleteExpenseCategory(id: string) {
    await db.delete(schema.expenseCategories).where(eq(schema.expenseCategories.id, id));
  }

  // Expense Claims
  async getAllExpenseClaims() {
    return await db.select().from(schema.expenseClaims).orderBy(desc(schema.expenseClaims.createdAt));
  }

  async getExpenseClaim(id: string) {
    const [claim] = await db.select().from(schema.expenseClaims).where(eq(schema.expenseClaims.id, id));
    return claim;
  }

  async createExpenseClaim(claim: schema.InsertExpenseClaim) {
    const [newClaim] = await db.insert(schema.expenseClaims).values(claim).returning();
    return newClaim;
  }

  async updateExpenseClaimStatus(id: string, status: "approved" | "rejected", reviewerId: string) {
    await db.update(schema.expenseClaims)
      .set({ status, reviewedBy: reviewerId, reviewedAt: new Date() })
      .where(eq(schema.expenseClaims.id, id));
  }

  // Performance Goals
  async getAllGoals() {
    return await db.select().from(schema.performanceGoals).orderBy(desc(schema.performanceGoals.createdAt));
  }

  async getGoal(id: string) {
    const [goal] = await db.select().from(schema.performanceGoals).where(eq(schema.performanceGoals.id, id));
    return goal;
  }

  async createGoal(goal: schema.InsertPerformanceGoal) {
    const [newGoal] = await db.insert(schema.performanceGoals).values(goal).returning();
    return newGoal;
  }

  async updateGoalProgress(id: string, progress: number) {
    await db.update(schema.performanceGoals).set({ progress }).where(eq(schema.performanceGoals.id, id));
  }

  // Appraisals
  async getAllAppraisals() {
    return await db.select().from(schema.appraisals).orderBy(desc(schema.appraisals.createdAt));
  }

  async getAppraisal(id: string) {
    const [appraisal] = await db.select().from(schema.appraisals).where(eq(schema.appraisals.id, id));
    return appraisal;
  }

  async createAppraisal(appraisal: schema.InsertAppraisal) {
    const [newAppraisal] = await db.insert(schema.appraisals).values(appraisal).returning();
    return newAppraisal;
  }

  // Feedback
  async getAllFeedback() {
    return await db.select().from(schema.feedback).orderBy(desc(schema.feedback.createdAt));
  }

  async createFeedback(feedback: schema.InsertFeedback) {
    const [newFeedback] = await db.insert(schema.feedback).values(feedback).returning();
    return newFeedback;
  }

  // Salary Configs
  async getSalaryConfig(employeeId: string) {
    const [config] = await db.select().from(schema.salaryConfigs).where(eq(schema.salaryConfigs.employeeId, employeeId));
    return config;
  }

  async createOrUpdateSalaryConfig(config: schema.InsertSalaryConfig) {
    const existing = await this.getSalaryConfig(config.employeeId);
    if (existing) {
      const [updated] = await db.update(schema.salaryConfigs)
        .set({ ...config, updatedAt: new Date() })
        .where(eq(schema.salaryConfigs.employeeId, config.employeeId))
        .returning();
      return updated;
    } else {
      const [newConfig] = await db.insert(schema.salaryConfigs).values(config).returning();
      return newConfig;
    }
  }

  // Payroll
  async getAllPayrollRecords() {
    return await db.select().from(schema.payrollRecords).orderBy(desc(schema.payrollRecords.processedAt));
  }

  async getPayrollRecordsByPeriod(period: string) {
    return await db.select().from(schema.payrollRecords).where(eq(schema.payrollRecords.period, period));
  }

  async createPayrollRecord(record: schema.InsertPayrollRecord) {
    const [newRecord] = await db.insert(schema.payrollRecords).values(record).returning();
    return newRecord;
  }

  // Job Postings
  async getAllJobPostings() {
    return await db.select().from(schema.jobPostings).orderBy(desc(schema.jobPostings.createdAt));
  }

  async getJobPosting(id: string) {
    const [job] = await db.select().from(schema.jobPostings).where(eq(schema.jobPostings.id, id));
    return job;
  }

  async createJobPosting(job: schema.InsertJobPosting) {
    const [newJob] = await db.insert(schema.jobPostings).values(job).returning();
    return newJob;
  }

  // Candidates
  async getAllCandidates() {
    return await db.select().from(schema.candidates).orderBy(desc(schema.candidates.createdAt));
  }

  async getCandidate(id: string) {
    const [candidate] = await db.select().from(schema.candidates).where(eq(schema.candidates.id, id));
    return candidate;
  }

  async createCandidate(candidate: schema.InsertCandidate) {
    const [newCandidate] = await db.insert(schema.candidates).values(candidate).returning();
    return newCandidate;
  }

  async updateCandidateStage(id: string, stage: string) {
    await db.update(schema.candidates).set({ stage: stage as any }).where(eq(schema.candidates.id, id));
  }

  // Employee Requests
  async getAllEmployeeRequests() {
    return await db.select().from(schema.employeeRequests).orderBy(desc(schema.employeeRequests.createdAt));
  }

  async getEmployeeRequestsByUser(userId: string) {
    return await db.select().from(schema.employeeRequests).where(eq(schema.employeeRequests.requestedById, userId)).orderBy(desc(schema.employeeRequests.createdAt));
  }

  async getEmployeeRequest(id: string) {
    const [request] = await db.select().from(schema.employeeRequests).where(eq(schema.employeeRequests.id, id));
    return request;
  }

  async createEmployeeRequest(request: schema.InsertEmployeeRequest) {
    const [newRequest] = await db.insert(schema.employeeRequests).values(request).returning();
    return newRequest;
  }

  async updateEmployeeRequestStatus(id: string, status: "approved" | "rejected", approverId: string, notes?: string) {
    const [updated] = await db.update(schema.employeeRequests)
      .set({
        status,
        approvedById: approverId,
        approvalNotes: notes,
        updatedAt: sql`now()`
      })
      .where(eq(schema.employeeRequests.id, id))
      .returning();
    return updated;
  }

  // Atomic approval: creates employee and updates request status in a database transaction
  async approveEmployeeRequest(requestId: string, approverId: string, notes?: string) {
    // Use database transaction to ensure atomicity
    return await db.transaction(async (tx) => {
      // Fetch and validate request within transaction
      const [request] = await tx
        .select()
        .from(schema.employeeRequests)
        .where(eq(schema.employeeRequests.id, requestId))
        .limit(1);

      if (!request) {
        throw new Error("Request not found");
      }

      if (request.status !== "pending") {
        throw new Error(`Request already ${request.status}`);
      }

      // Extract employee data from request
      const employeeData = request.requestData as any;

      // Create employee within transaction (unique constraint will be enforced)
      const [newEmployee] = await tx
        .insert(schema.employees)
        .values({
          firstName: employeeData.firstName,
          lastName: employeeData.lastName,
          email: employeeData.email,
          phone: employeeData.phone,
          departmentId: employeeData.departmentId,
          role: employeeData.role,
          biometricId: employeeData.biometricId,
          status: employeeData.status || "active",
          joiningDate: employeeData.joiningDate,
          userId: undefined,
        })
        .returning();

      // Update request status within same transaction
      const [updatedRequest] = await tx
        .update(schema.employeeRequests)
        .set({
          status: "approved" as const,
          approvedById: approverId,
          approvalNotes: notes,
          updatedAt: sql`now()`,
        })
        .where(eq(schema.employeeRequests.id, requestId))
        .returning();

      if (!updatedRequest) {
        throw new Error("Failed to update request status");
      }

      return {
        request: updatedRequest,
        employee: newEmployee,
      };
    });
  }
}

export const storage = new DbStorage();
