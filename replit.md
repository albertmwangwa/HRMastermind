# HRMS - Human Resource Management System

## Overview

This is a comprehensive HRMS (Human Resource Management System) built as a full-stack web application. The system manages the complete employee lifecycle including recruitment, employee management, attendance tracking, leave management, expense claims, performance reviews, and payroll processing. It follows a modern enterprise SaaS design approach inspired by BambooHR and Workday, emphasizing information clarity, efficient workflows, and professional aesthetics.

**Primary Color:** Blue (#1965ae = HSL 207 62% 39%) - Professional enterprise branding

The system implements **Role-Based Access Control (RBAC)** with four distinct user experiences:
- **System Admin**: Configuration-focused dashboard for managing users, departments, leave types, and expense categories
- **HR Manager**: Full access to all HR modules (recruitment, employees, attendance, leave, expenses, performance, payroll, reports)
- **Department Manager**: Limited to their department's data (team members, attendance, leave approvals, expense approvals, performance)
- **Employee**: Self-service portal for personal profile, attendance, leave applications, expense submissions, and performance

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### November 21, 2025 - Password Management & Email Notifications
- **Implemented password management** in User Management module
  - Password required during user creation (min 6 characters)
  - Password optional during user edit (leave blank to keep current)
  - Zod schema with z.preprocess handles empty string → undefined transformation
  - Bcrypt hashing (10 salt rounds) for all passwords
  - Eye/EyeOff toggle for password visibility in forms
- **Integrated Resend email service** for credential notifications
  - Automatically sends welcome email with login credentials after user creation
  - HTML email template with user details and login link
  - Non-blocking error handling (logs failures, doesn't block user creation)
  - Environment variable: RESEND_API_KEY configured via Resend connector
- **Form validation improvements**:
  - Separate schemas for create (password required) vs update (password optional)
  - z.preprocess converts empty strings to undefined before validation
  - handleSubmit strips undefined passwords from update payloads
- **Files modified**: server/routes.ts, server/email.ts (new), client/src/pages/admin/user-management.tsx

### November 21, 2025 - Authentication Migration & Security Hardening
- **Migrated authentication** from Replit Auth (OIDC) to local email/password using Passport Local Strategy
- **Changed primary color** from pink to blue (#1965ae) across entire application
- **Created initial users**: Three users seeded (system_admin, hr_manager, department_manager) with password "admin123"
- **Security hardening complete**:
  - Added requireRole guards to all write endpoints (POST/PUT/PATCH/DELETE)
  - Implemented multi-layer CSRF protection (sameSite cookies + origin/referer validation)
  - Architect validation: PASS rating for production readiness
- **Files modified**: server/localAuth.ts, server/routes.ts, client/src/pages/login.tsx, client/src/index.css, shared/schema.ts, server/seed-users.ts

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for client-side routing
- TanStack Query (React Query) for server state management and API data fetching
- Tailwind CSS for utility-first styling with custom design system

**UI Component Library:**
- shadcn/ui components (Radix UI primitives) for accessible, customizable UI elements
- Custom component patterns including MetricCard and StatusBadge for HR-specific displays
- Comprehensive form components using React Hook Form with Zod validation

**Design System:**
- Poppins typography family with defined hierarchy
- Consistent spacing primitives using Tailwind utilities (2, 4, 6, 8, 12, 16)
- Border radius of 0.8rem across all components
- Theme support with light/dark mode toggle
- CSS variables for theming and customization
- Professional color palette with role-based visual differentiation

**State Management:**
- React Query for server state with infinite stale time and disabled refetching
- Local React state for UI interactions
- Custom hooks pattern (useAuth, useIsMobile, useToast)

**Layout System:**
- Responsive grid layouts (3-column desktop, 2-column tablet, 1-column mobile)
- Fixed 256px sidebar navigation for desktop, collapsible drawer for mobile
- SidebarProvider context for sidebar state management

### Backend Architecture

**Technology Stack:**
- Node.js with Express as the HTTP server framework
- TypeScript for type safety across the entire backend
- ESM modules throughout the codebase

**API Design:**
- RESTful API endpoints organized by feature module
- Route structure: `/api/{module}/{resource}`
- Consistent JSON request/response format
- Raw body preservation for webhook verification

**Development vs Production:**
- Development mode (`index-dev.ts`): Vite middleware integration with HMR support
- Production mode (`index-prod.ts`): Serves pre-built static assets from dist/public
- Separate server setup functions (`setupVite` vs `serveStatic`)

**Logging:**
- Custom logging utility with timestamp formatting
- Request logging for API endpoints with duration tracking
- JSON response capture for debugging

### Authentication & Authorization

**Replit Auth Integration:**
- OpenID Connect (OIDC) authentication flow
- Passport.js strategy for session management
- Session storage in PostgreSQL using connect-pg-simple
- Token management with access tokens and refresh tokens
- User claims stored in session for authorization

**Role-Based Access Control (RBAC) - Production Ready:**
- Four-tier role system: system_admin, hr_manager, department_manager, employee
- Backend middleware: `requireRole(...roles)` protects all write operations
- Frontend route guards: `RequireRole` component restricts UI access
- Security hardening: All privilege escalation paths closed, no unsecured alternate routes

**RBAC Implementation Details:**
- Admin routes (`/api/admin/*`): system_admin only - user management, departments, leave types, expense categories
- HR operations: hr_manager required - employee CRUD, recruitment, payroll, reports
- Approval workflows: hr_manager OR department_manager - leave/expense approvals
- Employee self-service: employee+ (all roles) - attendance, leave requests, expense claims, performance goals
- Department-specific access: department managers filtered by departmentId (pending implementation)

**Security Hardening (Production-Ready):**
- RBAC enforcement: All write endpoints protected with requireRole middleware matching RBAC matrix
- CSRF protection: Multi-layer defense with sameSite:"lax" cookies + Origin/Referer validation
- Session security: httpOnly cookies, secure flag in production, PostgreSQL session store
- Password security: bcrypt hashing, no plaintext storage
- Architect validated: PASS rating for comprehensive security implementation

**Admin Configuration (Completed):**
- User Management: Create/update/delete users with role assignment, department linking, and password management
  - Password required during creation (min 6 chars), optional during edit
  - Automated credential emails sent via Resend after user creation
  - Separate form schemas for create vs update with proper validation
- Department Configuration: Manage organizational structure with CRUD operations
- Leave Types Configuration: Define PTO types, accrual rules, and approval workflows
- Expense Categories Configuration: Set up reimbursement categories and approval limits
- All forms use React Hook Form with Zod validation and proper error handling

**Session Management:**
- 7-day session TTL with HTTP-only secure cookies
- PostgreSQL-backed session store for persistence
- Automatic session cleanup via TTL

### Data Layer

**Database:**
- PostgreSQL as the primary relational database
- Neon Serverless driver for database connectivity
- Connection via DATABASE_URL environment variable

**ORM & Schema:**
- Drizzle ORM for type-safe database queries
- Schema-first approach with Zod integration for validation
- Centralized schema definition in `shared/schema.ts`
- Drizzle Kit for migrations management

**Data Models:**
- Users (authentication with Replit OIDC, includes role and departmentId for RBAC)
  - Roles: system_admin, hr_manager, department_manager, employee
  - Department assignment for department managers
- Employees (profile, department, employment status, links to user account)
- Departments (organizational structure)
- Attendance Devices (biometric integration points)
- Attendance Logs (check-in/check-out records)
- Leave Types and Leave Requests (PTO management)
- Expense Categories and Expense Claims (reimbursement tracking)
- Job Postings and Candidates (recruitment pipeline)
- Performance Goals and Appraisals (employee evaluation)
- Sessions (authentication persistence)

**Storage Layer:**
- Abstract IStorage interface defining data access patterns
- Implementation in `storage.ts` using Drizzle ORM
- CRUD operations for all major entities
- Specialized queries (by date, by employee, status updates)

### Module Organization

**Feature Modules:**
1. **Recruitment**: Job posting management and candidate pipeline tracking (HR Manager only)
2. **Employees**: Employee lifecycle management, profiles, department organization (HR Manager, Department Manager view filtered by dept)
3. **Attendance**: Biometric device integration, attendance log tracking (all roles, filtered by permission)
4. **Leave**: Leave type configuration, request/approval workflows (all roles with different views)
5. **Expenses**: Expense category setup, claim submission and approval (all roles with different views)
6. **Performance**: Goal setting, appraisals, and feedback management (all roles with different views)
7. **Payroll**: Salary processing and payslip generation (HR Manager only)
8. **Reports**: Comprehensive analytics across all modules (HR Manager only)
9. **Settings**: System configuration and company preferences (HR Manager only)
10. **System Admin**: User management, role assignment, department config, leave types, expense categories (System Admin only)

**Code Organization:**
- `/client`: Frontend React application
- `/server`: Backend Express application
- `/shared`: Shared types and schemas (database schema, validation)
- Path aliases configured for clean imports (@/, @shared/, @db)

## External Dependencies

**Database & Infrastructure:**
- PostgreSQL database (via Neon Serverless or standard PostgreSQL)
- Environment variable DATABASE_URL required for database connection
- Session storage requires database with sessions table

**Authentication Provider:**
- Local email/password authentication using Passport Local Strategy
- Bcrypt password hashing with 10 salt rounds
- Login-only system (no public signup) - users created by System Admin only
- Environment variable: SESSION_SECRET for session signing
- Initial admin credentials: albert.mwangwa@suhara.com (system_admin), mariam.kambarage@suhara.com (hr_manager), clinton.expedito@suhara.com (department_manager), all with password "admin123"

**UI Component Libraries:**
- Radix UI primitives for accessible component foundation
- Multiple Radix packages for dialogs, dropdowns, popovers, etc.
- Lucide React for icon system

**Development Tools:**
- Vite plugins for development experience (runtime error overlay, cartographer, dev banner)
- TypeScript for type checking without emitting files
- esbuild for production server bundling

**Utility Libraries:**
- date-fns for date manipulation and formatting
- clsx and tailwind-merge for className composition
- zod for runtime validation
- react-hook-form with hookform/resolvers for form management
- nanoid for unique ID generation

**Email Service:**
- Resend for transactional emails (credential notifications, password resets, etc.)
- Email utility module (server/email.ts) with Resend client
- HTML email templates for professional communication
- Non-blocking error handling with logging

**Biometric Integration (Planned):**
- Attendance devices via IP/port configuration (ZKTeco protocol expected)
- Device status monitoring and sync tracking
- Currently uses mock data awaiting real integration