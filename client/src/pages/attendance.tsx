import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, Plus, Filter } from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, subDays, startOfMonth, startOfWeek, subMonths } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { AttendanceLog, Employee, AttendanceDevice } from "@shared/schema";

type AttendanceRecord = AttendanceLog & {
  employee: Employee;
  device: AttendanceDevice | null;
};

export default function Attendance() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: new Date(),
    to: new Date(),
  });
  const [department, setDepartment] = useState("all");
  const [timePeriod, setTimePeriod] = useState("today");
  const [, navigate] = useLocation();

  // Calculate date range based on timePeriod
  const getEffectiveDateRange = () => {
    const today = new Date();
    switch (timePeriod) {
      case "today":
        return { from: today, to: today };
      case "this-week":
        return { from: startOfWeek(today), to: today };
      case "this-month":
        return { from: startOfMonth(today), to: today };
      case "last-week":
        const lastWeekStart = startOfWeek(subDays(today, 7));
        return { from: lastWeekStart, to: subDays(lastWeekStart, -6) };
      case "last-month":
        const lastMonthStart = startOfMonth(subMonths(today, 1));
        return { from: lastMonthStart, to: subMonths(startOfMonth(today), 0) }; // End of last month
      case "custom":
        return dateRange;
      default:
        return { from: today, to: today };
    }
  };

  const effectiveRange = getEffectiveDateRange();

  const { data: attendanceRecords = [], isLoading } = useQuery<AttendanceRecord[]>({
    queryKey: ["/api/attendance", effectiveRange.from?.toISOString(), effectiveRange.to?.toISOString(), department],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (effectiveRange.from) params.append("startDate", effectiveRange.from.toISOString());
      if (effectiveRange.to) params.append("endDate", effectiveRange.to.toISOString());
      if (department !== "all") params.append("departmentId", department);

      const res = await fetch(`/api/attendance?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch attendance records");
      return res.json();
    },
  });

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
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <CardTitle className="text-lg">Attendance Records</CardTitle>
                <div className="flex flex-wrap items-center gap-2">
                  <Select value={timePeriod} onValueChange={setTimePeriod}>
                    <SelectTrigger className="w-[140px]" data-testid="select-time-period">
                      <SelectValue placeholder="Time Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="this-week">This Week</SelectItem>
                      <SelectItem value="this-month">This Month</SelectItem>
                      <SelectItem value="last-week">Last Week</SelectItem>
                      <SelectItem value="last-month">Last Month</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>

                  {timePeriod === "custom" && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="justify-start text-left" data-testid="button-date-range">
                          {dateRange.from ? (
                            dateRange.to ? (
                              <>
                                {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd, yyyy")}
                              </>
                            ) : (
                              format(dateRange.from, "MMM dd, yyyy")
                            )
                          ) : (
                            "Select dates"
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <div className="p-3 space-y-2">
                          <div>
                            <p className="text-sm font-medium mb-2">From</p>
                            <Calendar
                              mode="single"
                              selected={dateRange.from}
                              onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                              data-testid="calendar-from"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-2">To</p>
                            <Calendar
                              mode="single"
                              selected={dateRange.to}
                              onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                              data-testid="calendar-to"
                            />
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}

                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger className="w-[140px]" data-testid="select-department">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {/* TODO: Fetch departments dynamically */}
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" size="icon" data-testid="button-reset-filters" onClick={() => {
                    setTimePeriod("today");
                    setDepartment("all");
                  }}>
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
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
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">Loading records...</TableCell>
                    </TableRow>
                  ) : attendanceRecords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">No attendance records found for this period.</TableCell>
                    </TableRow>
                  ) : (
                    attendanceRecords.map((record) => (
                      <TableRow key={record.id} data-testid={`attendance-record-${record.id}`}>
                        <TableCell className="font-medium">{record.employee.firstName} {record.employee.lastName}</TableCell>
                        <TableCell>{record.employee.biometricId}</TableCell>
                        <TableCell>{record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : "-"}</TableCell>
                        <TableCell>{record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : "-"}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{record.device?.name || "Unknown"}</TableCell>
                      </TableRow>
                    ))
                  )}
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
                {/* Summary stats would need a separate API call or calculation */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Records Found</span>
                    <span className="font-semibold">
                      {attendanceRecords.filter(r =>
                        date && new Date(r.date).toDateString() === date.toDateString()
                      ).length}
                    </span>
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
