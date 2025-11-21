import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Zap, RotateCcw } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

export default function DeviceConfiguration({ params }: { params: { id: string } }) {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    name: "HQ - Main Entrance",
    ipAddress: "192.168.1.100",
    port: "4370",
    location: "Headquarters",
    branch: "HQ",
    connectionMode: "tcp",
    timezone: "UTC",
    enableLogging: true,
  });

  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "failed">("idle");

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTestConnection = () => {
    setTestStatus("testing");
    // TODO: Call API to test device connection
    setTimeout(() => {
      setTestStatus("success");
    }, 2000);
  };

  const handleSyncEmployees = () => {
    console.log("Syncing employees to device:", formData);
    // TODO: Call API to sync employees
  };

  const handleSave = () => {
    console.log("Saving device configuration:", formData);
    // TODO: Call API to update device
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/admin/devices")}
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">Device Configuration</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure ZKTeco biometric device</p>
        </div>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList>
          <TabsTrigger value="basic" data-testid="tab-basic">Basic Settings</TabsTrigger>
          <TabsTrigger value="advanced" data-testid="tab-advanced">Advanced</TabsTrigger>
          <TabsTrigger value="sync" data-testid="tab-sync">Sync</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Device Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Device Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., HQ - Main Entrance"
                  data-testid="input-device-name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ipAddress">IP Address</Label>
                  <Input
                    id="ipAddress"
                    value={formData.ipAddress}
                    onChange={(e) => handleInputChange("ipAddress", e.target.value)}
                    placeholder="192.168.1.100"
                    data-testid="input-ip-address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port">Port</Label>
                  <Input
                    id="port"
                    value={formData.port}
                    onChange={(e) => handleInputChange("port", e.target.value)}
                    placeholder="4370"
                    data-testid="input-port"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="Headquarters"
                    data-testid="input-location"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branch">Branch</Label>
                  <Input
                    id="branch"
                    value={formData.branch}
                    onChange={(e) => handleInputChange("branch", e.target.value)}
                    placeholder="HQ"
                    data-testid="input-branch"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Connection Test</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleTestConnection}
                disabled={testStatus === "testing"}
                data-testid="button-test-connection"
              >
                <Zap className="h-4 w-4 mr-2" />
                {testStatus === "testing" ? "Testing..." : "Test Connection"}
              </Button>
              {testStatus === "success" && (
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg text-sm text-green-700 dark:text-green-300">
                  Device connection successful! Device is online and responding.
                </div>
              )}
              {testStatus === "failed" && (
                <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg text-sm text-red-700 dark:text-red-300">
                  Connection failed. Please check IP address and port configuration.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Advanced Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="connectionMode">Connection Mode</Label>
                <Select value={formData.connectionMode} onValueChange={(v) => handleInputChange("connectionMode", v)}>
                  <SelectTrigger data-testid="select-connection-mode">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tcp">TCP/IP Direct</SelectItem>
                    <SelectItem value="api">ZKTeco Server API</SelectItem>
                    <SelectItem value="usb">USB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={formData.timezone} onValueChange={(v) => handleInputChange("timezone", v)}>
                  <SelectTrigger data-testid="select-timezone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="EST">EST</SelectItem>
                    <SelectItem value="IST">IST</SelectItem>
                    <SelectItem value="PST">PST</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableLogging">Enable Logging</Label>
                  <p className="text-xs text-muted-foreground mt-1">Log all device events for debugging</p>
                </div>
                <input
                  id="enableLogging"
                  type="checkbox"
                  checked={formData.enableLogging}
                  onChange={(e) => handleInputChange("enableLogging", e.target.checked)}
                  data-testid="checkbox-enable-logging"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sync">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Employee Biometric Sync</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Sync employee biometric templates from HRMS database to this device. This process may take several minutes.
              </p>
              <Button onClick={handleSyncEmployees} data-testid="button-sync-employees">
                <RotateCcw className="h-4 w-4 mr-2" />
                Sync Employees Now
              </Button>
              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Sync:</span>
                  <span className="font-medium">2 hours ago</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Synced Employees:</span>
                  <span className="font-medium">120 / 120</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sync Status:</span>
                  <span className="font-medium text-green-600">Complete</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => navigate("/admin/devices")} data-testid="button-cancel">
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
