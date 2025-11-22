# HRMS - Complete Site Map

## Visual Site Map

```
HRMS Application
│
├── 🌐 Public Routes (Unauthenticated)
│   ├── / (Landing Page)
│   │   └── Description: Marketing landing page with system overview
│   │       Features: Product highlights, login CTA
│   │
│   └── /login (Login Page)
│       └── Description: Email/password authentication
│           Features: Login form, password recovery link
│
└── 🔒 Authenticated Routes
    │
    ├── 📊 Dashboard Routes
    │   │
    │   ├── / (Main Dashboard)
    │   │   ├── System Admin: System overview, user stats, device status
    │   │   ├── HR Manager: HR metrics, pending approvals, employee stats
    │   │   ├── Dept Manager: Team overview, pending approvals
    │   │   └── Employee: Personal overview, upcoming events
    │   │
    │   └── /admin (Admin Dashboard)
    │       └── Access: System Admin only
    │           Features: System statistics, user management shortcuts
    │
    ├── 👥 Recruitment Module
    │   │
    │   ├── /recruitment
    │   │   └── Access: HR Manager, System Admin
    │   │       Features: Job postings list, create new job, filter by status
    │   │
    │   └── /recruitment/job/:id
    │       └── Access: HR Manager, System Admin
    │           Features: Job details, candidate list, stage management
    │
    ├── 👤 Employee Management
    │   │
    │   ├── /employees
    │   │   └── Access: All roles (permissions vary)
    │   │       Features: Employee directory, search, filters, add employee
    │   │       Permissions:
    │   │         - HR/Admin: Full CRUD access
    │   │         - Others: View only
    │   │
    │   └── /employees/:id
    │       └── Access: All roles (view permissions vary)
    │           Features: Full employee profile, edit details, attendance history
    │
    ├── ⏰ Attendance Management
    │   │
    │   ├── /attendance
    │   │   └── Access: All roles
    │   │       Features: Attendance records, calendar view, filters
    │   │       Views:
    │   │         - Attendance Records tab
    │   │         - Calendar View tab
    │   │       Filters:
    │   │         - Time period (Today, This Week, Month, Custom Range)
    │   │         - Department
    │   │         - Location
    │   │         - Company/Branch
    │   │
    │   └── /attendance-entry
    │       └── Access: All roles
    │           Features: Manual check-in/out entry, date picker
    │
    ├── 📅 Leave Management
    │   │
    │   ├── /leave
    │   │   └── Access: All roles
    │   │       Features: My leave requests, leave balance, request new leave
    │   │       Views:
    │   │         - My Requests
    │   │         - Leave Balance
    │   │         - Request Leave form
    │   │
    │   ├── /leave-configuration
    │   │   └── Access: All roles
    │   │       Features: Leave type overview, available days
    │   │
    │   └── /leave-approval
    │       └── Access: HR Manager, Dept Manager, System Admin
    │           Features: Pending approvals, approve/reject, leave history
    │           Scope:
    │             - HR Manager: All requests
    │             - Dept Manager: Own department only
    │
    ├── 💰 Expense Management
    │   │
    │   ├── /expenses
    │   │   └── Access: All roles
    │   │       Features: My expense claims, submit new claim, upload receipt
    │   │       Views:
    │   │         - My Claims
    │   │         - Submit Claim form
    │   │
    │   └── /expense-approval
    │       └── Access: HR Manager, Dept Manager, System Admin
    │           Features: Pending claims, approve/reject, expense history
    │           Scope:
    │             - HR Manager: All claims
    │             - Dept Manager: Own department only
    │
    ├── 📈 Performance Management
    │   │
    │   └── /performance
    │       └── Access: All roles
    │           Features: Performance goals, progress tracking, appraisals, feedback
    │           Views:
    │             - My Goals
    │             - Appraisals (view/create based on role)
    │             - 360 Feedback
    │
    ├── 💵 Payroll Management
    │   │
    │   ├── /payroll
    │   │   └── Access: HR Manager, System Admin
    │   │       Features: Employee payroll list, process payroll, payroll history
    │   │       Actions:
    │   │         - View all employee salaries
    │   │         - Process monthly payroll
    │   │         - Generate payslips
    │   │
    │   └── /payroll/salary/:employeeId
    │       └── Access: HR Manager, System Admin
    │           Features: Salary configuration, allowances, deductions, net pay
    │           Components:
    │             - Basic Salary
    │             - Allowances (HRA, Travel, Other)
    │             - Deductions (Tax, PF, ESI, Other)
    │             - Net Pay calculation
    │
    ├── 📊 Reports Module
    │   │
    │   └── /reports
    │       └── Access: HR Manager, Dept Manager, System Admin
    │           Features: Various analytics reports, export functionality
    │           Reports:
    │             - Attendance Summary
    │             - Leave Analytics
    │             - Expense Reports
    │             - Performance Metrics
    │           Export: CSV, PDF
    │
    ├── ⚙️ Settings Module
    │   │
    │   ├── /settings
    │   │   └── Access: All roles
    │   │       Features: User profile, password change, theme toggle, notifications
    │   │       Settings:
    │   │         - Profile Information
    │   │         - Security (Change Password)
    │   │         - Appearance (Light/Dark Theme)
    │   │         - Notifications
    │   │
    │   └── /settings/departments
    │       └── Access: HR Manager, System Admin
    │           Features: Department management (delegated from admin)
    │
    └── 🛡️ System Admin Portal
        │
        ├── /admin
        │   └── Access: System Admin only
        │       Features: System dashboard, quick access to admin functions
        │
        ├── /admin/users
        │   └── Access: System Admin only
        │       Features: User account management (CRUD), role assignment
        │       Actions:
        │         - Create new user (auto-generate password)
        │         - Edit user details and role
        │         - Delete user account
        │         - Send credential email (via Resend)
        │
        ├── /admin/departments
        │   └── Access: System Admin only
        │       Features: Department configuration, create/edit/delete
        │       Actions:
        │         - Add new department
        │         - Edit department details
        │         - Delete department (with validation)
        │
        ├── /admin/devices
        │   └── Access: System Admin only
        │       Features: ZKTeco device management, device list
        │       Actions:
        │         - View all devices with status
        │         - Add new device
        │         - Delete device (with confirmation)
        │         - Navigate to device configuration
        │         - Test device connection
        │
        ├── /admin/device/:id
        │   └── Access: System Admin only
        │       Features: Device configuration, connection settings, advanced settings
        │       Settings:
        │         - Device Name
        │         - IP Address & Port
        │         - Location & Branch
        │         - Connection Testing (TCP/API)
        │         - ZKTeco API Mode (script upload)
        │       Actions:
        │         - Test Connection (real TCP/API test)
        │         - Save Configuration
        │         - Upload API Script (.js, .json, .txt, .xml)
        │         - Manual Sync
        │
        ├── /admin/leave-types
        │   └── Access: System Admin only
        │       Features: Leave type configuration, days allowed
        │       Actions:
        │         - Add new leave type
        │         - Edit leave type and days allowed
        │         - Delete leave type
        │
        └── /admin/expense-categories
            └── Access: System Admin only
                Features: Expense category management
                Actions:
                  - Add new expense category
                  - Edit category name
                  - Delete category
```

