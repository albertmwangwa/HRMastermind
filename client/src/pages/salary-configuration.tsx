import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

export default function SalaryConfiguration({ params }: { params: { employeeId: string } }) {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    basicSalary: "120000",
    hra: "24000",
    travelAllowance: "5000",
    otherAllowances: "10000",
    taxDeduction: "12000",
    pfDeduction: "15000",
    esiDeduction: "800",
    otherDeductions: "2000",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateNetSalary = () => {
    const earnings = 
      parseFloat(formData.basicSalary) +
      parseFloat(formData.hra) +
      parseFloat(formData.travelAllowance) +
      parseFloat(formData.otherAllowances);
    
    const deductions =
      parseFloat(formData.taxDeduction) +
      parseFloat(formData.pfDeduction) +
      parseFloat(formData.esiDeduction) +
      parseFloat(formData.otherDeductions);

    return (earnings - deductions).toFixed(2);
  };

  const handleSave = () => {
    console.log("Saving salary configuration:", formData);
    // TODO: Call API to update salary
  };

  const totalEarnings = (
    parseFloat(formData.basicSalary) +
    parseFloat(formData.hra) +
    parseFloat(formData.travelAllowance) +
    parseFloat(formData.otherAllowances)
  ).toFixed(2);

  const totalDeductions = (
    parseFloat(formData.taxDeduction) +
    parseFloat(formData.pfDeduction) +
    parseFloat(formData.esiDeduction) +
    parseFloat(formData.otherDeductions)
  ).toFixed(2);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/payroll")}
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">Salary Configuration</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure employee salary structure</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalEarnings}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Deductions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalDeductions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Net Salary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">₹{calculateNetSalary()}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="earnings" className="space-y-6">
        <TabsList>
          <TabsTrigger value="earnings" data-testid="tab-earnings">Earnings</TabsTrigger>
          <TabsTrigger value="deductions" data-testid="tab-deductions">Deductions</TabsTrigger>
        </TabsList>

        <TabsContent value="earnings">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Salary Components - Earnings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="basicSalary">Basic Salary</Label>
                <Input
                  id="basicSalary"
                  type="number"
                  value={formData.basicSalary}
                  onChange={(e) => handleInputChange("basicSalary", e.target.value)}
                  data-testid="input-basic-salary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hra">HRA (House Rent Allowance)</Label>
                <Input
                  id="hra"
                  type="number"
                  value={formData.hra}
                  onChange={(e) => handleInputChange("hra", e.target.value)}
                  data-testid="input-hra"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="travelAllowance">Travel Allowance</Label>
                <Input
                  id="travelAllowance"
                  type="number"
                  value={formData.travelAllowance}
                  onChange={(e) => handleInputChange("travelAllowance", e.target.value)}
                  data-testid="input-travel-allowance"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="otherAllowances">Other Allowances</Label>
                <Input
                  id="otherAllowances"
                  type="number"
                  value={formData.otherAllowances}
                  onChange={(e) => handleInputChange("otherAllowances", e.target.value)}
                  data-testid="input-other-allowances"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deductions">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Salary Components - Deductions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="taxDeduction">Income Tax</Label>
                <Input
                  id="taxDeduction"
                  type="number"
                  value={formData.taxDeduction}
                  onChange={(e) => handleInputChange("taxDeduction", e.target.value)}
                  data-testid="input-tax-deduction"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pfDeduction">PF (Provident Fund)</Label>
                <Input
                  id="pfDeduction"
                  type="number"
                  value={formData.pfDeduction}
                  onChange={(e) => handleInputChange("pfDeduction", e.target.value)}
                  data-testid="input-pf-deduction"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="esiDeduction">ESI (Employee State Insurance)</Label>
                <Input
                  id="esiDeduction"
                  type="number"
                  value={formData.esiDeduction}
                  onChange={(e) => handleInputChange("esiDeduction", e.target.value)}
                  data-testid="input-esi-deduction"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="otherDeductions">Other Deductions</Label>
                <Input
                  id="otherDeductions"
                  type="number"
                  value={formData.otherDeductions}
                  onChange={(e) => handleInputChange("otherDeductions", e.target.value)}
                  data-testid="input-other-deductions"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => navigate("/payroll")} data-testid="button-cancel">
          Cancel
        </Button>
        <Button onClick={handleSave} data-testid="button-save">
          <Save className="h-4 w-4 mr-2" />
          Save Configuration
        </Button>
      </div>
    </div>
  );
}
