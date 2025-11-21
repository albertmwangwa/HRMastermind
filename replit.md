# HRMS - Human Resource Management System

## Overview

This HRMS (Human Resource Management System) is a full-stack web application managing the entire employee lifecycle: recruitment, employee management, attendance, leave, expense claims, performance, and payroll. It is designed as a modern enterprise SaaS platform, inspired by BambooHR and Workday, focusing on clarity, efficient workflows, and a professional aesthetic. The system features Role-Based Access Control (RBAC) with distinct experiences for System Admin, HR Manager, Department Manager, and Employee roles. The primary color for branding is blue (#1965ae).

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### November 21, 2025 - Device Configuration Moved to Admin Portal
- **Restructured ZKTeco device management** to be admin-only feature
  - Created dedicated Device Configuration page at `/admin/devices` for System Admin role
  - Removed "Devices" tab from Attendance page (now shows only Attendance Records and Calendar View)
  - Updated routing: device management routes moved from `/attendance/device/*` to `/admin/device/*`
  - Added proper RBAC guards using RequireRole component to restrict access to system_admin
  - Architect-verified: RequireRole component correctly enforces role-based access control
- **Security**: Device configuration, sync operations, and device addition now restricted to System Admin only
- **Navigation**: Device Configuration menu item in admin sidebar points to `/admin/devices`
- **Files modified**: client/src/pages/admin/devices.tsx (new), client/src/App.tsx, client/src/pages/attendance.tsx, client/src/components/app-sidebar.tsx

## System Architecture

### Frontend Architecture

The frontend is built with React, TypeScript, Vite, Wouter for routing, TanStack Query for data fetching, and Tailwind CSS for styling. It leverages `shadcn/ui` components based on Radix UI for accessibility and customizability, implementing a professional design system with Poppins typography, consistent spacing, and a 0.8rem border radius. State management primarily uses React Query for server state and local React state for UI interactions. The layout is responsive, featuring a fixed sidebar for desktop and a collapsible drawer for mobile.

### Backend Architecture

The backend uses Node.js with Express and TypeScript, organized around RESTful API endpoints. It distinguishes between development (Vite middleware) and production (static asset serving) modes. A custom logging utility tracks requests and responses.

### Authentication & Authorization

Authentication is handled via local email/password using Passport Local Strategy, with user sessions stored in PostgreSQL. Role-Based Access Control (RBAC) is production-ready, featuring four tiers: `system_admin`, `hr_manager`, `department_manager`, and `employee`. Backend middleware (`requireRole`) and frontend route guards (`RequireRole` component) enforce permissions. Security hardening includes multi-layer CSRF protection, secure HTTP-only cookies, and bcrypt hashing for passwords. The system includes an Admin Configuration module for user, department, leave type, and expense category management, with automated credential emails sent via Resend.

### Data Layer

PostgreSQL is the primary database, connected via Neon Serverless driver and Drizzle ORM for type-safe queries. The schema is defined centrally in `shared/schema.ts`, managed with Drizzle Kit. Key data models include Users, Employees, Departments, Attendance, Leave, Expenses, Recruitment, Performance, and Sessions. An abstract `IStorage` interface defines data access patterns, implemented using Drizzle ORM for CRUD operations.

### Module Organization

The system is organized into feature modules: Recruitment, Employees, Attendance, Leave, Expenses, Performance, Payroll, Reports, Settings, and System Admin. The codebase is structured into `/client` (React app), `/server` (Express app), and `/shared` (types/schemas), with path aliases for clean imports.

## External Dependencies

### Database & Infrastructure
- **PostgreSQL**: Primary relational database.
- **Neon Serverless**: Database connectivity.

### Authentication
- **Passport Local Strategy**: For local email/password authentication.
- **Bcrypt**: For password hashing.

### UI Component Libraries
- **Radix UI primitives**: Foundation for accessible components.
- **Lucide React**: Icon system.

### Utility Libraries
- **date-fns**: Date manipulation.
- **clsx**, **tailwind-merge**: CSS class composition.
- **Zod**: Runtime validation.
- **React Hook Form**: Form management with Zod resolvers.
- **Nanoid**: Unique ID generation.

### Email Service
- **Resend**: Transactional email service for credential notifications.

### Biometric Integration
- **ZKTeco protocol**: (Planned) for attendance device integration.