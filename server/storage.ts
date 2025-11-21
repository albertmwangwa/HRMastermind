import { db } from "@db";
import * as schema from "@shared/schema";
import { eq, and, gte, lte, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<schema.User | undefined>;
  getUserByEmail(email: string): Promise<schema.User | undefined>;
  createUser(user: schema.InsertUser): Promise<schema.User>;
  
  // Departments
  getAllDepartments(): Promise<schema.Department[]>;
  createDepartment(dept: schema.InsertDepartment): Promise<schema.Department>;
  
  // Employees
  getAllEmployees(): Promise<schema.Employee[]>;
  getEmployee(id: string): Promise<schema.Employee | undefined>;
  createEmployee(employee: schema.InsertEmployee): Promise<schema.Employee>;
  updateEmployee(id: string, employee: Partial<schema.InsertEmployee>): Promise<schema.Employee | undefined>;
  
  // Attendance Devices
  getAllDevices(): Promise<schema.AttendanceDevice[]>;
  getDevice(id: string): Promise<schema.AttendanceDevice | undefined>;
  createDevice(device: schema.InsertAttendanceDevice): Promise<schema.AttendanceDevice>;
  updateDeviceStatus(id: string, status: "online" | "offline"): Promise<void>;
  updateDeviceLastSync(id: string): Promise<void>;
  
  // Attendance Logs
  getAttendanceLogsByDate(date: Date): Promise<schema.AttendanceLog[]>;
  getAttendanceLogsByEmployee(employeeId: string): Promise<schema.AttendanceLog[]>;
  createAttendanceLog(log: schema.InsertAttendanceLog): Promise<schema.AttendanceLog>;
  
  // Leave Types
  getAllLeaveTypes(): Promise<schema.LeaveType[]>;
  createLeaveType(type: schema.InsertLeaveType): Promise<schema.LeaveType>;
  
  // Leave Requests
  getAllLeaveRequests(): Promise<schema.LeaveRequest[]>;
  getLeaveRequest(id: string): Promise<schema.LeaveRequest | undefined>;
  createLeaveRequest(request: schema.InsertLeaveRequest): Promise<schema.LeaveRequest>;
  updateLeaveRequestStatus(id: string, status: "approved" | "rejected", reviewerId: string): Promise<void>;
  
  // Expense Categories
  getAllExpenseCategories(): Promise<schema.ExpenseCategory[]>;
  createExpenseCategory(category: schema.InsertExpenseCategory): Promise<schema.ExpenseCategory>;
  
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
}

export class DbStorage implements IStorage {
  // Users
  async getUser(id: string) {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return user;
  }

  async getUserByEmail(email: string) {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.email, email));
    return user;
  }

  async createUser(user: schema.InsertUser) {
    const [newUser] = await db.insert(schema.users).values(user).returning();
    return newUser;
  }

  // Departments
  async getAllDepartments() {
    return await db.select().from(schema.departments);
  }

  async createDepartment(dept: schema.InsertDepartment) {
    const [newDept] = await db.insert(schema.departments).values(dept).returning();
    return newDept;
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

  async updateDeviceStatus(id: string, status: "online" | "offline") {
    await db.update(schema.attendanceDevices).set({ status }).where(eq(schema.attendanceDevices.id, id));
  }

  async updateDeviceLastSync(id: string) {
    await db.update(schema.attendanceDevices).set({ lastSyncAt: new Date() }).where(eq(schema.attendanceDevices.id, id));
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

  async createLeaveType(type: schema.InsertLeaveType) {
    const [newType] = await db.insert(schema.leaveTypes).values(type).returning();
    return newType;
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

  async createExpenseCategory(category: schema.InsertExpenseCategory) {
    const [newCategory] = await db.insert(schema.expenseCategories).values(category).returning();
    return newCategory;
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
}

export const storage = new DbStorage();
