import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, decimal, date, pgEnum, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const roleEnum = pgEnum("role", ["system_admin", "hr_manager", "department_manager", "employee"]);
export const employmentStatusEnum = pgEnum("employment_status", ["active", "inactive", "terminated"]);
export const deviceStatusEnum = pgEnum("device_status", ["online", "offline", "syncing", "idle", "error"]);
export const leaveStatusEnum = pgEnum("leave_status", ["pending", "approved", "rejected"]);
export const expenseStatusEnum = pgEnum("expense_status", ["pending", "approved", "rejected"]);
export const jobStatusEnum = pgEnum("job_status", ["active", "closed"]);
export const candidateStageEnum = pgEnum("candidate_stage", ["applied", "screening", "interview", "offer", "hired", "rejected"]);
export const employeeRequestTypeEnum = pgEnum("employee_request_type", ["new_employee", "transfer"]);
export const employeeRequestStatusEnum = pgEnum("employee_request_status", ["pending", "approved", "rejected"]);

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table (for authentication with Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  passwordHash: varchar("password_hash"),
  role: roleEnum("role").notNull().default("employee"),
  departmentId: varchar("department_id").references(() => departments.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Departments
export const departments = pgTable("departments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Employees
export const employees = pgTable("employees", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  departmentId: varchar("department_id").references(() => departments.id),
  role: text("role").notNull(),
  biometricId: text("biometric_id").unique(),
  status: employmentStatusEnum("status").notNull().default("active"),
  joiningDate: date("joining_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Employee Requests (for Department Managers to request new employees or transfers)
export const employeeRequests = pgTable("employee_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  requestType: employeeRequestTypeEnum("request_type").notNull(),
  requestedById: varchar("requested_by_id").references(() => users.id).notNull(),
  status: employeeRequestStatusEnum("status").notNull().default("pending"),
  requestData: jsonb("request_data").notNull(),
  approvedById: varchar("approved_by_id").references(() => users.id),
  approvalNotes: text("approval_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ZKTeco Devices
export const attendanceDevices = pgTable("attendance_devices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  ipAddress: text("ip_address").notNull(),
  port: text("port").notNull().default("4370"),
  location: text("location").notNull(),
  branch: text("branch").notNull(),
  username: text("username").notNull().default("admin"),
  password: text("password").notNull().default("admin"),
  status: deviceStatusEnum("status").notNull().default("offline"),
  lastSyncAt: timestamp("last_sync_at"),
  lastSyncRecordCount: integer("last_sync_record_count"),
  lastSyncDuration: integer("last_sync_duration"),
  lastSyncSuccess: boolean("last_sync_success"),
  lastError: text("last_error"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Device Activity Logs
export const deviceActivityLogs = pgTable("device_activity_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  deviceId: varchar("device_id").references(() => attendanceDevices.id, { onDelete: "cascade" }).notNull(),
  activityType: text("activity_type").notNull(), // sync_start, sync_success, sync_error, config_change, connection_test
  details: text("details"),
  recordCount: integer("record_count"),
  duration: integer("duration"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Attendance Logs
export const attendanceLogs = pgTable("attendance_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").references(() => employees.id).notNull(),
  deviceId: varchar("device_id").references(() => attendanceDevices.id),
  checkIn: timestamp("check_in"),
  checkOut: timestamp("check_out"),
  date: date("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Leave Types
export const leaveTypes = pgTable("leave_types", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  daysAllowed: integer("days_allowed").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Leave Requests
export const leaveRequests = pgTable("leave_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").references(() => employees.id).notNull(),
  leaveTypeId: varchar("leave_type_id").references(() => leaveTypes.id).notNull(),
  fromDate: date("from_date").notNull(),
  toDate: date("to_date").notNull(),
  days: integer("days").notNull(),
  reason: text("reason").notNull(),
  status: leaveStatusEnum("status").notNull().default("pending"),
  reviewedBy: varchar("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Expense Categories
export const expenseCategories = pgTable("expense_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Expense Claims
export const expenseClaims = pgTable("expense_claims", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").references(() => employees.id).notNull(),
  categoryId: varchar("category_id").references(() => expenseCategories.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  date: date("date").notNull(),
  description: text("description").notNull(),
  receiptUrl: text("receipt_url"),
  status: expenseStatusEnum("status").notNull().default("pending"),
  reviewedBy: varchar("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Performance Goals
export const performanceGoals = pgTable("performance_goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").references(() => employees.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  progress: integer("progress").notNull().default(0),
  deadline: date("deadline").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Appraisals
export const appraisals = pgTable("appraisals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").references(() => employees.id).notNull(),
  reviewerId: varchar("reviewer_id").references(() => users.id).notNull(),
  period: text("period").notNull(),
  rating: decimal("rating", { precision: 3, scale: 1 }).notNull(),
  comments: text("comments"),
  status: leaveStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Feedback
export const feedback = pgTable("feedback", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fromUserId: varchar("from_user_id").references(() => users.id).notNull(),
  toEmployeeId: varchar("to_employee_id").references(() => employees.id).notNull(),
  type: text("type").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Salary Configurations
export const salaryConfigs = pgTable("salary_configs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").references(() => employees.id).notNull().unique(),
  basicSalary: decimal("basic_salary", { precision: 10, scale: 2 }).notNull(),
  hra: decimal("hra", { precision: 10, scale: 2 }).notNull().default("0"),
  travelAllowance: decimal("travel_allowance", { precision: 10, scale: 2 }).notNull().default("0"),
  otherAllowances: decimal("other_allowances", { precision: 10, scale: 2 }).notNull().default("0"),
  taxDeduction: decimal("tax_deduction", { precision: 10, scale: 2 }).notNull().default("0"),
  pfDeduction: decimal("pf_deduction", { precision: 10, scale: 2 }).notNull().default("0"),
  esiDeduction: decimal("esi_deduction", { precision: 10, scale: 2 }).notNull().default("0"),
  otherDeductions: decimal("other_deductions", { precision: 10, scale: 2 }).notNull().default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Payroll Records
export const payrollRecords = pgTable("payroll_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").references(() => employees.id).notNull(),
  period: text("period").notNull(),
  basicSalary: decimal("basic_salary", { precision: 10, scale: 2 }).notNull(),
  totalAllowances: decimal("total_allowances", { precision: 10, scale: 2 }).notNull(),
  totalDeductions: decimal("total_deductions", { precision: 10, scale: 2 }).notNull(),
  netPay: decimal("net_pay", { precision: 10, scale: 2 }).notNull(),
  processedAt: timestamp("processed_at").defaultNow().notNull(),
});

// Job Postings
export const jobPostings = pgTable("job_postings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  departmentId: varchar("department_id").references(() => departments.id).notNull(),
  location: text("location").notNull(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  status: jobStatusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Candidates
export const candidates = pgTable("candidates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobId: varchar("job_id").references(() => jobPostings.id).notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  stage: candidateStageEnum("stage").notNull().default("applied"),
  score: integer("score").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const insertDepartmentSchema = createInsertSchema(departments).omit({ id: true, createdAt: true });
export const insertEmployeeSchema = createInsertSchema(employees).omit({ id: true, createdAt: true });
export const insertAttendanceDeviceSchema = createInsertSchema(attendanceDevices).omit({ id: true, createdAt: true, lastSyncAt: true });
export const insertDeviceActivityLogSchema = createInsertSchema(deviceActivityLogs).omit({ id: true, createdAt: true });
export const insertAttendanceLogSchema = createInsertSchema(attendanceLogs).omit({ id: true, createdAt: true });
export const insertLeaveTypeSchema = createInsertSchema(leaveTypes).omit({ id: true, createdAt: true });
export const insertLeaveRequestSchema = createInsertSchema(leaveRequests).omit({ id: true, createdAt: true, reviewedBy: true, reviewedAt: true });
export const insertExpenseCategorySchema = createInsertSchema(expenseCategories).omit({ id: true, createdAt: true });
export const insertExpenseClaimSchema = createInsertSchema(expenseClaims).omit({ id: true, createdAt: true, reviewedBy: true, reviewedAt: true });
export const insertPerformanceGoalSchema = createInsertSchema(performanceGoals).omit({ id: true, createdAt: true });
export const insertAppraisalSchema = createInsertSchema(appraisals).omit({ id: true, createdAt: true });
export const insertFeedbackSchema = createInsertSchema(feedback).omit({ id: true, createdAt: true });
export const insertSalaryConfigSchema = createInsertSchema(salaryConfigs).omit({ id: true, createdAt: true, updatedAt: true });
export const insertPayrollRecordSchema = createInsertSchema(payrollRecords).omit({ id: true, processedAt: true });
export const insertJobPostingSchema = createInsertSchema(jobPostings).omit({ id: true, createdAt: true });
export const insertCandidateSchema = createInsertSchema(candidates).omit({ id: true, createdAt: true });
export const insertEmployeeRequestSchema = createInsertSchema(employeeRequests).omit({ id: true, createdAt: true, updatedAt: true, approvedById: true, approvalNotes: true });

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type UpsertUser = typeof users.$inferInsert;

export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;
export type Department = typeof departments.$inferSelect;

export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type Employee = typeof employees.$inferSelect;

export type InsertAttendanceDevice = z.infer<typeof insertAttendanceDeviceSchema>;
export type AttendanceDevice = typeof attendanceDevices.$inferSelect;

export type InsertDeviceActivityLog = z.infer<typeof insertDeviceActivityLogSchema>;
export type DeviceActivityLog = typeof deviceActivityLogs.$inferSelect;

export type InsertAttendanceLog = z.infer<typeof insertAttendanceLogSchema>;
export type AttendanceLog = typeof attendanceLogs.$inferSelect;

export type InsertLeaveType = z.infer<typeof insertLeaveTypeSchema>;
export type LeaveType = typeof leaveTypes.$inferSelect;

export type InsertLeaveRequest = z.infer<typeof insertLeaveRequestSchema>;
export type LeaveRequest = typeof leaveRequests.$inferSelect;

export type InsertExpenseCategory = z.infer<typeof insertExpenseCategorySchema>;
export type ExpenseCategory = typeof expenseCategories.$inferSelect;

export type InsertExpenseClaim = z.infer<typeof insertExpenseClaimSchema>;
export type ExpenseClaim = typeof expenseClaims.$inferSelect;

export type InsertPerformanceGoal = z.infer<typeof insertPerformanceGoalSchema>;
export type PerformanceGoal = typeof performanceGoals.$inferSelect;

export type InsertAppraisal = z.infer<typeof insertAppraisalSchema>;
export type Appraisal = typeof appraisals.$inferSelect;

export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type Feedback = typeof feedback.$inferSelect;

export type InsertSalaryConfig = z.infer<typeof insertSalaryConfigSchema>;
export type SalaryConfig = typeof salaryConfigs.$inferSelect;

export type InsertPayrollRecord = z.infer<typeof insertPayrollRecordSchema>;
export type PayrollRecord = typeof payrollRecords.$inferSelect;

export type InsertJobPosting = z.infer<typeof insertJobPostingSchema>;
export type JobPosting = typeof jobPostings.$inferSelect;

export type InsertCandidate = z.infer<typeof insertCandidateSchema>;
export type Candidate = typeof candidates.$inferSelect;

export type InsertEmployeeRequest = z.infer<typeof insertEmployeeRequestSchema>;
export type EmployeeRequest = typeof employeeRequests.$inferSelect;
