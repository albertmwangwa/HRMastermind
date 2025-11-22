# HRMS - Quick Start Guide

## For Developers

### 🚀 Get Up and Running in 5 Minutes

#### Step 1: Prerequisites Check
```bash
# Check Node.js version (need 18+)
node --version

# Check npm version
npm --version

# Verify PostgreSQL access (optional - can use Neon)
psql --version
```

#### Step 2: Clone and Install
```bash
# Clone the repository
git clone <repository-url>
cd hrms-project

# Install all dependencies
npm install
```

#### Step 3: Database Setup

**Option A: Using Neon (Recommended)**
1. Sign up at https://neon.tech
2. Create a new project
3. Copy the connection string

**Option B: Local PostgreSQL**
```bash
# Create database
createdb hrms_development
```

#### Step 4: Environment Configuration

Create `.env` file in project root:

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname
PGHOST=your-host.neon.tech
PGDATABASE=hrms_development
PGUSER=your_username
PGPASSWORD=your_password
PGPORT=5432

# Session (generate random string)
SESSION_SECRET=generate-random-32-char-string-here

# Email (get from resend.com)
RESEND_API_KEY=re_your_api_key_here
```

**Generating SESSION_SECRET:**
```bash
# On macOS/Linux
openssl rand -base64 32

# Or in Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

#### Step 5: Initialize Database
```bash
# Push schema to database
npm run db:push
```

You should see:
```
✓ Applying changes
✓ Schema pushed successfully
```

#### Step 6: Start Development Server
```bash
npm run dev
```

Expected output:
```
VITE v5.4.20  ready in 1234 ms

  ➜  Local:   http://localhost:5000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help

Server running on http://localhost:5000
```

#### Step 7: Access the Application

1. Open browser to `http://localhost:5000`
2. You'll see the landing page
3. Click "Login"

#### Step 8: Create First Admin User

**Important:** You need to create the first user directly in the database.

```sql
-- Connect to your database
psql $DATABASE_URL

-- Or use a database client (TablePlus, pgAdmin, etc.)

-- Create first admin user
INSERT INTO users (email, first_name, last_name, password_hash, role)
VALUES (
  'admin@company.com',
  'System',
  'Admin',
  '$2b$10$abcdefghijklmnopqrstuvwxyz123456789',  -- temporary, will change on login
  'system_admin'
);
```

**Better Option: Use Node.js Script**

Create `scripts/create-admin.ts`:
```typescript
import bcrypt from 'bcrypt';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { neonConfig, Pool } from '@neondatabase/serverless';
import { users } from '../shared/schema';

neonConfig.fetchConnectionCache = true;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

async function createAdmin() {
  const password = 'admin123'; // Change after first login!
  const passwordHash = await bcrypt.hash(password, 10);
  
  await db.insert(users).values({
    email: 'admin@company.com',
    firstName: 'System',
    lastName: 'Admin',
    passwordHash,
    role: 'system_admin',
  });
  
  console.log('Admin user created!');
  console.log('Email: admin@company.com');
  console.log('Password: admin123');
  console.log('Please change password after first login!');
  process.exit(0);
}

createAdmin();
```

Run it:
```bash
tsx scripts/create-admin.ts
```

#### Step 9: Login and Configure

1. Login with admin credentials
2. Navigate to `/admin/departments`
3. Create your first department (e.g., "Engineering")
4. Navigate to `/admin/leave-types`
5. Create leave types (e.g., "Sick Leave" - 10 days)
6. Navigate to `/admin/expense-categories`
7. Create expense categories (e.g., "Travel")
8. Navigate to `/admin/users`
9. Create additional users

#### Step 10: Test the System

**Create a test employee:**
1. Navigate to `/employees`
2. Click "Add Employee"
3. Fill in details
4. Submit

**Test leave request:**
1. Navigate to `/leave`
2. Click "Request Leave"
3. Select dates and submit
4. Switch to admin/manager account
5. Navigate to `/leave-approval`
6. Approve the request

**Test attendance:**
1. Navigate to `/attendance-entry`
2. Enter manual attendance
3. View in `/attendance`

---

## For System Administrators

### Initial System Setup (Non-Technical)

#### 1. Access Your HRMS Instance
- Your IT team will provide you with the URL
- Default admin credentials will be sent via email

#### 2. First Login
1. Open the HRMS URL in your browser
2. Enter your email and temporary password
3. You'll be prompted to change your password
4. Choose a strong password (minimum 8 characters)

#### 3. Configure Departments
1. Click on "Admin Dashboard" in the sidebar
2. Navigate to "Departments"
3. Click "Add Department"
4. Enter department names one by one:
   - Engineering
   - Sales
   - Marketing
   - Finance
   - Human Resources
   - Operations
5. Click "Save" after each entry

#### 4. Set Up Leave Types
1. Navigate to "Leave Types" in admin menu
2. Add common leave types:
   - **Sick Leave**: 10 days per year
   - **Annual Leave**: 20 days per year
   - **Casual Leave**: 5 days per year
   - **Maternity Leave**: 90 days per year (if applicable)
   - **Paternity Leave**: 15 days per year (if applicable)
