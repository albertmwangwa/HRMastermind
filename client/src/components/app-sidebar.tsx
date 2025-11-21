import {
  LayoutDashboard,
  Users,
  UserPlus,
  Clock,
  Calendar,
  Receipt,
  TrendingUp,
  DollarSign,
  FileText,
  Settings,
  Shield,
  Building2,
  UserCog,
  Briefcase,
  Server,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

// Menu items for different roles
const roleMenus = {
  system_admin: [
    {
      title: "Admin Dashboard",
      url: "/admin",
      icon: Shield,
    },
    {
      title: "User Management",
      url: "/admin/users",
      icon: UserCog,
    },
    {
      title: "Departments",
      url: "/admin/departments",
      icon: Building2,
    },
    {
      title: "Device Configuration",
      url: "/admin/devices",
      icon: Server,
    },
    {
      title: "Leave Types",
      url: "/admin/leave-types",
      icon: Calendar,
    },
    {
      title: "Expense Categories",
      url: "/admin/expense-categories",
      icon: Receipt,
    },
  ],
  hr_manager: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Recruitment",
      url: "/recruitment",
      icon: UserPlus,
    },
    {
      title: "Employees",
      url: "/employees",
      icon: Users,
    },
    {
      title: "Attendance",
      url: "/attendance",
      icon: Clock,
    },
    {
      title: "Leave",
      url: "/leave",
      icon: Calendar,
    },
    {
      title: "Expenses",
      url: "/expenses",
      icon: Receipt,
    },
    {
      title: "Performance",
      url: "/performance",
      icon: TrendingUp,
    },
    {
      title: "Payroll",
      url: "/payroll",
      icon: DollarSign,
    },
    {
      title: "Reports",
      url: "/reports",
      icon: FileText,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ],
  department_manager: [
    {
      title: "My Dashboard",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: "My Team",
      url: "/employees",
      icon: Users,
    },
    {
      title: "Attendance",
      url: "/attendance",
      icon: Clock,
    },
    {
      title: "Leave Requests",
      url: "/leave-approval",
      icon: Calendar,
    },
    {
      title: "Expense Claims",
      url: "/expense-approval",
      icon: Receipt,
    },
    {
      title: "Performance",
      url: "/performance",
      icon: TrendingUp,
    },
  ],
  employee: [
    {
      title: "My Profile",
      url: "/",
      icon: Users,
    },
    {
      title: "My Attendance",
      url: "/attendance",
      icon: Clock,
    },
    {
      title: "Apply Leave",
      url: "/leave",
      icon: Calendar,
    },
    {
      title: "Submit Expense",
      url: "/expenses",
      icon: Receipt,
    },
    {
      title: "My Performance",
      url: "/performance",
      icon: TrendingUp,
    },
  ],
};

export function AppSidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  // Get menu items based on user role, default to hr_manager for backward compatibility
  const userRole = (user?.role as keyof typeof roleMenus) || "hr_manager";
  const menuItems = roleMenus[userRole] || roleMenus.hr_manager;

  const getRoleLabel = () => {
    switch (userRole) {
      case "system_admin":
        return "System Administration";
      case "hr_manager":
        return "HR Management";
      case "department_manager":
        return "Department Management";
      case "employee":
        return "Employee Portal";
      default:
        return "Human Resource Management";
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-6 border-b border-sidebar-border">
        <h2 className="text-xl font-semibold text-sidebar-foreground">HRMS</h2>
        <p className="text-xs text-muted-foreground">{getRoleLabel()}</p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wide px-4 py-3">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                // Exact match or starts with the URL path followed by a slash (for sub-routes)
                const isActive = 
                  location === item.url || 
                  (item.url !== "/" && location.startsWith(item.url + "/"));
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <a href={item.url} className="flex items-center gap-3 px-4 py-2.5">
                        <item.icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
