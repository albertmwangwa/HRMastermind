import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, Calendar, DollarSign, Settings } from "lucide-react";
import { Link } from "wouter";

const configModules = [
  {
    id: "users",
    title: "User Management",
    description: "Manage users, assign roles, and set permissions",
    icon: Users,
    link: "/admin/users",
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    id: "departments",
    title: "Department Configuration",
    description: "Manage organizational structure and departments",
    icon: Building2,
    link: "/admin/departments",
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
  {
    id: "leave-types",
    title: "Leave Types",
    description: "Configure leave types and annual allowances",
    icon: Calendar,
    link: "/admin/leave-types",
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
  },
  {
    id: "expense-categories",
    title: "Expense Categories",
    description: "Manage expense categories for claims",
    icon: DollarSign,
    link: "/admin/expense-categories",
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
  },
];

export default function AdminDashboard() {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">System Administration</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure system settings and manage master data
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {configModules.map((module) => (
          <Link key={module.id} href={module.link}>
            <Card className="hover-elevate cursor-pointer h-full" data-testid={`card-${module.id}`}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className={`h-12 w-12 rounded-md ${module.bgColor} flex items-center justify-center flex-shrink-0`}>
                    <module.icon className={`h-6 w-6 ${module.color}`} />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {module.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Use the configuration modules above to set up the HRMS system for your organization:
          </p>
          <ul className="text-sm space-y-1 ml-4 list-disc text-muted-foreground">
            <li>Create user accounts and assign appropriate roles</li>
            <li>Set up your organizational departments</li>
            <li>Configure leave types and annual allowances</li>
            <li>Define expense categories for reimbursements</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
