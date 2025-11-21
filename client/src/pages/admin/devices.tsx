import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { Server, RefreshCw, Settings, Plus } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

//todo: remove mock functionality
const devices = [
  { id: 1, name: "HQ - Main Entrance", ip: "192.168.1.100", port: "4370", location: "Headquarters", branch: "HQ", status: "online" as const, lastSync: "2 mins ago", employees: 120 },
  { id: 2, name: "Branch A - Gate 1", ip: "192.168.2.100", port: "4370", location: "Branch A", branch: "Branch A", status: "online" as const, lastSync: "5 mins ago", employees: 45 },
  { id: 3, name: "Branch B - Reception", ip: "192.168.3.100", port: "4370", location: "Branch B", branch: "Branch B", status: "offline" as const, lastSync: "2 hours ago", employees: 38 },
  { id: 4, name: "Warehouse - Entry", ip: "192.168.4.100", port: "4370", location: "Warehouse", branch: "Warehouse", status: "online" as const, lastSync: "1 min ago", employees: 25 },
];

export default function AdminDevices() {
  const [syncing, setSyncing] = useState(false);
  const [, navigate] = useLocation();

  const handleSyncAll = () => {
    setSyncing(true);
    console.log("Syncing all devices...");
    setTimeout(() => {
      setSyncing(false);
      console.log("Sync completed");
    }, 2000);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">ZKTeco Device Configuration</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage biometric attendance devices and sync employee data</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSyncAll} disabled={syncing} data-testid="button-sync-all">
            <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? "Syncing..." : "Sync All Devices"}
          </Button>
          <Button 
            onClick={() => navigate("/admin/device/new")}
            data-testid="button-add-device"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Device
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {devices.map((device) => (
          <Card key={device.id} className="hover-elevate" data-testid={`device-${device.id}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">{device.name}</CardTitle>
                <StatusBadge status={device.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">IP Address</p>
                  <p className="font-medium">{device.ip}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Port</p>
                  <p className="font-medium">{device.port}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="font-medium">{device.location}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Branch</p>
                  <p className="font-medium">{device.branch}</p>
                </div>
              </div>
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Last Sync: {device.lastSync}</p>
                  <p className="text-xs text-muted-foreground">{device.employees} employees</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" data-testid={`button-sync-${device.id}`}>
                  <RefreshCw className="h-3 w-3 mr-2" />
                  Sync Now
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1" 
                  onClick={() => navigate(`/admin/device/${device.id}`)}
                  data-testid={`button-configure-${device.id}`}
                >
                  <Settings className="h-3 w-3 mr-2" />
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {devices.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Server className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-semibold mb-2">No devices configured</p>
            <p className="text-sm text-muted-foreground mb-4">Add your first ZKTeco biometric device to start tracking attendance</p>
            <Button onClick={() => navigate("/admin/device/new")} data-testid="button-add-first-device">
              <Plus className="h-4 w-4 mr-2" />
              Add Device
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
