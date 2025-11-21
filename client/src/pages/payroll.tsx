import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { DollarSign, Download, Play } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

//todo: remove mock functionality
const payrollSummary = {
  totalEmployees: 247,
  totalGross: "$842,450",
  totalDeductions: "$168,490",
  totalNet: "$673,960",
  period: "March 2024",
};

//todo: remove mock functionality
const payrollRecords = [
  { id: 1, employee: "John Smith", empId: "EMP001", basic: "$5,000", allowances: "$1,500", deductions: "$1,200", net: "$5,300", status: "processed" as const },
  { id: 2, employee: "Sarah Johnson", empId: "EMP002", basic: "$6,500", allowances: "$2,000", deductions: "$1,700", net: "$6,800", status: "processed" as const },
  { id: 3, employee: "Mike Chen", empId: "EMP003", basic: "$4,800", allowances: "$1,200", deductions: "$1,100", net: "$4,900", status: "pending" as const },
  { id: 4, employee: "Emily Davis", empId: "EMP004", basic: "$5,200", allowances: "$1,600", deductions: "$1,300", net: "$5,500", status: "processed" as const },
];

export default function Payroll() {
  const handleRunPayroll = () => {
    console.log("Running payroll...");
  };

  const handleDownloadPayslip = (id: number) => {
    console.log(`Downloading payslip for employee ${id}`);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Payroll Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Process payroll and manage salary structures</p>
        </div>
        <Button onClick={handleRunPayroll} data-testid="button-run-payroll">
          <Play className="h-4 w-4 mr-2" />
          Run Payroll
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Payroll Summary - {payrollSummary.period}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Employees</p>
              <p className="text-2xl font-bold mt-1">{payrollSummary.totalEmployees}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Gross</p>
              <p className="text-2xl font-bold mt-1 text-blue-600">{payrollSummary.totalGross}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Deductions</p>
              <p className="text-2xl font-bold mt-1 text-red-600">{payrollSummary.totalDeductions}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Net Pay</p>
              <p className="text-2xl font-bold mt-1 text-green-600">{payrollSummary.totalNet}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payroll Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Basic Salary</TableHead>
                <TableHead>Allowances</TableHead>
                <TableHead>Deductions</TableHead>
                <TableHead>Net Pay</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrollRecords.map((record) => (
                <TableRow key={record.id} data-testid={`payroll-record-${record.id}`}>
                  <TableCell className="font-medium">{record.employee}</TableCell>
                  <TableCell>{record.empId}</TableCell>
                  <TableCell>{record.basic}</TableCell>
                  <TableCell className="text-blue-600">{record.allowances}</TableCell>
                  <TableCell className="text-red-600">{record.deductions}</TableCell>
                  <TableCell className="font-semibold text-green-600">{record.net}</TableCell>
                  <TableCell>
                    <StatusBadge status={record.status === "processed" ? "approved" : "pending"} />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadPayslip(record.id)}
                      data-testid={`button-download-${record.id}`}
                    >
                      <Download className="h-3 w-3 mr-2" />
                      Payslip
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sample Payslip Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-semibold mb-3">Earnings</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Basic Salary</span>
                  <span className="font-medium">$5,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">HRA</span>
                  <span className="font-medium">$800</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Travel Allowance</span>
                  <span className="font-medium">$400</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Other Allowances</span>
                  <span className="font-medium">$300</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold mb-3">Deductions</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (TDS)</span>
                  <span className="font-medium">$800</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">PF</span>
                  <span className="font-medium">$250</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">ESI</span>
                  <span className="font-medium">$100</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Other</span>
                  <span className="font-medium">$50</span>
                </div>
              </div>
            </div>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-base font-semibold">Net Pay</span>
            <span className="text-2xl font-bold text-green-600">$5,300</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
