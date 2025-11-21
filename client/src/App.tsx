import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Employees from "@/pages/employees";
import EmployeeDetail from "@/pages/employee-detail";
import Attendance from "@/pages/attendance";
import AttendanceEntry from "@/pages/attendance-entry";
import Leave from "@/pages/leave";
import LeaveConfiguration from "@/pages/leave-configuration";
import LeaveApproval from "@/pages/leave-approval";
import Expenses from "@/pages/expenses";
import ExpenseApproval from "@/pages/expense-approval";
import Performance from "@/pages/performance";
import Payroll from "@/pages/payroll";
import SalaryConfiguration from "@/pages/salary-configuration";
import Recruitment from "@/pages/recruitment";
import JobDetail from "@/pages/job-detail";
import Reports from "@/pages/reports";
import Settings from "@/pages/settings";
import DeviceConfiguration from "@/pages/device-configuration";
import DepartmentManagement from "@/pages/department-management";
import UserManagement from "@/pages/admin/user-management";
import DepartmentConfig from "@/pages/admin/department-config";
import LeaveTypesConfig from "@/pages/admin/leave-types-config";
import ExpenseCategoriesConfig from "@/pages/admin/expense-categories-config";
import AdminDashboard from "@/pages/admin/dashboard";
import NotFound from "@/pages/not-found";
import { Bell, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RequireRole } from "@/components/RequireRole";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/login" component={Login} />
        </>
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/recruitment" component={Recruitment} />
          <Route path="/recruitment/job/:id" component={JobDetail} />
          <Route path="/employees" component={Employees} />
          <Route path="/employees/:id" component={EmployeeDetail} />
          <Route path="/attendance" component={Attendance} />
          <Route path="/attendance-entry" component={AttendanceEntry} />
          <Route path="/attendance/device/:id" component={DeviceConfiguration} />
          <Route path="/leave" component={Leave} />
          <Route path="/leave-configuration" component={LeaveConfiguration} />
          <Route path="/leave-approval" component={LeaveApproval} />
          <Route path="/expenses" component={Expenses} />
          <Route path="/expense-approval" component={ExpenseApproval} />
          <Route path="/performance" component={Performance} />
          <Route path="/payroll" component={Payroll} />
          <Route path="/payroll/salary/:employeeId" component={SalaryConfiguration} />
          <Route path="/reports" component={Reports} />
          <Route path="/settings" component={Settings} />
          <Route path="/settings/departments" component={DepartmentManagement} />
          <Route path="/admin">
            {() => (
              <RequireRole allowedRoles={["system_admin"]}>
                <AdminDashboard />
              </RequireRole>
            )}
          </Route>
          <Route path="/admin/users">
            {() => (
              <RequireRole allowedRoles={["system_admin"]}>
                <UserManagement />
              </RequireRole>
            )}
          </Route>
          <Route path="/admin/departments">
            {() => (
              <RequireRole allowedRoles={["system_admin"]}>
                <DepartmentConfig />
              </RequireRole>
            )}
          </Route>
          <Route path="/admin/devices">
            {() => (
              <RequireRole allowedRoles={["system_admin"]}>
                <DeviceConfiguration />
              </RequireRole>
            )}
          </Route>
          <Route path="/admin/leave-types">
            {() => (
              <RequireRole allowedRoles={["system_admin"]}>
                <LeaveTypesConfig />
              </RequireRole>
            )}
          </Route>
          <Route path="/admin/expense-categories">
            {() => (
              <RequireRole allowedRoles={["system_admin"]}>
                <ExpenseCategoriesConfig />
              </RequireRole>
            )}
          </Route>
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { user, isAuthenticated, isLoading } = useAuth();

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  const getUserInitials = () => {
    if (!user) return "U";
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";
  };

  const getUserDisplayName = () => {
    if (!user) return "User";
    return `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email || "User";
  };

  if (isLoading || !isAuthenticated) {
    return (
      <>
        <Router />
        <Toaster />
      </>
    );
  }

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
            <div className="flex items-center gap-4">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <div className="hidden md:block">
                <h2 className="text-sm font-semibold">Human Resource Management System</h2>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-9 w-9" data-testid="button-notifications">
                <Bell className="h-4 w-4" />
              </Button>
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" data-testid="button-user-menu">
                    <Avatar className="h-9 w-9">
                      {user?.profileImageUrl && (
                        <AvatarImage src={user.profileImageUrl} alt={getUserDisplayName()} style={{ objectFit: "cover" }} />
                      )}
                      <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel data-testid="text-user-name">{getUserDisplayName()}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem data-testid="menu-profile">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem data-testid="menu-settings">
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={async () => {
                      try {
                        await fetch('/api/logout', { method: 'POST' });
                      } finally {
                        window.location.href = '/login';
                      }
                    }}
                    data-testid="menu-logout"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto bg-background">
            <Router />
          </main>
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
