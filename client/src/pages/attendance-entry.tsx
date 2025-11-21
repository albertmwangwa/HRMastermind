import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Check } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AttendanceEntry {
  id: string;
  employee: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: "present" | "absent" | "late" | "half-day";
}

export default function AttendanceEntry() {
  const [entries, setEntries] = useState<AttendanceEntry[]>([
    { id: "1", employee: "John Smith", date: "2024-03-29", checkIn: "09:02", checkOut: "17:45", status: "present" },
    { id: "2", employee: "Sarah Johnson", date: "2024-03-29", checkIn: "08:55", checkOut: "17:30", status: "present" },
    { id: "3", employee: "Mike Chen", date: "2024-03-29", checkIn: "", checkOut: "", status: "absent" },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    employee: "",
    date: new Date().toISOString().split("T")[0],
    checkIn: "",
    checkOut: "",
    status: "present",
  });

  const handleAddEntry = () => {
    if (!formData.employee) return;

    setEntries(prev => [...prev, {
      id: Date.now().toString(),
      employee: formData.employee,
      date: formData.date,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      status: formData.status as any
    }]);

    setFormData({
      employee: "",
      date: new Date().toISOString().split("T")[0],
      checkIn: "",
      checkOut: "",
      status: "present",
    });
    setIsDialogOpen(false);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Manual Attendance Entry</h1>
          <p className="text-sm text-muted-foreground mt-1">Record or update attendance for employees</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-entry">
              <Plus className="h-4 w-4 mr-2" />
              Add Attendance Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Record Attendance</DialogTitle>
              <DialogDescription>Add or update attendance for an employee</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="employee">Employee</Label>
                <Select value={formData.employee} onValueChange={(v) => setFormData(prev => ({ ...prev, employee: v }))}>
                  <SelectTrigger data-testid="select-employee">
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="John Smith">John Smith</SelectItem>
                    <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                    <SelectItem value="Mike Chen">Mike Chen</SelectItem>
                    <SelectItem value="Emily Davis">Emily Davis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  data-testid="input-date"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="checkIn">Check In Time</Label>
                  <Input
                    id="checkIn"
                    type="time"
                    value={formData.checkIn}
                    onChange={(e) => setFormData(prev => ({ ...prev, checkIn: e.target.value }))}
                    data-testid="input-check-in"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkOut">Check Out Time</Label>
                  <Input
                    id="checkOut"
                    type="time"
                    value={formData.checkOut}
                    onChange={(e) => setFormData(prev => ({ ...prev, checkOut: e.target.value }))}
                    data-testid="input-check-out"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData(prev => ({ ...prev, status: v }))}>
                  <SelectTrigger data-testid="select-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                    <SelectItem value="late">Late</SelectItem>
                    <SelectItem value="half-day">Half Day</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} data-testid="button-cancel">
                Cancel
              </Button>
              <Button onClick={handleAddEntry} data-testid="button-save-entry">
                <Check className="h-4 w-4 mr-2" />
                Record Attendance
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id} data-testid={`entry-row-${entry.id}`}>
                  <TableCell className="font-medium">{entry.employee}</TableCell>
                  <TableCell>{entry.date}</TableCell>
                  <TableCell>{entry.checkIn || "-"}</TableCell>
                  <TableCell>{entry.checkOut || "-"}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      entry.status === "present" ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300" :
                      entry.status === "absent" ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300" :
                      entry.status === "late" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300" :
                      "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                    }`}>
                      {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
