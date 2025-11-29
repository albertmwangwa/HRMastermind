import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, BarChart3, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, startOfMonth, endOfMonth, subMonths, startOfYear, endOfYear } from "date-fns";

const reportCategories = [
  { id: "attendance", name: "Attendance Report", description: "Employee attendance summary by date range", icon: FileText },
  { id: "leave", name: "Leave Report", description: "Leave balance and history for all employees", icon: FileText },
  { id: "expense", name: "Expense Report", description: "Expense claims and reimbursements summary", icon: FileText },
  { id: "payroll", name: "Payroll Report", description: "Salary disbursement and payroll summary", icon: FileText },
  // { id: "performance", name: "Performance Report", description: "Employee performance metrics and appraisals", icon: BarChart3 },
  // { id: "headcount", name: "Headcount Report", description: "Employee strength and turnover analysis", icon: BarChart3 },
];

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState<string>("");
  const [reportPeriod, setReportPeriod] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<any[]>([]);
  const { toast } = useToast();

  const getPeriodDates = () => {
    const today = new Date();
    switch (reportPeriod) {
      case "current-month":
        return { startDate: startOfMonth(today), endDate: endOfMonth(today) };
      case "last-month":
        const lastMonth = subMonths(today, 1);
        return { startDate: startOfMonth(lastMonth), endDate: endOfMonth(lastMonth) };
      case "current-quarter":
        // Simplified quarter calculation
        const currentQuarter = Math.floor((today.getMonth() + 3) / 3);
        const quarterStart = new Date(today.getFullYear(), (currentQuarter - 1) * 3, 1);
        const quarterEnd = new Date(today.getFullYear(), currentQuarter * 3, 0);
        return { startDate: quarterStart, endDate: quarterEnd };
      case "current-year":
        return { startDate: startOfYear(today), endDate: endOfYear(today) };
      default:
        return { startDate: startOfMonth(today), endDate: endOfMonth(today) };
    }
  };

  const fetchReportData = async () => {
    if (!selectedReport || !reportPeriod) return null;

    setIsLoading(true);
    try {
      const { startDate, endDate } = getPeriodDates();
      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        period: reportPeriod
      });

      const res = await fetch(`/api/reports/${selectedReport}?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to generate report");

      const data = await res.json();
      setReportData(data);
      return data;
    } catch (error) {
      console.error("Report generation error:", error);
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = () => {
    fetchReportData();
  };

  const handleExportCSV = async () => {
    let dataToExport = reportData;

    // If no data generated yet, fetch it first
    if (dataToExport.length === 0) {
      dataToExport = await fetchReportData() || [];
    }

    if (dataToExport.length === 0) {
      toast({
        title: "No Data",
        description: "There is no data to export for the selected criteria.",
      });
      return;
    }

    // Convert to CSV
    const headers = Object.keys(dataToExport[0]);
    const csvContent = [
      headers.join(","),
      ...dataToExport.map(row => headers.map(header => {
        const value = row[header];
        // Handle commas in values by wrapping in quotes
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      }).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `${selectedReport}_${reportPeriod}_${format(new Date(), "yyyyMMdd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                    <SelectItem key={report.id} value={report.id}>
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
                  <SelectItem value="current-year">Current Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleGenerateReport}
              disabled={!selectedReport || !reportPeriod || isLoading}
              data-testid="button-generate"
            >
              {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <BarChart3 className="h-4 w-4 mr-2" />}
              Generate Report
            </Button>
            <Button
              variant="outline"
              onClick={handleExportCSV}
              disabled={!selectedReport || !reportPeriod || isLoading}
              data-testid="button-export-csv"
            >
              <Download className="h-4 w-4 mr-2" />
              Export to CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {reportData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Report Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {Object.keys(reportData[0]).map((header) => (
                      <TableHead key={header}>{header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.slice(0, 10).map((row, i) => (
                    <TableRow key={i}>
                      {Object.values(row).map((value: any, j) => (
                        <TableCell key={j}>{value}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {reportData.length > 10 && (
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Showing first 10 rows of {reportData.length} records. Export to CSV to see all data.
              </p>
            )}
          </CardContent>
        </Card>
      )}

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
                    setSelectedReport(report.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
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
