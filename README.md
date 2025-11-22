# HRMS - Human Resource Management System

<div align="center">

![HRMS](https://img.shields.io/badge/HRMS-v1.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue)
![React](https://img.shields.io/badge/React-18.3.1-61dafb)
![Express](https://img.shields.io/badge/Express-4.21.2-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-336791)

**A comprehensive enterprise HR management platform with biometric integration**

[Features](#features) • [Quick Start](#quick-start) • [Documentation](#documentation) • [Tech Stack](#tech-stack)

</div>

---

## Overview

HRMS is a full-stack Human Resource Management System designed to streamline the entire employee lifecycle from recruitment to payroll. Built with modern technologies and inspired by BambooHR and Workday, it features a professional UI, robust role-based access control, and seamless biometric device integration.

### Key Highlights

✅ **Complete HR Lifecycle** - Recruitment, onboarding, attendance, leave, expenses, performance, payroll  
✅ **ZKTeco Biometric Integration** - Direct integration with MB100 attendance devices  
✅ **4-Tier RBAC** - System Admin, HR Manager, Department Manager, Employee  
✅ **Automated Workflows** - Email notifications, approval chains, payroll processing  
✅ **Modern UI/UX** - Responsive design, dark/light themes, professional aesthetics  
✅ **Type-Safe Architecture** - End-to-end TypeScript with Drizzle ORM

---

## Features

### 📊 Dashboard & Analytics
- Role-specific dashboards with real-time metrics
- Interactive charts and data visualizations
- Quick access to pending approvals
- Recent activity timeline

### 👥 Employee Management
- Complete employee directory with search & filters
- Profile management with biometric ID mapping
- Department assignment and organizational structure
- Employment status tracking (Active/Inactive/Terminated)

### ⏰ Attendance Tracking
- **ZKTeco MB100 Device Integration** via TCP/IP
- Real-time attendance logs with check-in/check-out times
- Calendar view for visual attendance tracking
- Comprehensive filters (date, department, location, branch)
- Manual attendance entry for corrections
- Device sync management with connection testing

### 📅 Leave Management
- Configurable leave types (Sick, Annual, Casual, etc.)
- Leave balance tracking per employee
- Request submission with approval workflow
- Multi-level approval system
- Leave calendar and history

### 💰 Expense Management
- Expense claim submission with receipt upload
- Configurable expense categories
- Approval workflow with receipt verification
- Expense reports and analytics

### 📈 Performance Management
- Goal setting with progress tracking (0-100%)
- Performance appraisals with rating system
- 360-degree feedback
- Quarterly/annual review cycles

### 💵 Payroll Processing
- Salary configuration with allowances and deductions
- Components: Basic, HRA, Travel, Tax, PF, ESI
- Net pay automatic calculation
- Monthly payroll processing
- Payslip generation

### 🔎 Recruitment
- Job posting creation and management
- Candidate application tracking
- Interview stage progression (Applied → Screening → Interview → Offer → Hired)
- Candidate notes and history

### 📊 Reports & Analytics
- Attendance summary reports
- Leave analytics
- Expense reports
- Performance metrics
- Export to CSV/PDF

### 🛡️ System Administration
- User account management (CRUD)
- Role assignment and permissions
- Department configuration
- Leave type and expense category setup
- Automated credential emails via Resend

---

## Quick Start

### Choose Your Setup Method

#### Option 1: Docker (Recommended for Easy Management) 🐳

**Prerequisites:**
- Docker Engine 20.10+ and Docker Compose 2.0+

**Quick Start:**
```bash
# Clone repository
git clone <repository-url>
cd hrms-project

# Start everything (app + database)
docker compose up

# Access application at http://localhost:5000
```

**Production Deployment:**
```bash
# Create .env file with production credentials
cp .env.example .env
# Edit .env with your actual values

# Start production stack
docker compose -f docker-compose.prod.yml up -d
```

📖 **[Complete Docker Guide](docs/DOCKER_GUIDE.md)** - Full Docker documentation with troubleshooting, backup/restore, and advanced configuration.

---

#### Option 2: Traditional Installation

**Prerequisites:**
- Node.js 18+ and npm
- PostgreSQL database (Neon recommended)
- Resend API key (for emails)

**Installation Steps:**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hrms-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the project root:
   ```bash
   # Database
   DATABASE_URL=postgresql://user:password@host:5432/dbname
   PGHOST=your-host.neon.tech
   PGDATABASE=hrms_db
   PGUSER=db_user
   PGPASSWORD=db_password
   PGPORT=5432

   # Session
   SESSION_SECRET=your-random-secret-key-minimum-32-chars

   # Email Service
   RESEND_API_KEY=re_your_resend_api_key
   ```

4. **Initialize database**
   ```bash
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Open browser to `http://localhost:5000`
   - Default admin credentials will be created on first run

---

## Documentation

Comprehensive documentation is available in the `/docs` folder:

📖 **[Technical Documentation](docs/TECHNICAL_DOCUMENTATION.md)**
- System architecture
- Database schema
- API reference
- Authentication & authorization
- Module documentation

🗺️ **[Site Map](docs/SITE_MAP.md)**
- Complete route structure
- Access control matrix
- Navigation flows

👤 **[User Guide](docs/USER_GUIDE.md)**
- Role-specific walkthroughs
- Module guides
- Common tasks
- FAQs

🐳 **[Docker Guide](docs/DOCKER_GUIDE.md)**
- Docker setup (development & production)
- Container management
- Backup & restore
- Troubleshooting

---

## Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack Query v5 for server state
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Charts**: Recharts
- **Theme**: next-themes (dark/light mode)

### Backend
- **Framework**: Express.js with TypeScript
- **Authentication**: Passport.js (Local Strategy)
- **Session Store**: PostgreSQL via connect-pg-simple
- **Password Hashing**: bcrypt
- **Email**: Resend
- **Validation**: Zod

### Database
- **Database**: PostgreSQL (Neon Serverless)
- **ORM**: Drizzle ORM
- **Migrations**: Drizzle Kit

### Build Tools
- **Build**: Vite (frontend), esbuild (backend)
- **Language**: TypeScript 5.6.3
- **Package Manager**: npm

---

## Project Structure

```
hrms-project/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Route pages
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilities
│   └── public/            # Static assets
│
├── server/                # Express backend
│   ├── routes.ts          # API endpoints
│   ├── storage.ts         # Database layer
│   └── index-dev.ts       # Dev server
│
├── shared/                # Shared types & schemas
│   └── schema.ts          # Drizzle schema
│
├── docs/                  # Documentation
│   ├── TECHNICAL_DOCUMENTATION.md
│   ├── SITE_MAP.md
│   └── USER_GUIDE.md
│
└── package.json           # Dependencies
```

---

## Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload

# Production
npm run build            # Build for production
npm start                # Start production server

# Database
npm run db:push          # Push schema to database

# Type Checking
npm run check            # TypeScript type checking
```

---

## Role-Based Access Control

### User Roles

1. **System Admin** (Highest Privilege)
   - Full system configuration
   - User management
   - Device configuration
   - System settings

2. **HR Manager**
   - Complete HR operations
   - Employee CRUD
   - Recruitment
   - Payroll processing
   - Leave/expense approval (all)

3. **Department Manager**
   - Team management
   - Leave/expense approval (own department)
   - Performance reviews
   - Employee requests

4. **Employee** (Base Access)
   - Self-service portal
   - Leave requests
   - Expense claims
   - Performance goals
   - View own attendance

---

## ZKTeco Device Integration

### Supported Devices
- ZKTeco MB100 (primary)
- Other ZKTeco devices with TCP/IP support

### Configuration
1. Navigate to `/admin/devices` (System Admin only)
2. Add new device with IP address and port (default: 4370)
3. Test connection to verify device is reachable
4. Configure location and branch information
5. Sync attendance data manually or on schedule

### Connection Testing
The system provides real-time connection testing:
- **Idle**: No test performed
- **Testing**: Attempting connection
- **Connected**: Device is reachable
- **Failed**: Connection error
- **Timeout**: Device not responding

### Advanced Settings
- ZKTeco API Mode with custom script support
- Upload scripts (.js, .json, .txt, .xml)
- Manual sync trigger
- Auto-sync scheduling (configurable)

---

## Deployment

### Docker Deployment (Recommended)

**Easiest and most reliable deployment method:**

1. Clone repository on your server
2. Create `.env` file with production credentials
3. Run:
   ```bash
   docker compose -f docker-compose.prod.yml up -d
   ```
4. Configure reverse proxy (nginx) for HTTPS

See **[Docker Guide](docs/DOCKER_GUIDE.md)** for complete instructions.

### Replit

1. Fork/import project to Replit
2. Configure secrets:
   - `DATABASE_URL`
   - `SESSION_SECRET`
   - `RESEND_API_KEY`
3. Use Replit PostgreSQL integration
4. Click "Run" - application starts automatically
5. Click "Publish" for production deployment

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Set environment variables on your server

3. Start the production server:
   ```bash
   npm start
   ```

4. Configure reverse proxy (nginx/Apache) for HTTPS

---

## Security

- **Password Hashing**: bcrypt with salt rounds
- **Session Management**: Secure HTTP-only cookies
- **CSRF Protection**: Express session with secure settings
- **SQL Injection Prevention**: Drizzle ORM parameterized queries
- **XSS Protection**: React automatic escaping
- **Role-Based Authorization**: Middleware enforcement on all protected routes

---

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile: iOS 14+, Android 10+

---

## Contributing

This is a private enterprise application. For issues or feature requests, contact the development team.

---

## License

MIT License - See LICENSE file for details

---

## Support

For technical support:
- **Documentation**: See `/docs` folder
- **System Admin**: Contact your company's System Administrator
- **Development Team**: Email: support@yourcompany.com

---

## Roadmap

### Upcoming Features
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Integration with third-party payroll services
- [ ] Document management system
- [ ] Training and development module
- [ ] Employee self-onboarding portal

---

<div align="center">

**Built with ❤️ using React, Express, and PostgreSQL**

Version 1.0.0 | November 2025

</div>
