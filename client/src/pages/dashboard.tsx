import { MetricCard } from "@/components/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Clock, Calendar, DollarSign, AlertCircle, FileCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  pendingApprovals: number;
  payrollThisMonth: string;
}

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="text-dashboard-title">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsLoading ? (
          <>
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </>
        ) : (
          <>
            <MetricCard
              title="Total Employees"
              value={stats?.totalEmployees.toString() || "0"}
              icon={Users}
            />
            <MetricCard
              title="Present Today"
              value={stats?.presentToday.toString() || "0"}
              icon={Clock}
              trend={{ 
                value: stats?.totalEmployees 
                  ? `${Math.round((stats.presentToday / stats.totalEmployees) * 100)}% attendance rate`
                  : "0%", 
                isPositive: true 
              }}
            />
            <MetricCard
              title="Pending Approvals"
              value={stats?.pendingApprovals.toString() || "0"}
              icon={AlertCircle}
            />
            <MetricCard
              title="Payroll This Month"
              value={stats?.payrollThisMonth || "$0"}
              icon={DollarSign}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="outline" data-testid="button-mark-attendance">
              <Clock className="h-4 w-4 mr-2" />
              Mark Attendance
            </Button>
            <Button className="w-full justify-start" variant="outline" data-testid="button-apply-leave">
              <Calendar className="h-4 w-4 mr-2" />
              Apply for Leave
            </Button>
            <Button className="w-full justify-start" variant="outline" data-testid="button-submit-expense">
              <DollarSign className="h-4 w-4 mr-2" />
              Submit Expense
            </Button>
            <Button className="w-full justify-start" variant="outline" data-testid="button-view-reports">
              <FileCheck className="h-4 w-4 mr-2" />
              View Reports
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground text-center py-8">
                Activity feed coming soon
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground text-center py-8">
                Events calendar coming soon
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
