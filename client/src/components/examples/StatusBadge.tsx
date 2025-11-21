import { StatusBadge } from "../status-badge";

export default function StatusBadgeExample() {
  return (
    <div className="flex flex-wrap gap-2 p-4">
      <StatusBadge status="approved" />
      <StatusBadge status="pending" />
      <StatusBadge status="rejected" />
      <StatusBadge status="active" />
      <StatusBadge status="inactive" />
      <StatusBadge status="online" />
      <StatusBadge status="offline" />
    </div>
  );
}
