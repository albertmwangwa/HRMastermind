import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, BarChart3 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";

//todo: remove mock functionality
const reportCategories = [
  { id: 1, name: "Attendance Report", description: "Employee attendance summary by date range", icon: FileText },
  { id: 2, name: "Leave Report", description: "Leave balance and history for all employees", icon: FileText },
  { id: 3, name: "Expense Report", description: "Expense claims and reimbursements summary", icon: FileText },
  { id: 4, name: "Payroll Report", description: "Salary disbursement and payroll summary", icon: FileText },
  { id: 5, name: "Performance Report", description: "Employee performance metrics and appraisals", icon: BarChart3 },
  { id: 6, name: "Headcount Report", description: "Employee strength and turnover analysis", icon: BarChart3 },
];

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState<string>("");
  const [reportPeriod, setReportPeriod] = useState<string>("");

  const handleGenerateReport = () => {
    console.log(`Generating ${selectedReport} for period ${reportPeriod}`);
  };

  const handleExportCSV = () => {
    console.log(`Exporting ${selectedReport} to CSV for period ${reportPeriod}`);
    const csvData = generateMockCSVData(selectedReport);
    const csvContent = "data:text/csv;charset=utf-8," + csvData;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selectedReport.replace(/ /g, "_")}_${reportPeriod}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateMockCSVData = (reportType: string) => {
    if (reportType.includes("Attendance")) {
      return "Employee,Date,Check In,Check Out,Hours Worked\nJohn Smith,2024-03-25,09:00,17:30,8.5\nSarah Johnson,2024-03-25,08:45,17:15,8.5\n";
    } else if (reportType.includes("Leave")) {
      return "Employee,Leave Type,From,To,Days,Status\nJohn Smith,Annual Leave,2024-04-01,2024-04-05,5,Approved\nMike Chen,Sick Leave,2024-03-28,2024-03-29,2,Approved\n";
    } else if (reportType.includes("Expense")) {
      return "Employee,Category,Amount,Date,Status\nJohn Smith,Travel,$450,2024-03-25,Approved\nSarah Johnson,Meals,$120,2024-03-24,Approved\n";
    } else if (reportType.includes("Payroll")) {
      return "Employee,Basic Salary,Allowances,Deductions,Net Pay\nJohn Smith,$5000,$1500,$1200,$5300\nSarah Johnson,$6500,$2000,$1700,$6800\n";
    }
    return "Report,Data,Will,Be,Here\nSample,Row,1,2,3\n";
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Reports</h1>
        <p className="text-sm text-muted-foreground mt-1">Generate and export comprehensive HR reports</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Generate Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select value={selectedReport} onValueChange={setSelectedReport}>
                <SelectTrigger data-testid="select-report-type">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  {reportCategories.map((report) => (
                    <SelectItem key={report.id} value={report.name}>
                      {report.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Period</Label>
              <Select value={reportPeriod} onValueChange={setReportPeriod}>
                <SelectTrigger data-testid="select-period">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current-month">Current Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="current-quarter">Current Quarter</SelectItem>
                  <SelectItem value="last-quarter">Last Quarter</SelectItem>
                  <SelectItem value="current-year">Current Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleGenerateReport}
              disabled={!selectedReport || !reportPeriod}
              data-testid="button-generate"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            <Button
              variant="outline"
              onClick={handleExportCSV}
              disabled={!selectedReport || !reportPeriod}
              data-testid="button-export-csv"
            >
              <Download className="h-4 w-4 mr-2" />
              Export to CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-semibold mb-4">Available Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportCategories.map((report) => (
            <Card key={report.id} className="hover-elevate cursor-pointer" data-testid={`report-card-${report.id}`}>
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <report.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base font-semibold">{report.name}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">{report.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setSelectedReport(report.name);
                    console.log(`Selected ${report.name}`);
                  }}
                  data-testid={`button-select-${report.id}`}
                >
                  Select Report
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
