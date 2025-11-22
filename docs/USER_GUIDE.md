# HRMS - User Guide & Walkthrough

## Table of Contents
1. [Getting Started](#getting-started)
2. [Role-Specific Walkthroughs](#role-specific-walkthroughs)
3. [Module Guides](#module-guides)
4. [Common Tasks](#common-tasks)
5. [FAQs](#faqs)

---

## Getting Started

### Accessing the System

1. **Navigate to the HRMS URL**
   - Open your web browser
   - Go to your company's HRMS website

2. **Login**
   - Enter your email address
   - Enter your password
   - Click "Login"

3. **First-Time Login**
   - If this is your first login, you may need to change your password
   - Contact your System Administrator if you haven't received credentials

### Understanding Your Dashboard

Your dashboard displays information relevant to your role:

- **System Admin**: System statistics, user counts, device status
- **HR Manager**: Employee metrics, pending approvals, recruitment stats
- **Department Manager**: Team overview, pending approvals for your department
- **Employee**: Your attendance, leave balance, pending requests

### Theme Selection

Switch between Light and Dark mode:
1. Click your profile icon in the top right
2. Select "Theme"
3. Choose Light or Dark mode

---

## Role-Specific Walkthroughs

### System Administrator Walkthrough

#### Setting Up the System

**Step 1: Configure Departments**
1. Navigate to `/admin/departments`
2. Click "Add Department"
3. Enter:
   - Department Name (e.g., "Engineering", "Sales")
   - Description (optional)
4. Click "Save"

**Step 2: Create User Accounts**
1. Navigate to `/admin/users`
2. Click "Add User"
3. Fill in:
   - Email address
   - First Name
   - Last Name
   - Role (System Admin, HR Manager, Dept Manager, Employee)
   - Department
4. Click "Create User"
5. System auto-generates password and sends email to user

**Step 3: Configure Leave Types**
1. Navigate to `/admin/leave-types`
2. Click "Add Leave Type"
3. Enter:
   - Leave Type Name (e.g., "Sick Leave", "Annual Leave")
   - Days Allowed per year
4. Click "Save"

**Step 4: Set Up Expense Categories**
1. Navigate to `/admin/expense-categories`
2. Click "Add Category"
3. Enter Category Name (e.g., "Travel", "Meals", "Accommodation")
4. Click "Save"

**Step 5: Configure Attendance Devices** (if using ZKTeco biometric devices)
1. Navigate to `/admin/devices`
2. Click "Add Device"
3. Enter:
   - Device Name (e.g., "Main Office Entry")
   - IP Address (device network IP)
   - Port (default: 4370)
   - Location (e.g., "Reception")
   - Branch/Company name
4. Click "Save"
5. Click "Configure" to set up advanced settings
6. Test connection to verify device is reachable

#### Managing Devices

**Testing Device Connection:**
1. Go to device configuration page
2. Click "Test Connection"
3. Wait for result:
   - ✓ **Connected**: Device is reachable
   - ✗ **Failed**: Check IP address, port, and network
   - ⏱️ **Timeout**: Device not responding

**Syncing Attendance Data:**
1. Open device configuration
2. Click "Sync Now"
3. System imports attendance records from device
4. View imported records in Attendance module

**Advanced: ZKTeco API Mode**
1. In device configuration, go to "Advanced Settings"
2. Enable "ZKTeco API Mode"
3. Upload custom script file (.js, .json, .txt, .xml) or paste script
4. Click "Save API Configuration"

**Deleting a Device:**
1. On device list, click delete icon on device card
2. Confirm deletion in dialog
3. Device and associated records removed

---

### HR Manager Walkthrough

#### Daily Operations

**Morning Routine:**
1. Check Dashboard for pending approvals
2. Review new recruitment applications
3. Approve/reject leave requests
4. Approve/reject expense claims

#### Managing Employees

**Adding a New Employee:**
1. Navigate to `/employees`
2. Click "Add Employee"
3. Fill in employee details:
   - First Name, Last Name
   - Email, Phone
   - Department
   - Job Title (Role)
   - Biometric ID (if using attendance devices)
   - Joining Date
   - Status (Active/Inactive/Terminated)
4. Click "Save"

**Editing Employee Information:**
1. Navigate to `/employees`
2. Click on employee name
3. Click "Edit"
4. Update required fields
5. Click "Save Changes"

#### Recruitment Process

**Creating a Job Posting:**
1. Navigate to `/recruitment`
2. Click "Create Job Posting"
3. Enter:
   - Job Title
   - Department
   - Location
   - Employment Type (Full-time, Part-time, Contract)
   - Job Description
4. Click "Publish"

**Managing Candidates:**
1. Click on job posting
2. View list of candidates
3. For each candidate:
   - View resume and details
   - Move to next stage:
     - Applied → Screening → Interview → Offer → Hired
   - Or mark as "Rejected"
   - Add notes for internal reference

#### Leave Management

**Approving Leave Requests:**
1. Navigate to `/leave-approval`
2. View pending requests
3. Click on request to see details:
   - Employee name
   - Leave type
   - Date range
   - Number of days
   - Reason
4. Click "Approve" or "Reject"

**Viewing Leave Balance:**
1. Go to employee profile
2. View "Leave Balance" section
3. See remaining days for each leave type

#### Expense Management

**Approving Expense Claims:**
1. Navigate to `/expense-approval`
2. View pending claims
3. Click on claim to see:
   - Employee name
   - Expense category
   - Amount
   - Date
   - Description
   - Receipt (if uploaded)
4. Verify receipt and amount
5. Click "Approve" or "Reject"

#### Payroll Processing

**Configuring Employee Salary:**
1. Navigate to `/payroll`
2. Click on employee
3. Click "Configure Salary"
4. Enter salary components:
   - **Allowances:**
     - Basic Salary
     - HRA (House Rent Allowance)
     - Travel Allowance
     - Other Allowances
   - **Deductions:**
     - Tax Deduction
     - PF (Provident Fund)
     - ESI (Employee State Insurance)
     - Other Deductions
5. System calculates Net Pay automatically
6. Click "Save Configuration"

**Processing Monthly Payroll:**
1. Navigate to `/payroll`
2. Click "Process Payroll"
3. Select month and year
4. Click "Process"
5. System generates payroll for all employees
6. Download/export payroll records

#### Reports & Analytics

**Generating Reports:**
1. Navigate to `/reports`
2. Select report type:
   - Attendance Summary
   - Leave Analytics
   - Expense Reports
   - Performance Metrics
3. Set date range and filters
4. Click "Generate Report"
5. Export as CSV or PDF

---

### Department Manager Walkthrough

#### Team Management

**Viewing Your Team:**
1. Navigate to `/employees`
2. Filter by your department
3. View team members' details

**Approving Team Leave:**
1. Navigate to `/leave-approval`
2. See leave requests from your department only
3. Review and approve/reject

**Approving Team Expenses:**
1. Navigate to `/expense-approval`
2. See expense claims from your department only
3. Review receipts and approve/reject

**Performance Reviews:**
1. Navigate to `/performance`
2. View team members' goals
3. Create performance appraisals
4. Provide feedback

**Requesting New Employees or Transfers:**
1. Navigate to relevant section (if available)
2. Submit employee request
3. Provide justification
4. Wait for HR Manager approval

---

### Employee Walkthrough

#### Checking Attendance

**Viewing Your Attendance:**
1. Navigate to `/attendance`
2. View attendance records in table or calendar format
3. Use filters to see specific date ranges

**Manual Check-in (if allowed):**
1. Navigate to `/attendance-entry`
2. Select date
3. Enter check-in and check-out times
4. Click "Submit"

#### Requesting Leave

**Submitting a Leave Request:**
1. Navigate to `/leave`
2. Click "Request Leave"
3. Select:
   - Leave Type (Sick, Annual, etc.)
   - From Date
   - To Date
4. System calculates number of days
5. Enter reason for leave
6. Click "Submit Request"
7. Wait for manager approval

**Checking Leave Balance:**
1. Navigate to `/leave`
2. View "Leave Balance" section
3. See remaining days for each leave type

#### Submitting Expense Claims

**Creating an Expense Claim:**
1. Navigate to `/expenses`
2. Click "Submit Claim"
3. Enter:
   - Expense Category
   - Amount
   - Date of expense
   - Description
   - Upload receipt (optional but recommended)
4. Click "Submit Claim"
5. Track status (Pending/Approved/Rejected)

#### Managing Performance Goals

**Setting a Goal:**
1. Navigate to `/performance`
2. Click "Add Goal"
3. Enter:
   - Goal Title
   - Description
   - Deadline
4. Click "Save"

**Updating Goal Progress:**
1. Navigate to `/performance`
2. Click on goal
3. Update progress (0-100%)
4. Click "Save"

**Viewing Appraisals:**
1. Navigate to `/performance`
2. Go to "Appraisals" tab
3. View performance reviews from your manager

---

## Module Guides

### Attendance Module

#### Features
- **Attendance Records**: View daily check-in/check-out times
- **Calendar View**: Visual attendance calendar
- **Filters**: 
  - Time Period (Today, This Week, This Month, Custom Range)
  - Department
  - Location
  - Company/Branch

#### How to Use Filters
1. Select time period from dropdown
2. For custom range, select "Custom Range" and pick dates
3. Select department (if you have access to multiple)
4. Select location/branch
5. Click "Apply Filters"
6. Click "Reset Filters" to clear

#### Understanding Attendance Data
- **Check-in Time**: When employee arrived
- **Check-out Time**: When employee left
- **Total Hours**: Automatically calculated
- **Device**: Which biometric device recorded the attendance

---

### Leave Module

#### Leave Types
Common leave types:
- **Sick Leave**: For illness or medical appointments
- **Annual Leave**: Vacation or personal time
- **Casual Leave**: Short-term personal needs
- **Maternity/Paternity Leave**: For new parents

#### Leave Request Workflow
```
Employee Submits Request
         ↓
Manager Reviews Request
         ↓
   Approved / Rejected
         ↓
Email Notification to Employee
```

#### Leave Balance Calculation
- Balance = Days Allowed - Days Used - Days Pending
- Resets annually (company policy)

---

### Expense Module

#### Expense Categories
Common categories:
- **Travel**: Transportation, mileage, flights
- **Meals**: Business meals, client dinners
- **Accommodation**: Hotel stays
- **Supplies**: Office supplies, equipment
- **Other**: Miscellaneous business expenses

#### Best Practices for Expense Claims
1. **Always upload receipts** for claims over $50
2. **Submit promptly** (within 30 days of expense)
3. **Be specific** in descriptions
4. **Categorize correctly**
5. **Include client/project** information if applicable

---

### Performance Module

#### Components
1. **Performance Goals**: Individual objectives
2. **Appraisals**: Formal performance reviews
3. **Feedback**: 360-degree feedback from peers/managers

#### Setting SMART Goals
- **S**pecific: Clearly defined
- **M**easurable: Quantifiable progress
- **A**chievable: Realistic
- **R**elevant: Aligned with job role
- **T**ime-bound: Has a deadline

#### Example Goals
- "Complete certification course by Q1 2025" (Progress: 75%)
- "Improve customer satisfaction score to 4.5/5" (Progress: 60%)
- "Lead 2 successful project launches" (Progress: 50%)

---

## Common Tasks

### Changing Your Password
1. Click profile icon in top right
2. Select "Settings"
3. Go to "Security" section
4. Click "Change Password"
5. Enter current password
6. Enter new password
7. Confirm new password
8. Click "Update Password"

### Updating Your Profile
1. Navigate to `/settings`
2. Click "Edit Profile"
3. Update:
   - First Name, Last Name
   - Phone Number
   - Profile Picture (if enabled)
4. Click "Save Changes"

### Viewing Notifications
1. Click bell icon in top right
2. View recent notifications
3. Click notification to navigate to related item

### Exporting Data
1. Navigate to relevant module (Reports, Attendance, etc.)
2. Click "Export" button
3. Select format (CSV or PDF)
4. File downloads automatically

---

## FAQs

### General

**Q: I forgot my password. What should I do?**
A: Contact your System Administrator to reset your password. They will send you a new temporary password via email.

**Q: Can I access HRMS on my mobile device?**
A: Yes! The system is fully responsive and works on smartphones and tablets.

**Q: How do I switch between light and dark mode?**
A: Click your profile icon, select "Theme", and choose your preferred mode.

### Attendance

**Q: Why isn't my attendance showing up?**
A: If using biometric devices, ensure you've registered your biometric ID. Contact HR if your ID is not configured.

**Q: Can I edit my attendance records?**
A: No, attendance records from biometric devices cannot be edited. For corrections, contact your HR Manager.

**Q: What if I forget to check out?**
A: Your manager can manually enter your check-out time via the attendance entry feature.

### Leave

**Q: How many leave days do I have?**
A: View your leave balance on the Leave page. It shows remaining days for each leave type.

**Q: Can I cancel a submitted leave request?**
A: Not directly. Contact your manager to cancel a pending request.

**Q: When will I know if my leave is approved?**
A: You'll receive an email notification once your manager approves or rejects your request.

### Expenses

**Q: What expenses can I claim?**
A: Any legitimate business expense. Common categories include Travel, Meals, Accommodation, and Supplies.

**Q: Do I need to upload receipts?**
A: Yes, always upload receipts for verification. Claims without receipts may be rejected.

**Q: How long does expense approval take?**
A: Typically 2-5 business days, depending on your manager's availability.

### Performance

**Q: How often should I update my goal progress?**
A: Update weekly or monthly to keep stakeholders informed.

**Q: Who can see my performance goals?**
A: Your manager and HR can view your goals. Peers cannot see them unless you share.

**Q: When will I receive my performance appraisal?**
A: Appraisals are typically conducted quarterly or annually, depending on company policy.

### Technical Issues

**Q: The page isn't loading. What should I do?**
A: Try refreshing your browser. If the issue persists, clear your cache or contact IT support.

**Q: I'm getting a "Permission Denied" error.**
A: You're trying to access a feature not available to your role. Contact your System Administrator if you believe this is incorrect.

**Q: Can I use multiple browser tabs?**
A: Yes, but be aware that logging out in one tab will log you out in all tabs.

---

## Getting Help

### Support Contacts
- **System Admin**: For account and access issues
- **HR Manager**: For leave, expenses, and employee-related queries
- **IT Support**: For technical problems

### Training Resources
- Review this user guide
- Attend onboarding sessions
- Request one-on-one training from HR

---

**Document Version:** 1.0  
**Last Updated:** November 22, 2025  
**For Additional Support:** Contact your System Administrator
