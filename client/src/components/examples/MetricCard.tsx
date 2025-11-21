import { MetricCard } from "../metric-card";
import { Users, Clock, Calendar, TrendingUp } from "lucide-react";

export default function MetricCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      <MetricCard
        title="Total Employees"
        value="247"
        icon={Users}
        trend={{ value: "12% from last month", isPositive: true }}
      />
      <MetricCard
        title="Present Today"
        value="198"
        icon={Clock}
        trend={{ value: "5% from yesterday", isPositive: true }}
      />
      <MetricCard
        title="Pending Leaves"
        value="12"
        icon={Calendar}
      />
      <MetricCard
        title="Performance Score"
        value="4.2"
        icon={TrendingUp}
        trend={{ value: "0.3 from last quarter", isPositive: true }}
      />
    </div>
  );
}
