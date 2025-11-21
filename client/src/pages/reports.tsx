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
