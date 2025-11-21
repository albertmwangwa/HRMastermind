# HRMS Design Guidelines

## Design Approach
**System-Based Approach** inspired by BambooHR and Workday's enterprise SaaS interfaces, emphasizing information clarity, efficient workflows, and professional aesthetics for data-intensive HR operations.

## Core Design Principles
1. **Information Density with Breathing Room** - Dense data displays balanced with generous whitespace
2. **Workflow Efficiency** - Minimize clicks, streamline multi-step processes
3. **Role-Based Clarity** - Clear visual differentiation between admin, manager, and employee views
4. **Trust & Professionalism** - Conservative, reliable aesthetic appropriate for HR data

## Typography System (Poppins Family)

**Hierarchy:**
- Page Titles: 2rem (32px), font-weight 600
- Section Headers: 1.5rem (24px), font-weight 600
- Card Titles: 1.125rem (18px), font-weight 600
- Body Text: 0.875rem (14px), font-weight 400
- Labels/Meta: 0.75rem (12px), font-weight 500, uppercase tracking-wide
- Data Tables: 0.8125rem (13px), font-weight 400

**Line Heights:** 1.5 for body text, 1.2 for headings

## Layout System

**Spacing Primitives (Tailwind):**
Primary units: 2, 4, 6, 8, 12, 16
- Component padding: p-4 to p-6
- Card spacing: p-6 (desktop), p-4 (mobile)
- Section gaps: gap-6 or gap-8
- Page margins: px-6 lg:px-8
- Vertical rhythm: space-y-6 between major sections

**Grid System:**
- Dashboard cards: 3-column grid (lg:grid-cols-3), 2-column (md:grid-cols-2), 1-column (mobile)
- Data tables: Full-width with horizontal scroll on mobile
- Forms: 2-column layout (md:grid-cols-2) with full-width textareas
- Sidebar: Fixed 256px width (desktop), collapsible drawer (mobile)

**Border Radius:** 0.8rem consistently across all cards, buttons, and form inputs

## Navigation Architecture

**Sidebar Navigation (Desktop):**
- Fixed left sidebar, 256px width
- Grouped menu items by module (Recruitment, Employees, Attendance, Leave, Expenses, Performance, Payroll, Reports)
- Active state: Background fill with primary color at 10% opacity
- Icon + label pattern for all items
- Collapsible sub-menus for nested features

**Top Bar:**
- Full-width header with breadcrumb navigation
- Right-aligned: Notifications bell, user profile dropdown
- Height: 64px

**Mobile Navigation:**
- Hamburger menu triggering slide-out drawer
- Bottom navigation bar for primary modules (optional for key features)

## Component Library

### Cards
- Background: hsl(0, 0%, 99%) white
- Border: 1px solid hsl(0, 0%, 90%)
- Shadow: subtle (shadow-sm), elevated on hover (shadow-md transition)
- Padding: p-6
- Header with title + optional action button in top-right

### Buttons
**Primary:** Background primary color, white text, px-6 py-2.5
**Secondary:** Border with primary color, primary text, px-6 py-2.5
**Ghost:** Transparent background, primary text, hover state with 5% background
**Icon Buttons:** Square 40px, centered icon, subtle hover background

### Forms
- Label above input, font-size 0.75rem, font-weight 500
- Input fields: h-10, px-4, border neutral grey, focus ring with primary color
- Full-width by default, 2-column grid for related fields
- Required fields: Red asterisk after label
- Helper text: 0.75rem below input, neutral grey
- Validation: Red border + error message for invalid states

### Data Tables
- Striped rows (alternate background hsl(0, 0%, 98%))
- Header: Background hsl(0, 0%, 96%), font-weight 600, sticky on scroll
- Cell padding: px-4 py-3
- Row hover: Background hsl(0, 0%, 97%)
- Actions column: Right-aligned with icon buttons
- Pagination: Bottom-right, showing "1-20 of 150 results"
- Mobile: Horizontal scroll wrapper with sticky first column

### Modals
- Centered overlay with semi-transparent backdrop
- Max-width: 640px (md) to 896px (lg) depending on content
- Close button: Top-right, icon only
- Footer with action buttons: Right-aligned, Cancel (secondary) + Primary action

### Tabs
- Horizontal tabs with underline indicator (3px height, primary color)
- Tab padding: px-4 py-3
- Active tab: Primary color text, bold weight
- Inactive: Neutral grey text, hover state

### Status Badges
- Small pill-shaped indicators (px-3 py-1, text-xs, rounded-full)
- Semantic colors: Success (green), Warning (yellow), Error (red), Info (blue), Pending (grey)
- Used in tables, employee cards, approval workflows

### Dashboard Metrics Cards
- Large number display: 2.5rem, font-weight 700
- Label below: 0.875rem, neutral grey
- Optional trend indicator: Small arrow + percentage change
- Icon in top-right corner, primary color at 20% opacity background circle

## Module-Specific Patterns

### Dashboard
- 4-column metrics grid (top section)
- Activity feed + upcoming events (2-column split)
- Quick action buttons for common tasks
- Device status overview for ZKTeco integration (grid of device cards)

### Employee Directory
- List view: Avatar + name + role + department + location (sortable columns)
- Grid view: Card layout with profile photo, name, title, contact button
- Filter sidebar: Department, location, employment type checkboxes

### Attendance Management
- Calendar heatmap view for monthly overview
- Device management table with status indicators (online/offline)
- Real-time sync status with last updated timestamp
- Punch in/out logs table with filters

### Leave Management
- Calendar view showing approved/pending leaves
- Balance summary cards (available/taken/pending)
- Request form with date range picker
- Approval queue for managers with batch actions

### Payroll
- Payslip preview with detailed breakdowns
- Salary component configuration table
- Run payroll wizard (multi-step form)
- Export functionality prominently placed

## Responsive Behavior
- Desktop-first approach with breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Sidebar collapses to drawer on < lg
- Tables scroll horizontally on mobile with sticky first column
- Form layouts stack to single column on < md
- Dashboard metrics reduce from 4-col to 2-col to 1-col

## Animations
**Minimal and purposeful:**
- Transitions: 150ms ease for hover states, 200ms for modals
- Sidebar drawer: 300ms slide animation
- No scroll-triggered animations
- Loading states: Subtle skeleton screens or spinner

## Images
This enterprise application primarily uses **iconography over photography**. No hero images. Profile photos in employee cards/directory are the main photographic content. Device status dashboards may include small equipment icons/illustrations for visual reference.