## Route Access Matrix

| Route | System Admin | HR Manager | Dept Manager | Employee |
|-------|--------------|------------|--------------|----------|
| `/` (Landing) | ✓ | ✓ | ✓ | ✓ |
| `/login` | ✓ | ✓ | ✓ | ✓ |
| `/` (Dashboard) | ✓ | ✓ | ✓ | ✓ |
| `/recruitment` | ✓ | ✓ | ✗ | ✗ |
| `/recruitment/job/:id` | ✓ | ✓ | ✗ | ✗ |
| `/employees` | ✓ (edit) | ✓ (edit) | ✓ (view) | ✓ (view) |
| `/employees/:id` | ✓ (edit) | ✓ (edit) | ✓ (view) | ✓ (view) |
| `/attendance` | ✓ | ✓ | ✓ | ✓ |
| `/attendance-entry` | ✓ | ✓ | ✓ | ✓ |
| `/leave` | ✓ | ✓ | ✓ | ✓ |
| `/leave-configuration` | ✓ | ✓ | ✓ | ✓ |
| `/leave-approval` | ✓ (all) | ✓ (all) | ✓ (dept) | ✗ |
| `/expenses` | ✓ | ✓ | ✓ | ✓ |
| `/expense-approval` | ✓ (all) | ✓ (all) | ✓ (dept) | ✗ |
| `/performance` | ✓ | ✓ | ✓ | ✓ |
| `/payroll` | ✓ | ✓ | ✗ | ✗ |
| `/payroll/salary/:id` | ✓ | ✓ | ✗ | ✗ |
| `/reports` | ✓ | ✓ | ✓ (limited) | ✗ |
| `/settings` | ✓ | ✓ | ✓ | ✓ |
| `/settings/departments` | ✓ | ✓ | ✗ | ✗ |
| `/admin` | ✓ | ✗ | ✗ | ✗ |
| `/admin/users` | ✓ | ✗ | ✗ | ✗ |
| `/admin/departments` | ✓ | ✗ | ✗ | ✗ |
| `/admin/devices` | ✓ | ✗ | ✗ | ✗ |
| `/admin/device/:id` | ✓ | ✗ | ✗ | ✗ |
| `/admin/leave-types` | ✓ | ✗ | ✗ | ✗ |
| `/admin/expense-categories` | ✓ | ✗ | ✗ | ✗ |

