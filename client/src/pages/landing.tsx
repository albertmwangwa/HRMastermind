import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  Clock,
  Calendar,
  DollarSign,
  Target,
  Briefcase,
  TrendingUp,
  Shield,
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <h1
              className="text-5xl font-bold tracking-tight"
              data-testid="text-hero-title"
            >
              Modern HRMS for Suhara Group
            </h1>
            <p
              className="text-xl text-muted-foreground"
              data-testid="text-hero-subtitle"
            >
              Streamline your HR operations with our comprehensive human
              resource management system. From recruitment to payroll, manage
              your entire employee lifecycle in one place.
            </p>
            <div className="pt-4">
              <Button
                size="lg"
                onClick={() => (window.location.href = "/login")}
                data-testid="button-login-cta"
                className="px-8 py-6"
              >
                Sign In Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2
            className="text-3xl font-bold mb-4"
            data-testid="text-features-title"
          >
            Complete HR Management Suite
          </h2>
          <p
            className="text-muted-foreground"
            data-testid="text-features-subtitle"
          >
            Everything you need to manage your workforce efficiently
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card data-testid="card-feature-employees" className="hover-elevate">
            <CardHeader>
              <Users className="h-12 w-12 mb-4 text-primary" />
              <CardTitle>Employee Management</CardTitle>
              <CardDescription>
                Comprehensive employee profiles, department organization, and
                team hierarchy management
              </CardDescription>
            </CardHeader>
          </Card>

          <Card data-testid="card-feature-attendance" className="hover-elevate">
            <CardHeader>
              <Clock className="h-12 w-12 mb-4 text-primary" />
              <CardTitle>Attendance Tracking</CardTitle>
              <CardDescription>
                Biometric device integration with ZKTeco for accurate attendance
                monitoring across branches
              </CardDescription>
            </CardHeader>
          </Card>

          <Card data-testid="card-feature-leave" className="hover-elevate">
            <CardHeader>
              <Calendar className="h-12 w-12 mb-4 text-primary" />
              <CardTitle>Leave Management</CardTitle>
              <CardDescription>
                Streamlined leave requests, approval workflows, and balance
                tracking with holiday calendar
              </CardDescription>
            </CardHeader>
          </Card>

          <Card data-testid="card-feature-payroll" className="hover-elevate">
            <CardHeader>
              <DollarSign className="h-12 w-12 mb-4 text-primary" />
              <CardTitle>Payroll Processing</CardTitle>
              <CardDescription>
                Automated salary calculations, payslip generation, and
                comprehensive payroll management
              </CardDescription>
            </CardHeader>
          </Card>

          <Card
            data-testid="card-feature-performance"
            className="hover-elevate"
          >
            <CardHeader>
              <Target className="h-12 w-12 mb-4 text-primary" />
              <CardTitle>Performance Management</CardTitle>
              <CardDescription>
                Goal tracking, performance appraisals, and continuous feedback
                system for employee growth
              </CardDescription>
            </CardHeader>
          </Card>

          <Card
            data-testid="card-feature-recruitment"
            className="hover-elevate"
          >
            <CardHeader>
              <Briefcase className="h-12 w-12 mb-4 text-primary" />
              <CardTitle>Recruitment</CardTitle>
              <CardDescription>
                Complete applicant tracking system with hiring pipeline and
                candidate evaluation
              </CardDescription>
            </CardHeader>
          </Card>

          <Card data-testid="card-feature-expenses" className="hover-elevate">
            <CardHeader>
              <TrendingUp className="h-12 w-12 mb-4 text-primary" />
              <CardTitle>Expense Management</CardTitle>
              <CardDescription>
                Easy expense claim submission, approval workflow, and
                comprehensive expense tracking
              </CardDescription>
            </CardHeader>
          </Card>

          <Card data-testid="card-feature-security" className="hover-elevate">
            <CardHeader>
              <Shield className="h-12 w-12 mb-4 text-primary" />
              <CardTitle>Role-Based Access</CardTitle>
              <CardDescription>
                Secure authentication with granular permissions for admins,
                managers, and employees
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
    </div>
  );
}