3. Click "Save" after each entry

#### 5. Configure Expense Categories
1. Navigate to "Expense Categories"
2. Add categories relevant to your organization:
   - Travel
   - Meals & Entertainment
   - Accommodation
   - Office Supplies
   - Training & Development
   - Communication
3. Click "Save" after each entry

#### 6. Create User Accounts
1. Navigate to "User Management"
2. Click "Add User"
3. For each employee:
   - Enter their email address
   - Enter first and last name
   - Select their role:
     - **System Admin**: For IT staff
     - **HR Manager**: For HR team
     - **Department Manager**: For team leads
     - **Employee**: For all other staff
   - Select their department
4. Click "Create User"
5. System will:
   - Generate a temporary password
   - Send credentials via email
   - User will change password on first login

#### 7. Set Up Attendance Devices (If Applicable)

**If you have ZKTeco biometric devices:**

1. Navigate to "Device Configuration"
2. Click "Add Device"
3. For each device:
   - **Device Name**: e.g., "Main Office Entry"
   - **IP Address**: Ask your IT team (e.g., 192.168.1.100)
   - **Port**: Usually 4370 (default)
   - **Location**: e.g., "Reception Desk"
   - **Branch**: Your office location
4. Click "Save"
5. Click "Test Connection" to verify device is reachable
6. If connection succeeds, click "Sync Now" to import existing attendance data

**If you don't have biometric devices:**
- Users can manually enter attendance via `/attendance-entry`
- Managers can enter attendance for their team members

#### 8. Train Your Team

**For HR Managers:**
- Show them how to approve leave requests
- Demonstrate expense approval process
- Teach them recruitment module for job postings
- Show payroll processing workflow

**For Department Managers:**
- Explain how to approve team leave
- Show expense approval for their department
- Demonstrate performance review process

**For Employees:**
- How to request leave
- How to submit expense claims
- How to view attendance
- How to set performance goals

#### 9. Communicate Rollout

Send company-wide email with:
- HRMS URL
- What each employee needs to do (check email for credentials)
- Training schedule
- Support contact (you!)
- FAQ document

---

## Common Setup Issues & Solutions

### Issue 1: Database Connection Error
```
Error: Unable to connect to database
```

**Solution:**
- Check DATABASE_URL is correct
- Verify database exists
- Check network/firewall allows connection
- For Neon: Verify project is not sleeping

### Issue 2: Session Not Persisting
```
User keeps getting logged out
```

**Solution:**
- Verify SESSION_SECRET is set
- Check that sessions table exists in database
- Ensure cookies are enabled in browser

### Issue 3: Email Not Sending
```
User creation succeeds but no email received
```

**Solution:**
- Verify RESEND_API_KEY is correct
- Check Resend domain is verified
- Look for emails in spam folder
- Check Resend dashboard for errors

### Issue 4: Device Connection Failed
```
ZKTeco device shows "Failed" or "Timeout"
```

**Solution:**
- Verify device is powered on
- Check IP address is correct
- Ensure device and server are on same network
- Verify port 4370 is open (not blocked by firewall)
- Try pinging the device IP from server

### Issue 5: Cannot Create First Admin
```
No admin account exists to login
```

**Solution:**
- Use the create-admin script (see Step 8 above)
- Or manually insert into database
- Contact your IT team for help

---

## Development Tips

### Hot Reloading
- Frontend: Automatically reloads on file changes
- Backend: Automatically restarts on route changes
- Database schema: Run `npm run db:push` after schema changes

### Database Inspection
```bash
# View database schema
npm run db:push -- --print

# Access database directly
psql $DATABASE_URL
```

### Debugging
```typescript
// Add console.log in backend
console.log('User data:', req.user);

// Add console.log in frontend
console.log('Query result:', data);
```

### TypeScript Errors
```bash
# Check for type errors
npm run check
```

### Clear Browser Cache
- Press Ctrl+Shift+R (Windows/Linux)
- Press Cmd+Shift+R (macOS)
- Or use Incognito/Private mode for testing

---

## Next Steps

After initial setup:

1. **Customize branding**
   - Update colors in `client/src/index.css`
   - Replace logo (if applicable)
   - Modify theme colors

2. **Set up backups**
   - Configure automated database backups
   - Test restore procedure

3. **Configure email templates**
   - Customize email notifications
   - Add company branding to emails

4. **Set up monitoring**
   - Application logs
   - Error tracking (Sentry)
   - Uptime monitoring

5. **Plan training sessions**
   - Schedule demos for each role
   - Create video tutorials
   - Prepare FAQ document

---

## Getting Help

- **Documentation**: Check `/docs` folder
- **GitHub Issues**: Report bugs or request features
- **Email Support**: support@yourcompany.com
- **Training**: Schedule session with IT team

---

**You're all set! 🎉**

If you encounter any issues not covered here, please contact support or check the full technical documentation.
