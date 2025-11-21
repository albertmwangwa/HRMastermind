import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type UserRole = "system_admin" | "hr_manager" | "department_manager" | "employee";

interface RequireRoleProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export function RequireRole({ allowedRoles, children }: RequireRoleProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/");
    }
  }, [isLoading, isAuthenticated, setLocation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen" data-testid="loading-guard">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  if (!allowedRoles.includes(user.role as UserRole)) {
    return (
      <div className="flex items-center justify-center h-screen p-6" data-testid="unauthorized-access">
        <Card className="max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <CardTitle>Access Denied</CardTitle>
            </div>
            <CardDescription>
              You do not have permission to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setLocation("/")} 
              className="w-full"
              data-testid="button-back-home"
            >
              Go Back Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
