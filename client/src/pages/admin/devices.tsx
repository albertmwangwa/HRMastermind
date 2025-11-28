import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { Server, RefreshCw, Settings, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { AttendanceDevice } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminDevices() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState<string | null>(null);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: devices, isLoading } = useQuery<AttendanceDevice[]>({
    queryKey: ["/api/devices"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/devices/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/devices"] });
      toast({
        title: "Device deleted",
        description: "The device has been successfully removed.",
      });
      setDeleteDialogOpen(false);
      setDeviceToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete device",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const syncMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("POST", `/api/devices/${id}/sync`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/devices"] });
      toast({
        title: "Sync started",
        description: "Device synchronization has been initiated in the background.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Sync failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSyncAll = async () => {
    if (!devices) return;

    toast({
      title: "Syncing all devices",
      description: "Initiating sync for all connected devices...",
    });

    // Trigger sync for all devices
    const promises = devices.map(device =>
      apiRequest("POST", `/api/devices/${device.id}/sync`)
        .catch(err => console.error(`Failed to sync device ${device.id}`, err))
    );

    await Promise.all(promises);

    toast({
      title: "Sync initiated",
      description: "Background sync started for all devices.",
    });
  };

  const handleDeleteClick = (deviceId: string) => {
    setDeviceToDelete(deviceId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deviceToDelete) {
      deleteMutation.mutate(deviceToDelete);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">ZKTeco Device Configuration</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage biometric attendance devices and sync employee data</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleSyncAll}
            disabled={!devices || devices.length === 0}
            data-testid="button-sync-all"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync All Devices
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

      {/* Search and Filter */}
      <div className="mb-4 flex gap-3">
        <input
          type="text"
          placeholder="Search by name, IP, location, or branch..."
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
          <option value="syncing">Syncing</option>
          <option value="idle">Idle</option>
          <option value="error">Error</option>
        </select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <Card key={i} className="h-48 animate-pulse bg-muted/50" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {devices
            ?.filter((device) => {
              const matchesSearch =
                searchQuery === "" ||
                device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                device.ipAddress.includes(searchQuery) ||
                device.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                device.branch.toLowerCase().includes(searchQuery.toLowerCase());

              const matchesStatus = statusFilter === "all" || device.status === statusFilter;

              return matchesSearch && matchesStatus;
            })
            .map((device) => (
              <Card key={device.id} className="hover-elevate" data-testid={`device-${device.id}`}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-base font-semibold flex-1">{device.name}</CardTitle>
                    <StatusBadge status={device.status} />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDeleteClick(device.id)}
                      data-testid={`button-delete-${device.id}`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">IP Address</p>
                      <p className="font-medium">{device.ipAddress}</p>
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
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Last Sync: {device.lastSyncAt ? formatDistanceToNow(new Date(device.lastSyncAt), { addSuffix: true }) : 'Never'}
                      </p>
                      {device.lastSyncRecordCount !== null && device.lastSyncRecordCount !== undefined && (
                        <p className="text-xs text-muted-foreground">
                          {device.lastSyncRecordCount} record{device.lastSyncRecordCount !== 1 ? 's' : ''}
                          {device.lastSyncDuration && ` in ${(device.lastSyncDuration / 1000).toFixed(1)}s`}
                          {device.lastSyncSuccess === false && ' (failed)'}
                        </p>
                      )}
                      {device.lastError && (
                        <p className="text-xs text-destructive truncate max-w-[200px]" title={device.lastError}>
                          Error: {device.lastError}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => syncMutation.mutate(device.id)}
                      disabled={syncMutation.isPending}
                      data-testid={`button-sync-${device.id}`}
                    >
                      <RefreshCw className={`h-3 w-3 mr-2 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
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
      )}

      {!isLoading && devices?.length === 0 && (
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Device</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this device? This action cannot be undone.
              All attendance records linked to this device will remain but the device configuration will be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              Delete Device
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

