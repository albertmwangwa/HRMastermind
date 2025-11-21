import { MetricCard } from "@/components/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Users, Clock, Calendar, DollarSign, AlertCircle, CheckCircle2, TrendingUp, Server } from "lucide-react";
import { useState } from "react";

//todo: remove mock functionality
const devices = [
  { id: 1, name: "HQ - Main Entrance", location: "Headquarters", status: "online" as const, lastSync: "2 mins ago" },
  { id: 2, name: "Branch A - Gate 1", location: "Branch A", status: "online" as const, lastSync: "5 mins ago" },
  { id: 3, name: "Branch B - Reception", location: "Branch B", status: "offline" as const, lastSync: "2 hours ago" },
  { id: 4, name: "Warehouse - Entry", location: "Warehouse", status: "online" as const, lastSync: "1 min ago" },
];

//todo: remove mock functionality
const recentActivities = [
  { id: 1, type: "leave", message: "Sarah Johnson requested 2 days leave", time: "5 mins ago" },
  { id: 2, type: "expense", message: "Mike Chen submitted travel expense claim", time: "12 mins ago" },
  { id: 3, type: "attendance", message: "Device sync completed for HQ", time: "15 mins ago" },
  { id: 4, type: "employee", message: "New employee onboarding completed", time: "1 hour ago" },
  { id: 5, type: "payroll", message: "Payroll processing for March completed", time: "2 hours ago" },
];

//todo: remove mock functionality
const upcomingEvents = [
  { id: 1, title: "Quarterly Review Meeting", date: "Mar 28, 2024", type: "Performance" },
  { id: 2, title: "New Hire Orientation", date: "Mar 30, 2024", type: "Onboarding" },
  { id: 3, title: "Payroll Processing Deadline", date: "Apr 1, 2024", type: "Payroll" },
];

export default function Dashboard() {
  const [selectedDevice, setSelectedDevice] = useState<number | null>(null);

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Employees"
          value="247"
          icon={Users}
          trend={{ value: "12% from last month", isPositive: true }}
        />
        <MetricCard
          title="Present Today"
          value="198"
          icon={Clock}
          trend={{ value: "80% attendance rate", isPositive: true }}
        />
        <MetricCard
          title="Pending Approvals"
          value="12"
          icon={AlertCircle}
        />
        <MetricCard
          title="Payroll This Month"
          value="$842K"
          icon={DollarSign}
          trend={{ value: "3% from last month", isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Server className="h-5 w-5 text-primary" />
              ZKTeco Device Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {devices.map((device) => (
                <div
                  key={device.id}
                  className={`p-4 border rounded-md hover-elevate cursor-pointer transition-colors ${
                    selectedDevice === device.id ? "border-primary" : ""
                  }`}
                  onClick={() => setSelectedDevice(device.id)}
                  data-testid={`device-card-${device.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">{device.name}</h4>
                        <StatusBadge status={device.status} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{device.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Last Sync</p>
                      <p className="text-xs font-medium">{device.lastSync}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" data-testid="button-sync-devices">
                Sync All Devices
              </Button>
              <Button size="sm" variant="outline" data-testid="button-manage-devices">
                Manage Devices
              </Button>
            </div>
          </CardContent>
        </Card>

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
            <Button className="w-full justify-start" variant="outline" data-testid="button-view-payslip">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Payslip
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3" data-testid={`activity-${activity.id}`}>
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between" data-testid={`event-${event.id}`}>
                  <div>
                    <p className="text-sm font-medium">{event.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{event.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
