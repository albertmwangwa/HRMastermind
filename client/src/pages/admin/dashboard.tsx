import { MetricCard } from "@/components/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Shield, Server, Settings } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { AttendanceDevice } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { useLocation } from "wouter";

interface AdminDashboardStats {
  totalUsers: number;
  totalDepartments: number;
  leaveTypesConfigured: number;
  expenseCategoriesConfigured: number;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  const { data: stats, isLoading: statsLoading } = useQuery<AdminDashboardStats>({
    queryKey: ["/api/admin/dashboard/stats"],
  });

  const { data: devices, isLoading: devicesLoading } = useQuery<AttendanceDevice[]>({
    queryKey: ["/api/devices"],
  });

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="text-admin-dashboard-title">
          System Administration
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage system configuration and infrastructure
        </p>
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
              title="Total Users"
              value={stats?.totalUsers.toString() || "0"}
              icon={Users}
            />
            <MetricCard
              title="Departments"
              value={stats?.totalDepartments.toString() || "0"}
              icon={Shield}
            />
            <MetricCard
              title="Leave Types"
              value={stats?.leaveTypesConfigured.toString() || "0"}
              icon={Settings}
            />
            <MetricCard
              title="Expense Categories"
              value={stats?.expenseCategoriesConfigured.toString() || "0"}
              icon={Settings}
            />
          </>
        )}
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
            {devicesLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
              </div>
            ) : devices && devices.length > 0 ? (
              <>
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
                          <p className="text-xs text-muted-foreground mt-1">
                            {device.location} - {device.branch}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            IP: {device.ipAddress}:{device.port}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Last Sync</p>
                          <p className="text-xs font-medium">
                            {device.lastSyncAt
                              ? formatDistanceToNow(new Date(device.lastSyncAt), { addSuffix: true })
                              : "Never"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" data-testid="button-sync-devices">
                    Sync All Devices
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setLocation("/admin/devices")}
                    data-testid="button-manage-devices"
                  >
                    Manage Devices
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Server className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-sm text-muted-foreground">No devices configured</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-4"
                  onClick={() => setLocation("/admin/devices")}
                  data-testid="button-add-device"
                >
                  Add Device
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setLocation("/admin/users")}
              data-testid="button-manage-users"
            >
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setLocation("/admin/departments")}
              data-testid="button-manage-departments"
            >
              <Shield className="h-4 w-4 mr-2" />
              Manage Departments
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setLocation("/admin/devices")}
              data-testid="button-configure-devices"
            >
              <Server className="h-4 w-4 mr-2" />
              Configure Devices
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setLocation("/admin/leave-types")}
              data-testid="button-configure-leave"
            >
              <Settings className="h-4 w-4 mr-2" />
              Configure Leave Types
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
