import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Plus } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

//todo: remove mock functionality
const attendanceRecords = [
  { id: 1, employee: "John Smith", biometricId: "EMP001", checkIn: "09:02 AM", checkOut: "05:45 PM", device: "HQ - Main Entrance", date: "Today" },
  { id: 2, employee: "Sarah Johnson", biometricId: "EMP002", checkIn: "08:55 AM", checkOut: "05:30 PM", device: "HQ - Main Entrance", date: "Today" },
  { id: 3, employee: "Mike Chen", biometricId: "EMP003", checkIn: "09:15 AM", checkOut: "-", device: "Branch A - Gate 1", date: "Today" },
  { id: 4, employee: "Emily Davis", biometricId: "EMP004", checkIn: "08:45 AM", checkOut: "05:20 PM", device: "HQ - Main Entrance", date: "Today" },
];

export default function Attendance() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [, navigate] = useLocation();

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Attendance Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Track and monitor employee attendance records</p>
        </div>
        <Button 
          onClick={() => navigate("/attendance-entry")} 
          data-testid="button-manual-entry"
        >
          <Plus className="h-4 w-4 mr-2" />
          Manual Entry
        </Button>
      </div>

      <Tabs defaultValue="records" className="space-y-6">
        <TabsList>
          <TabsTrigger value="records" data-testid="tab-records">
            <Clock className="h-4 w-4 mr-2" />
            Attendance Records
          </TabsTrigger>
          <TabsTrigger value="calendar" data-testid="tab-calendar">
            Calendar View
          </TabsTrigger>
        </TabsList>

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
