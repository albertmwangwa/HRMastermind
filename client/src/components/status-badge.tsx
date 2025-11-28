import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Status = "approved" | "pending" | "rejected" | "active" | "inactive" | "online" | "offline" | "syncing" | "idle" | "error";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig = {
  approved: { label: "Approved", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
  active: { label: "Active", className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  inactive: { label: "Inactive", className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200" },
  online: { label: "Online", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  offline: { label: "Offline", className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200" },
  syncing: { label: "Syncing...", className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 animate-pulse" },
  idle: { label: "Idle", className: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200" },
  error: { label: "Error", className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge
      variant="secondary"
      className={cn("text-xs font-medium", config.className, className)}
      data-testid={`badge-status-${status}`}
    >
      {config.label}
    </Badge>
  );
}
