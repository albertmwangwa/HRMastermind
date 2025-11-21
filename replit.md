# HRMS - Human Resource Management System

## Overview

This is a comprehensive HRMS (Human Resource Management System) built as a full-stack web application. The system manages the complete employee lifecycle including recruitment, employee management, attendance tracking, leave management, expense claims, performance reviews, and payroll processing. It follows a modern enterprise SaaS design approach inspired by BambooHR and Workday, emphasizing information clarity, efficient workflows, and professional aesthetics.

## User Preferences

Preferred communication style: Simple, everyday language.

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
- Role-based access control (admin, manager, employee)

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
- Users (authentication with Replit OIDC)
- Employees (profile, department, employment status)
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
1. **Recruitment**: Job posting management and candidate pipeline tracking
2. **Employees**: Employee lifecycle management, profiles, department organization
3. **Attendance**: Biometric device integration, attendance log tracking
4. **Leave**: Leave type configuration, request/approval workflows
5. **Expenses**: Expense category setup, claim submission and approval
6. **Performance**: Goal setting, appraisals, and feedback management
7. **Payroll**: Salary processing and payslip generation
8. **Reports**: Comprehensive analytics across all modules
9. **Settings**: System configuration and company preferences

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
- Replit Auth (OpenID Connect)
- Environment variables: ISSUER_URL, REPL_ID, SESSION_SECRET
- Fallback to standard OIDC if not on Replit

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

**Biometric Integration (Planned):**
- Attendance devices via IP/port configuration (ZKTeco protocol expected)
- Device status monitoring and sync tracking
- Currently uses mock data awaiting real integration