**Legend:**
- ✓ Full Access
- ✓ (edit) Can view and edit
- ✓ (view) Can view only
- ✓ (all) Can access all records
- ✓ (dept) Can access own department only
- ✓ (limited) Limited access to own department data
- ✗ No Access

## Navigation Flow

### System Admin Journey
```
Login → Admin Dashboard → User Management / Department Config / Device Management / Leave Types / Expense Categories
                        ↓
                   Device Configuration → Test Connection → Save
                        ↓
                   All Standard User Features (with full permissions)
```

### HR Manager Journey
```
Login → HR Dashboard → Recruitment / Employees / Payroll / Reports
                     ↓
                Leave Approval / Expense Approval (all departments)
                     ↓
                Settings / Department Management
```

### Department Manager Journey
```
Login → Dept Dashboard → My Team (Employees)
                       ↓
                  Leave Approval / Expense Approval (own dept only)
                       ↓
                  Performance Reviews (team members)
                       ↓
                  Self-service: Leave / Expenses / Performance
```

### Employee Journey
```
Login → Employee Dashboard → Attendance (view own)
                           ↓
                      Leave Requests → Submit → Track Status
                           ↓
                      Expense Claims → Submit → Track Status
                           ↓
                      Performance Goals → Update Progress
                           ↓
                      Settings → Profile / Theme
```

## Quick Access Shortcuts

### Header Navigation (All Roles)
- Sidebar Toggle
- User Profile Menu
  - Profile Settings
  - Change Password
  - Theme Toggle (Light/Dark)
  - Logout
- Notifications (Bell icon)

### Sidebar Menu (Role-Based)

#### System Admin Sidebar
1. Admin Dashboard
2. User Management
3. Departments
4. Device Configuration
5. Leave Types
6. Expense Categories

#### HR Manager Sidebar
1. Dashboard
2. Recruitment
3. Employees
4. Attendance
5. Leave
6. Expenses
7. Performance
8. Payroll
9. Reports
10. Settings

#### Department Manager Sidebar
1. My Dashboard
2. My Team
3. Attendance
4. Leave Approval
5. Expense Approval
6. Performance
7. My Leave
8. My Expenses
9. Settings

#### Employee Sidebar
1. Dashboard
2. My Attendance
3. Leave Requests
4. Expense Claims
5. Performance Goals
6. Settings

---

**Document Version:** 1.0  
**Last Updated:** November 22, 2025
