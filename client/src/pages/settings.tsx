import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, Building, Users, Shield, Briefcase } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useLocation } from "wouter";

export default function Settings() {
  const [, navigate] = useLocation();

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage system configuration and preferences</p>
        </div>
        <Button 
          variant="outline"
          onClick={() => navigate("/settings/departments")}
          data-testid="button-manage-departments"
        >
          <Briefcase className="h-4 w-4 mr-2" />
          Manage Departments
        </Button>
      </div>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList>
          <TabsTrigger value="company" data-testid="tab-company">
            <Building className="h-4 w-4 mr-2" />
            Company
          </TabsTrigger>
          <TabsTrigger value="hr" data-testid="tab-hr">
            <Users className="h-4 w-4 mr-2" />
            HR Policies
          </TabsTrigger>
          <TabsTrigger value="security" data-testid="tab-security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" defaultValue="ACME Corporation" data-testid="input-company-name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input id="industry" defaultValue="Technology" data-testid="input-industry" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" defaultValue="123 Business St, New York, NY 10001" data-testid="input-address" />
              </div>
              <Button data-testid="button-save-company">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hr">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Leave Policies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-approve leaves under 2 days</p>
                  <p className="text-sm text-muted-foreground">Automatically approve short leave requests</p>
                </div>
                <Switch data-testid="switch-auto-approve" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Require manager approval</p>
                  <p className="text-sm text-muted-foreground">All leaves must be approved by manager</p>
                </div>
                <Switch defaultChecked data-testid="switch-manager-approval" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-factor authentication</p>
                  <p className="text-sm text-muted-foreground">Require 2FA for all users</p>
                </div>
                <Switch data-testid="switch-2fa" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Session timeout</p>
                  <p className="text-sm text-muted-foreground">Auto logout after 30 minutes of inactivity</p>
                </div>
                <Switch defaultChecked data-testid="switch-session-timeout" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
