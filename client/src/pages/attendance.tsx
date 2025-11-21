import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Server, RefreshCw, Settings, Clock } from "lucide-react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

//todo: remove mock functionality
const devices = [
  { id: 1, name: "HQ - Main Entrance", ip: "192.168.1.100", port: "4370", location: "Headquarters", branch: "HQ", status: "online" as const, lastSync: "2 mins ago", employees: 120 },
  { id: 2, name: "Branch A - Gate 1", ip: "192.168.2.100", port: "4370", location: "Branch A", branch: "Branch A", status: "online" as const, lastSync: "5 mins ago", employees: 45 },
  { id: 3, name: "Branch B - Reception", ip: "192.168.3.100", port: "4370", location: "Branch B", branch: "Branch B", status: "offline" as const, lastSync: "2 hours ago", employees: 38 },
  { id: 4, name: "Warehouse - Entry", ip: "192.168.4.100", port: "4370", location: "Warehouse", branch: "Warehouse", status: "online" as const, lastSync: "1 min ago", employees: 25 },
];

//todo: remove mock functionality
const attendanceRecords = [
  { id: 1, employee: "John Smith", biometricId: "EMP001", checkIn: "09:02 AM", checkOut: "05:45 PM", device: "HQ - Main Entrance", date: "Today" },
  { id: 2, employee: "Sarah Johnson", biometricId: "EMP002", checkIn: "08:55 AM", checkOut: "05:30 PM", device: "HQ - Main Entrance", date: "Today" },
  { id: 3, employee: "Mike Chen", biometricId: "EMP003", checkIn: "09:15 AM", checkOut: "-", device: "Branch A - Gate 1", date: "Today" },
  { id: 4, employee: "Emily Davis", biometricId: "EMP004", checkIn: "08:45 AM", checkOut: "05:20 PM", device: "HQ - Main Entrance", date: "Today" },
];

export default function Attendance() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [syncing, setSyncing] = useState(false);

  const handleSyncAll = () => {
    setSyncing(true);
    console.log("Syncing all devices...");
    setTimeout(() => {
      setSyncing(false);
      console.log("Sync completed");
    }, 2000);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Attendance Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Track employee attendance and manage biometric devices</p>
        </div>
        <Button onClick={handleSyncAll} disabled={syncing} data-testid="button-sync-all">
          <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? "Syncing..." : "Sync All Devices"}
        </Button>
      </div>

      <Tabs defaultValue="devices" className="space-y-6">
        <TabsList>
          <TabsTrigger value="devices" data-testid="tab-devices">
            <Server className="h-4 w-4 mr-2" />
            Devices
          </TabsTrigger>
          <TabsTrigger value="records" data-testid="tab-records">
            <Clock className="h-4 w-4 mr-2" />
            Attendance Records
          </TabsTrigger>
          <TabsTrigger value="calendar" data-testid="tab-calendar">
            Calendar View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="devices" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {devices.map((device) => (
              <Card key={device.id} className="hover-elevate" data-testid={`device-${device.id}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">{device.name}</CardTitle>
                    <StatusBadge status={device.status} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">IP Address</p>
                      <p className="font-medium">{device.ip}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Port</p>
                      <p className="font-medium">{device.port}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="font-medium">{device.location}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Employees</p>
                      <p className="font-medium">{device.employees}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">Last Sync: {device.lastSync}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" data-testid={`button-sync-${device.id}`}>
                      <RefreshCw className="h-3 w-3 mr-2" />
                      Sync
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" data-testid={`button-configure-${device.id}`}>
                      <Settings className="h-3 w-3 mr-2" />
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button variant="outline" data-testid="button-add-device">
            <Server className="h-4 w-4 mr-2" />
            Add New Device
          </Button>
        </TabsContent>

        <TabsContent value="records">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Today's Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Biometric ID</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Device</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceRecords.map((record) => (
                    <TableRow key={record.id} data-testid={`attendance-record-${record.id}`}>
                      <TableCell className="font-medium">{record.employee}</TableCell>
                      <TableCell>{record.biometricId}</TableCell>
                      <TableCell>{record.checkIn}</TableCell>
                      <TableCell>{record.checkOut}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{record.device}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Attendance Calendar</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Selected Date</p>
                  <p className="text-lg font-semibold">{date?.toLocaleDateString()}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Present</span>
                    <span className="font-semibold">198</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Absent</span>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">On Leave</span>
                    <span className="font-semibold">37</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
