# HRMS - Technical Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Database Schema](#database-schema)
5. [API Reference](#api-reference)
6. [Authentication & Authorization](#authentication--authorization)
7. [Module Documentation](#module-documentation)
8. [Site Map](#site-map)
9. [Deployment Guide](#deployment-guide)
10. [Development Workflow](#development-workflow)

---

## Project Overview

### Description
HRMS (Human Resource Management System) is a comprehensive, enterprise-grade web application designed to manage the complete employee lifecycle. The system provides tools for recruitment, employee management, attendance tracking with biometric device integration, leave management, expense claims, performance reviews, and payroll processing.

### Key Features
- **Multi-tenant Role-Based Access Control (RBAC)** with 4 distinct user roles
- **ZKTeco Biometric Integration** for attendance tracking via MB100 devices
- **Real-time Dashboard Analytics** for all user roles
- **Automated Email Notifications** via Resend integration
- **Comprehensive Reporting System** with exportable data
- **Responsive Design** optimized for desktop and mobile
- **Dark/Light Theme Support** with persistent user preferences

### Target Users
- **System Administrators**: Full system configuration and user management
- **HR Managers**: Complete HR operations and workforce management
- **Department Managers**: Team management and approval workflows
- **Employees**: Self-service portal for leave, expenses, and performance tracking

---

## System Architecture

### Architecture Pattern
**Full-Stack Monolithic Architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer (React)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Pages      │  │  Components  │  │    Hooks     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/WebSocket
┌─────────────────────────────────────────────────────────────┐
│                   Server Layer (Express)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Routes      │  │  Middleware  │  │   Storage    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕ SQL/Drizzle ORM
┌─────────────────────────────────────────────────────────────┐
│              Data Layer (PostgreSQL/Neon)                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Users, Employees, Attendance, Leave, Expenses, etc. │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: 
  - TanStack Query v5 for server state
  - React Context for authentication state
  - Local state for UI interactions
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Forms**: React Hook Form with Zod validation
- **Theme**: next-themes for dark/light mode persistence

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful JSON API
- **Session Management**: express-session with PostgreSQL store
- **Authentication**: Passport.js with Local Strategy
- **ORM**: Drizzle ORM for type-safe database queries
- **Validation**: Zod schemas shared between frontend and backend
- **Email Service**: Resend for transactional emails

### Data Layer
- **Database**: PostgreSQL (Neon Serverless)
- **Schema Management**: Drizzle Kit for migrations
- **Connection Pooling**: Neon serverless driver with auto-scaling
- **Session Store**: connect-pg-simple for PostgreSQL session storage

---

## Technology Stack

### Core Technologies
| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Frontend Framework | React | 18.3.1 | UI components and rendering |
| Backend Framework | Express | 4.21.2 | HTTP server and API routes |
| Language | TypeScript | 5.6.3 | Type safety across stack |
| Database | PostgreSQL | Latest | Primary data store |
| ORM | Drizzle ORM | 0.39.1 | Type-safe database queries |
| Build Tool | Vite | 5.4.20 | Frontend build and dev server |

### Frontend Libraries
| Library | Purpose |
|---------|---------|
| wouter | Client-side routing |
| @tanstack/react-query | Server state management and caching |
| react-hook-form | Form state management |
| zod | Runtime type validation |
| @radix-ui/* | Accessible UI primitives |
| lucide-react | Icon system |
| date-fns | Date manipulation |
| recharts | Data visualization |
| framer-motion | Animations |
| next-themes | Theme management |

### Backend Libraries
| Library | Purpose |
|---------|---------|
| passport | Authentication framework |
| passport-local | Email/password authentication |
| bcrypt | Password hashing |
| express-session | Session management |
| connect-pg-simple | PostgreSQL session store |
| drizzle-zod | Zod schema generation from Drizzle |
| resend | Email service integration |
| ws | WebSocket support |

### Development Tools
| Tool | Purpose |
|------|---------|
| tsx | TypeScript execution for development |
| esbuild | Production build bundler |
| drizzle-kit | Database migration tool |
| @tailwindcss/vite | Tailwind CSS Vite plugin |

---

## Database Schema

### Entity Relationship Overview

```
users (authentication)
  ├── employees (employee records)
  │     ├── attendanceLogs
  │     ├── leaveRequests
  │     ├── expenseClaims
  │     ├── performanceGoals
  │     ├── appraisals
  │     ├── salaryConfigs
  │     └── payrollRecords
  ├── departments
  ├── employeeRequests
  └── feedback

departments
  ├── employees
  └── jobPostings
        └── candidates

attendanceDevices
  └── attendanceLogs

leaveTypes
  └── leaveRequests

expenseCategories
  └── expenseClaims
```

### Core Tables

#### users
Authentication and system access control.
```typescript
- id: varchar (UUID, primary key)
- email: varchar (unique)
- firstName: varchar
- lastName: varchar
- profileImageUrl: varchar
- passwordHash: varchar (bcrypt hashed)
- role: enum (system_admin, hr_manager, department_manager, employee)
- departmentId: varchar (foreign key)
- createdAt: timestamp
- updatedAt: timestamp
```

#### employees
Employee master records.
```typescript
- id: varchar (UUID, primary key)
- userId: varchar (foreign key to users, nullable)
- firstName: text
- lastName: text
- email: text (unique)
- phone: text
- departmentId: varchar (foreign key)
- role: text (job title)
- biometricId: text (unique, for device integration)
- status: enum (active, inactive, terminated)
- joiningDate: date
- createdAt: timestamp
```

#### departments
Organizational structure.
```typescript
- id: varchar (UUID, primary key)
- name: text
- description: text
- createdAt: timestamp
```

#### attendanceDevices
ZKTeco biometric devices configuration.
```typescript
- id: varchar (UUID, primary key)
- name: text
- ipAddress: text
- port: text (default: "4370")
- location: text
- branch: text
- status: enum (online, offline)
- lastSyncAt: timestamp
- createdAt: timestamp
```

#### attendanceLogs
Daily attendance records.
```typescript
- id: varchar (UUID, primary key)
- employeeId: varchar (foreign key)
- deviceId: varchar (foreign key)
- checkIn: timestamp
- checkOut: timestamp
- date: date
- createdAt: timestamp
```

#### leaveTypes
Leave category configuration.
```typescript
- id: varchar (UUID, primary key)
- name: text (e.g., "Sick Leave", "Annual Leave")
- daysAllowed: integer
- createdAt: timestamp
```

#### leaveRequests
Employee leave applications.
```typescript
- id: varchar (UUID, primary key)
- employeeId: varchar (foreign key)
- leaveTypeId: varchar (foreign key)
- fromDate: date
- toDate: date
- days: integer
- reason: text
- status: enum (pending, approved, rejected)
- reviewedBy: varchar (foreign key to users)
- reviewedAt: timestamp
- createdAt: timestamp
```

#### expenseCategories
Expense classification.
```typescript
- id: varchar (UUID, primary key)
- name: text (e.g., "Travel", "Food", "Accommodation")
- createdAt: timestamp
```

#### expenseClaims
Employee expense reimbursement requests.
```typescript
- id: varchar (UUID, primary key)
- employeeId: varchar (foreign key)
- categoryId: varchar (foreign key)
- amount: decimal(10,2)
- date: date
- description: text
- receiptUrl: text
- status: enum (pending, approved, rejected)
- reviewedBy: varchar (foreign key to users)
- reviewedAt: timestamp
- createdAt: timestamp
```

#### performanceGoals
Individual performance objectives.
```typescript
- id: varchar (UUID, primary key)
- employeeId: varchar (foreign key)
- title: text
- description: text
- progress: integer (0-100)
- deadline: date
- createdAt: timestamp
```

#### appraisals
Performance review records.
```typescript
- id: varchar (UUID, primary key)
- employeeId: varchar (foreign key)
- reviewerId: varchar (foreign key to users)
- period: text (e.g., "Q1 2025")
- rating: decimal(3,1) (e.g., 4.5)
- comments: text
- status: enum (pending, approved, rejected)
- createdAt: timestamp
```

#### salaryConfigs
Employee compensation structure.
```typescript
- id: varchar (UUID, primary key)
- employeeId: varchar (foreign key, unique)
- basicSalary: decimal(10,2)
- hra: decimal(10,2)
- travelAllowance: decimal(10,2)
- otherAllowances: decimal(10,2)
- taxDeduction: decimal(10,2)
- pfDeduction: decimal(10,2)
- esiDeduction: decimal(10,2)
- otherDeductions: decimal(10,2)
- createdAt: timestamp
- updatedAt: timestamp
```

#### payrollRecords
Monthly payroll processing history.
```typescript
- id: varchar (UUID, primary key)
- employeeId: varchar (foreign key)
- period: text (e.g., "January 2025")
- basicSalary: decimal(10,2)
- totalAllowances: decimal(10,2)
- totalDeductions: decimal(10,2)
- netPay: decimal(10,2)
- processedAt: timestamp
```

#### jobPostings
Open positions for recruitment.
```typescript
- id: varchar (UUID, primary key)
- title: text
- departmentId: varchar (foreign key)
- location: text
- type: text (e.g., "Full-time", "Contract")
- description: text
- status: enum (active, closed)
- createdAt: timestamp
```

#### candidates
Job applicant tracking.
```typescript
- id: varchar (UUID, primary key)
- jobId: varchar (foreign key)
- name: text
- email: text
- phone: text
- resumeUrl: text
- stage: enum (applied, screening, interview, offer, hired, rejected)
- notes: text
- createdAt: timestamp
```

#### employeeRequests
Department manager requests for new hires or transfers.
```typescript
- id: varchar (UUID, primary key)
- requestType: enum (new_employee, transfer)
- requestedById: varchar (foreign key to users)
- status: enum (pending, approved, rejected)
- requestData: jsonb
- approvedById: varchar (foreign key to users)
- approvalNotes: text
- createdAt: timestamp
- updatedAt: timestamp
```

### Database Indexes
- `IDX_session_expire` on `sessions(expire)` for session cleanup
- Unique constraints on email fields for data integrity
- Foreign key indexes automatically created by PostgreSQL

---

## API Reference

### Authentication Endpoints

#### POST /api/login
Authenticate user with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "hr_manager",
  "departmentId": "dept-uuid"
}
```

#### POST /api/logout
End user session.

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

#### GET /api/user
Get current authenticated user.

**Response (200 OK):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "hr_manager",
  "departmentId": "dept-uuid"
}
```

### Employee Management

#### GET /api/employees
List all employees with optional filtering.

**Permissions:** All authenticated users

**Query Parameters:**
- `departmentId` (optional): Filter by department

**Response (200 OK):**
```json
[
  {
    "id": "emp-uuid",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@company.com",
    "phone": "+1234567890",
    "departmentId": "dept-uuid",
    "role": "Software Engineer",
    "biometricId": "1001",
    "status": "active",
    "joiningDate": "2024-01-15"
  }
]
```

#### GET /api/employees/:id
Get single employee details.

**Permissions:** All authenticated users

**Response (200 OK):**
```json
{
  "id": "emp-uuid",
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@company.com",
  "phone": "+1234567890",
  "departmentId": "dept-uuid",
  "role": "Software Engineer",
  "biometricId": "1001",
  "status": "active",
  "joiningDate": "2024-01-15"
}
```

#### POST /api/employees
Create new employee record.

**Permissions:** `hr_manager`, `system_admin`

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@company.com",
  "phone": "+1234567890",
  "departmentId": "dept-uuid",
  "role": "Software Engineer",
  "biometricId": "1001",
  "joiningDate": "2024-01-15"
}
```

**Response (201 Created):**
```json
{
  "id": "emp-uuid",
  "firstName": "Jane",
  "lastName": "Smith",
  ...
}
```

#### PUT /api/employees/:id
Update employee information.

**Permissions:** `hr_manager`, `system_admin`

**Request Body:** (partial updates supported)
```json
{
  "phone": "+9876543210",
  "role": "Senior Software Engineer"
}
```

**Response (200 OK):**
```json
{
  "id": "emp-uuid",
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+9876543210",
  "role": "Senior Software Engineer",
  ...
}
```

### Attendance Management

#### GET /api/devices
List all attendance devices.

**Permissions:** All authenticated users

**Response (200 OK):**
```json
[
  {
    "id": "device-uuid",
    "name": "Main Office Entry",
    "ipAddress": "192.168.1.100",
    "port": "4370",
    "location": "Reception",
    "branch": "Headquarters",
    "status": "online",
    "lastSyncAt": "2025-01-15T10:30:00Z"
  }
]
```

#### POST /api/devices
Add new attendance device.

**Permissions:** `system_admin`, `hr_manager`

**Request Body:**
```json
{
  "name": "Branch Office Entry",
  "ipAddress": "192.168.2.50",
  "port": "4370",
  "location": "Reception",
  "branch": "Branch A"
}
```

#### POST /api/devices/:id/sync
Trigger manual sync with biometric device.

**Permissions:** `system_admin`, `hr_manager`

**Response (200 OK):**
```json
{
  "message": "Sync initiated",
  "recordsImported": 45
}
```

#### GET /api/attendance
Get attendance records with filtering.

**Permissions:** All authenticated users

**Query Parameters:**
- `employeeId` (optional): Filter by employee
- `startDate` (optional): Start date for range
- `endDate` (optional): End date for range

**Response (200 OK):**
```json
[
  {
    "id": "att-uuid",
    "employeeId": "emp-uuid",
    "deviceId": "device-uuid",
    "checkIn": "2025-01-15T09:00:00Z",
    "checkOut": "2025-01-15T18:00:00Z",
    "date": "2025-01-15"
  }
]
```

#### POST /api/attendance
Manual attendance entry.

**Permissions:** All authenticated users

**Request Body:**
```json
{
  "employeeId": "emp-uuid",
  "checkIn": "2025-01-15T09:00:00Z",
  "checkOut": "2025-01-15T18:00:00Z",
  "date": "2025-01-15"
}
```

### Leave Management

#### GET /api/leave/types
Get all leave types.

**Permissions:** All authenticated users

**Response (200 OK):**
```json
[
  {
    "id": "leave-type-uuid",
    "name": "Sick Leave",
    "daysAllowed": 10
  }
]
```

#### GET /api/leave/requests
Get leave requests (filtered by user role).

**Permissions:** All authenticated users

**Response (200 OK):**
```json
[
  {
    "id": "leave-uuid",
    "employeeId": "emp-uuid",
    "leaveTypeId": "leave-type-uuid",
    "fromDate": "2025-02-01",
    "toDate": "2025-02-03",
    "days": 3,
    "reason": "Medical appointment",
    "status": "pending"
  }
]
```

#### POST /api/leave/requests
Submit new leave request.

**Permissions:** All authenticated users

**Request Body:**
```json
{
  "employeeId": "emp-uuid",
  "leaveTypeId": "leave-type-uuid",
  "fromDate": "2025-02-01",
  "toDate": "2025-02-03",
  "reason": "Medical appointment"
}
```

#### PATCH /api/leave/requests/:id/approve
Approve leave request.

**Permissions:** `hr_manager`, `department_manager`

**Response (200 OK):**
```json
{
  "id": "leave-uuid",
  "status": "approved",
  "reviewedBy": "user-uuid",
  "reviewedAt": "2025-01-15T14:00:00Z"
}
```

#### PATCH /api/leave/requests/:id/reject
Reject leave request.

**Permissions:** `hr_manager`, `department_manager`

**Response (200 OK):**
```json
{
  "id": "leave-uuid",
  "status": "rejected",
  "reviewedBy": "user-uuid",
  "reviewedAt": "2025-01-15T14:00:00Z"
}
```

### Expense Management

#### GET /api/expenses/categories
Get expense categories.

**Permissions:** All authenticated users

**Response (200 OK):**
```json
[
  {
    "id": "cat-uuid",
    "name": "Travel"
  }
]
```

#### GET /api/expenses/claims
Get expense claims (filtered by role).

**Permissions:** All authenticated users

**Response (200 OK):**
```json
[
  {
    "id": "expense-uuid",
    "employeeId": "emp-uuid",
    "categoryId": "cat-uuid",
    "amount": "150.00",
    "date": "2025-01-10",
    "description": "Client meeting travel",
    "receiptUrl": "https://...",
    "status": "pending"
  }
]
```

#### POST /api/expenses/claims
Submit expense claim.

**Permissions:** All authenticated users

**Request Body:**
```json
{
  "employeeId": "emp-uuid",
  "categoryId": "cat-uuid",
  "amount": "150.00",
  "date": "2025-01-10",
  "description": "Client meeting travel",
  "receiptUrl": "https://..."
}
```

#### PATCH /api/expenses/claims/:id/approve
Approve expense claim.

**Permissions:** `hr_manager`, `department_manager`

#### PATCH /api/expenses/claims/:id/reject
Reject expense claim.

**Permissions:** `hr_manager`, `department_manager`

### Performance Management

#### GET /api/performance/goals
Get performance goals.

**Permissions:** All authenticated users

**Response (200 OK):**
```json
[
  {
    "id": "goal-uuid",
    "employeeId": "emp-uuid",
    "title": "Complete Project X",
    "description": "Lead development of new feature",
    "progress": 75,
    "deadline": "2025-03-31"
  }
]
```

#### POST /api/performance/goals
Create performance goal.

**Permissions:** All authenticated users

#### PATCH /api/performance/goals/:id
Update goal progress.

**Permissions:** All authenticated users

#### GET /api/performance/appraisals
Get performance appraisals.

**Permissions:** All authenticated users

#### POST /api/performance/appraisals
Create performance appraisal.

**Permissions:** `hr_manager`, `department_manager`

**Request Body:**
```json
{
  "employeeId": "emp-uuid",
  "period": "Q4 2024",
  "rating": 4.5,
  "comments": "Excellent performance"
}
```

#### GET /api/performance/feedback
Get feedback records.

**Permissions:** All authenticated users

#### POST /api/performance/feedback
Submit feedback.

**Permissions:** All authenticated users

### Payroll Management

#### GET /api/payroll/salary-configs/:employeeId
Get salary configuration for employee.

**Permissions:** `hr_manager`

**Response (200 OK):**
```json
{
  "id": "config-uuid",
  "employeeId": "emp-uuid",
  "basicSalary": "5000.00",
  "hra": "1000.00",
  "travelAllowance": "500.00",
  "otherAllowances": "200.00",
  "taxDeduction": "800.00",
  "pfDeduction": "600.00",
  "esiDeduction": "75.00",
  "otherDeductions": "0.00"
}
```

#### POST /api/payroll/salary-configs
Create or update salary configuration.

**Permissions:** `hr_manager`

#### GET /api/payroll/records
Get payroll processing history.

**Permissions:** `hr_manager`

#### POST /api/payroll/process
Process monthly payroll.

**Permissions:** `hr_manager`

**Request Body:**
```json
{
  "period": "January 2025"
}
```

### Recruitment

#### GET /api/recruitment/jobs
Get job postings.

**Permissions:** All authenticated users

**Response (200 OK):**
```json
[
  {
    "id": "job-uuid",
    "title": "Senior Developer",
    "departmentId": "dept-uuid",
    "location": "New York",
    "type": "Full-time",
    "description": "We are looking for...",
    "status": "active"
  }
]
```

#### POST /api/recruitment/jobs
Create job posting.

**Permissions:** `hr_manager`

#### GET /api/recruitment/candidates
Get job candidates.

**Permissions:** `hr_manager`

#### POST /api/recruitment/candidates
Add candidate.

**Permissions:** `hr_manager`

#### PATCH /api/recruitment/candidates/:id/stage
Update candidate stage.

**Permissions:** `hr_manager`

**Request Body:**
```json
{
  "stage": "interview"
}
```

### Dashboard & Reports

#### GET /api/dashboard/stats
Get dashboard statistics (role-specific).

**Permissions:** All authenticated users

**Response (200 OK):**
```json
{
  "totalEmployees": 150,
  "activeEmployees": 145,
  "pendingLeaveRequests": 12,
  "pendingExpenseClaims": 8,
  "attendanceToday": 140
}
```

#### GET /api/admin/dashboard/stats
Get system admin dashboard statistics.

**Permissions:** `system_admin`

**Response (200 OK):**
```json
{
  "totalUsers": 155,
  "totalDepartments": 8,
  "devicesOnline": 5,
  "devicesOffline": 1
}
```

### Admin Configuration

#### GET /api/admin/users
List all system users.

**Permissions:** `system_admin`

#### POST /api/admin/users
Create new system user.

**Permissions:** `system_admin`

**Request Body:**
```json
{
  "email": "newuser@company.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "hr_manager",
  "departmentId": "dept-uuid"
}
```

**Note:** Password is auto-generated and sent via email.

#### PUT /api/admin/users/:id
Update user details.

**Permissions:** `system_admin`

#### DELETE /api/admin/users/:id
Delete user account.

**Permissions:** `system_admin`

#### GET /api/admin/leave-types
Get leave types (admin view).

**Permissions:** `system_admin`

#### POST /api/admin/leave-types
Create leave type.

**Permissions:** `system_admin`

#### PUT /api/admin/leave-types/:id
Update leave type.

**Permissions:** `system_admin`

#### DELETE /api/admin/leave-types/:id
Delete leave type.

**Permissions:** `system_admin`

#### GET /api/admin/expense-categories
Get expense categories (admin view).

**Permissions:** `system_admin`

#### POST /api/admin/expense-categories
Create expense category.

**Permissions:** `system_admin`

#### PUT /api/admin/expense-categories/:id
Update expense category.

**Permissions:** `system_admin`

#### DELETE /api/admin/expense-categories/:id
Delete expense category.

**Permissions:** `system_admin`

---

## Authentication & Authorization

### Authentication Flow

1. **User Login**
   - User submits email and password
   - Server validates credentials using bcrypt
   - Passport.js creates session
   - Session stored in PostgreSQL
   - Session cookie sent to client (HTTP-only, secure)

2. **Session Management**
   - Every request includes session cookie
   - Server validates session from PostgreSQL
   - User object attached to `req.user`
   - Session expires after inactivity

3. **Logout**
   - Server destroys session
   - Client cookie cleared
   - User redirected to login

### Authorization (RBAC)

#### Role Hierarchy
```
system_admin (Highest privilege)
  └─ Full system configuration access
     └─ User management
     └─ System settings
     └─ Device configuration

hr_manager
  └─ Complete HR operations
     └─ Employee management
     └─ Leave approval
     └─ Expense approval
     └─ Payroll processing
     └─ Recruitment

department_manager
  └─ Team management
     └─ Team leave approval
     └─ Team expense approval
     └─ Performance reviews
     └─ Employee requests

employee (Base access)
  └─ Self-service portal
     └─ Leave requests
     └─ Expense claims
     └─ Performance goals
     └─ Attendance view
```

#### Permission Matrix

| Feature | System Admin | HR Manager | Dept Manager | Employee |
|---------|--------------|------------|--------------|----------|
| User Management | ✓ | ✗ | ✗ | ✗ |
| Department Config | ✓ | ✗ | ✗ | ✗ |
| Device Management | ✓ | ✗ | ✗ | ✗ |
| Leave Type Config | ✓ | ✗ | ✗ | ✗ |
| Expense Cat. Config | ✓ | ✗ | ✗ | ✗ |
| Employee CRUD | ✓ | ✓ | ✗ | ✗ |
| Leave Approval | ✓ | ✓ | ✓ (own dept) | ✗ |
| Expense Approval | ✓ | ✓ | ✓ (own dept) | ✗ |
| Payroll Processing | ✓ | ✓ | ✗ | ✗ |
| Recruitment | ✓ | ✓ | ✗ | ✗ |
| Leave Request | ✓ | ✓ | ✓ | ✓ |
| Expense Claim | ✓ | ✓ | ✓ | ✓ |
| Performance Goals | ✓ | ✓ | ✓ | ✓ |
| View Own Data | ✓ | ✓ | ✓ | ✓ |

#### Middleware Implementation
```typescript
// Backend: server/routes.ts
function requireRole(...allowedRoles: string[]) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    next();
  };
}

// Usage
app.post("/api/employees", requireRole("hr_manager", "system_admin"), ...);
```

```typescript
// Frontend: client/src/components/RequireRole.tsx
export function RequireRole({ 
  allowedRoles, 
  children 
}: { 
  allowedRoles: string[], 
  children: React.ReactNode 
}) {
  const { user } = useAuth();
  
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
}

// Usage in routes
<Route path="/admin/users">
  {() => (
    <RequireRole allowedRoles={["system_admin"]}>
      <UserManagement />
    </RequireRole>
  )}
</Route>
```

---

## Module Documentation

### 1. Dashboard Module
**Purpose:** Role-specific overview and analytics

**Features:**
- Quick stats display (employees, attendance, pending approvals)
- Recent activity timeline
- Shortcuts to common actions
- Role-based widget customization

**Access:** All authenticated users

**Files:**
- `client/src/pages/dashboard.tsx`
- `client/src/pages/admin/dashboard.tsx`
- `server/routes.ts` (GET /api/dashboard/stats)

### 2. Recruitment Module
**Purpose:** Job posting and candidate tracking

**Features:**
- Job posting creation and management
- Candidate application tracking
- Interview stage progression
- Candidate notes and history

**Access:** HR Manager, System Admin

**Files:**
- `client/src/pages/recruitment.tsx`
- `client/src/pages/job-detail.tsx`
- `server/routes.ts` (recruitment endpoints)

### 3. Employee Management Module
**Purpose:** Employee lifecycle management

**Features:**
- Employee directory with search and filters
- Employee profile management
- Department assignment
- Biometric ID mapping
- Employment status tracking

**Access:** HR Manager, System Admin (full); Others (view only)

**Files:**
- `client/src/pages/employees.tsx`
- `client/src/pages/employee-detail.tsx`
- `server/routes.ts` (employee endpoints)

### 4. Attendance Module
**Purpose:** Time tracking via biometric devices

**Features:**
- ZKTeco device integration (MB100)
- Real-time attendance logs
- Calendar view of attendance
- Manual attendance entry
- Comprehensive filtering (date, department, location)
- Device sync management

**Device Integration:**
- TCP/IP connection to ZKTeco devices
- Port 4370 (default)
- Real-time connection testing
- API mode support with script upload

**Access:** All users (view own); HR/Admin (view all, manage devices)

**Files:**
- `client/src/pages/attendance.tsx`
- `client/src/pages/attendance-entry.tsx`
- `client/src/pages/admin/devices.tsx`
- `client/src/pages/device-configuration.tsx`
- `server/routes.ts` (attendance & device endpoints)

### 5. Leave Management Module
**Purpose:** Leave request and approval workflow

**Features:**
- Leave type configuration (Sick, Annual, etc.)
- Leave balance tracking
- Request submission with date picker
- Multi-level approval workflow
- Leave calendar view
- Leave history

**Access:** All users (request); Managers (approve)

**Files:**
- `client/src/pages/leave.tsx`
- `client/src/pages/leave-configuration.tsx`
- `client/src/pages/leave-approval.tsx`
- `client/src/pages/admin/leave-types-config.tsx`
- `server/routes.ts` (leave endpoints)

### 6. Expense Management Module
**Purpose:** Expense claim submission and reimbursement

**Features:**
- Expense category management
- Claim submission with receipt upload
- Amount and description tracking
- Approval workflow
- Expense reports

**Access:** All users (claim); Managers (approve)

**Files:**
- `client/src/pages/expenses.tsx`
- `client/src/pages/expense-approval.tsx`
- `client/src/pages/admin/expense-categories-config.tsx`
- `server/routes.ts` (expense endpoints)

### 7. Performance Management Module
**Purpose:** Goal setting and performance reviews

**Features:**
- Performance goal creation
- Progress tracking (0-100%)
- Performance appraisals
- 360-degree feedback
- Rating system

**Access:** All users (own goals); Managers (appraisals)

**Files:**
- `client/src/pages/performance.tsx`
- `server/routes.ts` (performance endpoints)

### 8. Payroll Module
**Purpose:** Salary configuration and payroll processing

**Features:**
- Salary component breakdown (Basic, HRA, Allowances)
- Deduction management (Tax, PF, ESI)
- Monthly payroll processing
- Payslip generation
- Net pay calculation

**Access:** HR Manager, System Admin only

**Files:**
- `client/src/pages/payroll.tsx`
- `client/src/pages/salary-configuration.tsx`
- `server/routes.ts` (payroll endpoints)

### 9. Reports Module
**Purpose:** Data analytics and exportable reports

**Features:**
- Attendance reports
- Leave summary reports
- Expense reports
- Performance analytics
- Exportable data (CSV, PDF)

**Access:** HR Manager, System Admin, Department Manager

**Files:**
- `client/src/pages/reports.tsx`
- `server/routes.ts` (dashboard stats endpoints)

### 10. Settings Module
**Purpose:** User preferences and system configuration

**Features:**
- Profile management
- Password change
- Theme preferences (dark/light)
- Notification settings
- Department management (delegated)

**Access:** All users (own settings); Admins (system config)

**Files:**
- `client/src/pages/settings.tsx`
- `client/src/pages/department-management.tsx`

### 11. System Admin Module
**Purpose:** Platform-wide configuration and user management

**Features:**
- User account management (CRUD)
- Role assignment
- Department configuration
- Leave type management
- Expense category setup
- Device configuration
- Automated credential emails via Resend

**Access:** System Admin only

**Files:**
- `client/src/pages/admin/dashboard.tsx`
- `client/src/pages/admin/user-management.tsx`
- `client/src/pages/admin/department-config.tsx`
- `client/src/pages/admin/leave-types-config.tsx`
- `client/src/pages/admin/expense-categories-config.tsx`
- `client/src/pages/admin/devices.tsx`
- `server/routes.ts` (admin endpoints)

---

## Site Map

### Public Routes
```
/                    Landing page (unauthenticated users)
/login               Login page
```

### Authenticated User Routes

#### Common Routes (All Roles)
```
/                    Dashboard (role-specific view)
/employees           Employee directory
/employees/:id       Employee detail view
/attendance          Attendance records & calendar
/attendance-entry    Manual attendance entry
/leave               My leave requests
/expenses            My expense claims
/performance         Performance goals & feedback
/settings            User settings & preferences
```

#### Department Manager Routes
```
/leave-approval      Team leave approvals
/expense-approval    Team expense approvals
/settings/departments Department management
```

#### HR Manager Routes
```
/recruitment         Job postings
/recruitment/job/:id Job detail & candidates
/leave-approval      All leave approvals
/expense-approval    All expense approvals
/payroll             Payroll management
/payroll/salary/:employeeId Salary configuration
/reports             Analytics & reports
```

#### System Admin Routes
```
/admin               Admin dashboard
/admin/users         User management
/admin/departments   Department configuration
/admin/devices       Attendance device management
/admin/device/:id    Device configuration
/admin/leave-types   Leave type configuration
/admin/expense-categories Expense category configuration
```

### Route Structure Diagram
```
/ (root)
├── Login/Landing (unauthenticated)
│
└── Authenticated Area
    ├── Dashboard (/)
    │
    ├── Recruitment (/recruitment)
    │   └── Job Detail (/recruitment/job/:id)
    │
    ├── Employees (/employees)
    │   └── Employee Detail (/employees/:id)
    │
    ├── Attendance (/attendance)
    │   └── Attendance Entry (/attendance-entry)
    │
    ├── Leave (/leave)
    │   ├── Leave Configuration (/leave-configuration)
    │   └── Leave Approval (/leave-approval)
    │
    ├── Expenses (/expenses)
    │   └── Expense Approval (/expense-approval)
    │
    ├── Performance (/performance)
    │
    ├── Payroll (/payroll)
    │   └── Salary Config (/payroll/salary/:employeeId)
    │
    ├── Reports (/reports)
    │
    ├── Settings (/settings)
    │   └── Departments (/settings/departments)
    │
    └── Admin Portal (/admin)
        ├── Admin Dashboard (/admin)
        ├── User Management (/admin/users)
        ├── Departments (/admin/departments)
        ├── Devices (/admin/devices)
        │   └── Device Config (/admin/device/:id)
        ├── Leave Types (/admin/leave-types)
        └── Expense Categories (/admin/expense-categories)
```

---

## Deployment Guide

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (Neon recommended)
- Resend API key for email notifications
- Domain name (optional, for custom domains)

### Environment Variables
Create `.env` file in project root:

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname
PGHOST=your-host.neon.tech
PGDATABASE=hrms_production
PGUSER=db_user
PGPASSWORD=db_password
PGPORT=5432

# Session
SESSION_SECRET=your-random-secret-key-here

# Email Service
RESEND_API_KEY=re_your_resend_api_key

# Environment
NODE_ENV=production
```

### Development Setup

1. **Clone and Install Dependencies**
   ```bash
   git clone <repository-url>
   cd hrms-project
   npm install
   ```

2. **Database Setup**
   ```bash
   # Push schema to database
   npm run db:push
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   - Frontend: http://localhost:5000
   - Backend: Same port (Vite dev server proxy)

### Production Build

1. **Build Application**
   ```bash
   npm run build
   ```
   - Builds frontend static assets to `dist/public`
   - Bundles backend to `dist/index.js`

2. **Start Production Server**
   ```bash
   npm start
   ```
   - Serves on configured port (default: 5000)

### Replit Deployment

This application is optimized for Replit deployment:

1. **Fork/Import Project** to Replit
2. **Configure Secrets** in Replit Secrets panel:
   - `DATABASE_URL`
   - `SESSION_SECRET`
   - `RESEND_API_KEY`
3. **Database**: Use Replit PostgreSQL integration
4. **Run**: Application starts automatically via `.replit` config
5. **Publish**: Click "Publish" for production deployment

### Database Migration Strategy

**Important:** This project uses Drizzle Kit for schema management.

```bash
# Development: Push schema changes
npm run db:push

# Force push (if needed)
npm run db:push -- --force
```

**Never manually write SQL migrations.** Drizzle Kit handles schema synchronization.

### Post-Deployment Checklist

- [ ] Database schema pushed successfully
- [ ] Environment variables configured
- [ ] Test login with default credentials
- [ ] Create first System Admin user
- [ ] Configure departments
- [ ] Set up leave types
- [ ] Set up expense categories
- [ ] Configure attendance devices (if applicable)
- [ ] Test email notifications
- [ ] Verify RBAC permissions
- [ ] Enable HTTPS/SSL
- [ ] Set up backups

### Production Security Considerations

1. **Session Security**
   - Use strong `SESSION_SECRET` (32+ random characters)
   - Enable secure cookies in production
   - Set appropriate session timeout

2. **Database Security**
   - Use connection pooling
   - Enable SSL for database connections
   - Restrict database access by IP

3. **API Security**
   - HTTPS only in production
   - CORS configuration
   - Rate limiting (recommended)

4. **Password Policy**
   - Bcrypt hashing (already implemented)
   - Minimum password complexity
   - Regular password rotation reminders

---

## Development Workflow

### Project Structure
```
hrms-project/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   └── ui/       # shadcn/ui components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions
│   │   ├── pages/        # Page components (routes)
│   │   │   └── admin/   # Admin-specific pages
│   │   ├── App.tsx       # Main app component & routing
│   │   └── index.css     # Global styles & theme
│   └── public/           # Static assets
│
├── server/                # Backend Express application
│   ├── routes.ts         # API route handlers
│   ├── storage.ts        # Database abstraction layer
│   ├── index-dev.ts      # Development server entry
│   └── index-prod.ts     # Production server entry
│
├── shared/               # Shared code (types, schemas)
│   └── schema.ts         # Drizzle schema & Zod validators
│
├── docs/                 # Documentation (you are here!)
│
├── package.json          # Dependencies & scripts
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite build configuration
├── tailwind.config.ts    # Tailwind CSS configuration
└── drizzle.config.ts     # Database configuration
```

### Development Scripts

```bash
# Start development server (hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# TypeScript type checking
npm run check

# Database schema push
npm run db:push
```

### Adding New Features

#### 1. Define Database Schema
Edit `shared/schema.ts`:
```typescript
export const myNewTable = pgTable("my_new_table", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Generate Zod schema for validation
export const insertMyNewTableSchema = createInsertSchema(myNewTable).omit({
  id: true,
  createdAt: true,
});

// TypeScript types
export type InsertMyNewTable = z.infer<typeof insertMyNewTableSchema>;
export type SelectMyNewTable = typeof myNewTable.$inferSelect;
```

#### 2. Push Schema to Database
```bash
npm run db:push
```

#### 3. Create API Routes
Edit `server/routes.ts`:
```typescript
app.get("/api/my-resource", async (req, res) => {
  const results = await storage.getMyResources();
  res.json(results);
});

app.post("/api/my-resource", requireRole("hr_manager"), async (req, res) => {
  const validatedData = insertMyNewTableSchema.parse(req.body);
  const created = await storage.createMyResource(validatedData);
  res.status(201).json(created);
});
```

#### 4. Update Storage Interface
Edit `server/storage.ts`:
```typescript
interface IStorage {
  // ... existing methods
  getMyResources(): Promise<SelectMyNewTable[]>;
  createMyResource(data: InsertMyNewTable): Promise<SelectMyNewTable>;
}
```

#### 5. Create Frontend Page
Create `client/src/pages/my-feature.tsx`:
```typescript
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function MyFeature() {
  const { data, isLoading } = useQuery({
    queryKey: ["/api/my-resource"],
  });
  
  const createMutation = useMutation({
    mutationFn: (data: InsertMyNewTable) =>
      apiRequest("/api/my-resource", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/my-resource"] });
    },
  });
  
  return <div>Your UI here</div>;
}
```

#### 6. Add Route
Edit `client/src/App.tsx`:
```typescript
import MyFeature from "@/pages/my-feature";

// In Router component:
<Route path="/my-feature" component={MyFeature} />
```

#### 7. Add Navigation
Edit `client/src/components/app-sidebar.tsx`:
```typescript
{
  title: "My Feature",
  url: "/my-feature",
  icon: IconComponent,
}
```

### Coding Standards

#### TypeScript
- Strict mode enabled
- No `any` types (use `unknown` if necessary)
- Explicit return types for functions
- Interface for object shapes

#### React
- Functional components only
- Custom hooks for reusable logic
- Proper dependency arrays in `useEffect`
- Memoization for expensive computations

#### CSS/Tailwind
- Use Tailwind utility classes
- Follow shadcn/ui component patterns
- Maintain consistent spacing scale
- Responsive design (mobile-first)

#### API Design
- RESTful conventions
- Consistent error responses
- HTTP status codes (200, 201, 400, 401, 403, 404, 500)
- Request/response validation with Zod

### Testing Strategy

**Current State:** No automated tests implemented.

**Recommended Testing Approach:**
1. **Unit Tests**: Vitest for utility functions
2. **Integration Tests**: API route testing with Supertest
3. **E2E Tests**: Playwright for critical user flows
4. **Manual Testing**: Comprehensive checklist per module

### Git Workflow

**Branching Strategy:**
- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: New features
- `bugfix/*`: Bug fixes
- `hotfix/*`: Urgent production fixes

**Commit Convention:**
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Example:
```
feat(attendance): add device sync status indicator

- Display last sync timestamp
- Show online/offline status with color coding
- Add manual sync button for admins
```

---

## Performance Optimization

### Database
- Indexes on foreign keys and frequently queried columns
- Connection pooling via Neon serverless
- Limit query result sets
- Pagination for large datasets

### Frontend
- Code splitting via Vite
- Lazy loading for routes
- TanStack Query caching
- Image optimization
- Debouncing search inputs

### Backend
- Response compression
- Static asset caching
- Session store in PostgreSQL (not memory)
- Efficient SQL queries (avoid N+1)

---

## Troubleshooting

### Common Issues

**Issue:** Database connection errors
- **Solution:** Check `DATABASE_URL` format and credentials
- Verify database is accessible
- Check firewall/security group settings

**Issue:** Session not persisting
- **Solution:** Ensure `SESSION_SECRET` is set
- Verify PostgreSQL session table exists
- Check cookie settings (secure flag in production)

**Issue:** Email notifications not sending
- **Solution:** Verify `RESEND_API_KEY` is valid
- Check Resend domain verification
- Review email template formatting

**Issue:** RBAC not working correctly
- **Solution:** Verify user role in database
- Check `requireRole` middleware usage
- Ensure frontend route guards are in place

**Issue:** Device sync failing
- **Solution:** Verify device IP and port
- Check network connectivity
- Confirm ZKTeco device firmware compatibility

---

## Support & Maintenance

### Monitoring
- Application logs via console
- Database query performance
- Session store cleanup
- Error tracking (recommended: Sentry)

### Backup Strategy
- Daily database backups (automated)
- Backup retention: 30 days
- Test restore procedures quarterly

### Update Policy
- Security patches: Immediate
- Dependency updates: Monthly
- Feature updates: Quarterly
- Major version upgrades: Annually

---

## Appendix

### Color Scheme
- **Primary**: #1965ae (Blue)
- **Background (Light)**: #ffffff
- **Background (Dark)**: #0a0a0a
- **Card (Light)**: #fcfcfc
- **Card (Dark)**: #141414

### Typography
- **Font Family**: Poppins (sans-serif)
- **Sizes**: 
  - Heading 1: 2rem (32px)
  - Heading 2: 1.5rem (24px)
  - Body: 0.875rem (14px)
  - Small: 0.75rem (12px)

### Browser Support
- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile: iOS 14+, Android 10+

### License
MIT License

### Version History
- **v1.0.0** (Current): Initial production release
  - Complete HRMS functionality
  - ZKTeco biometric integration
  - 4-tier RBAC system
  - Email notifications
  - Dark/light theme support

---

**Document Version:** 1.0  
**Last Updated:** November 22, 2025  
**Maintained By:** Development Team
