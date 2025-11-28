import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import type { User } from "@shared/schema";

export function useAuth() {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: false,
  });

  const isSystemAdmin = user?.role === "system_admin";
  const isHRManager = user?.role === "hr_manager";
  const isDepartmentManager = user?.role === "department_manager";
  const isEmployee = user?.role === "employee";

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    role: user?.role,
    departmentId: user?.departmentId,
    isSystemAdmin,
    isHRManager,
    isDepartmentManager,
    isEmployee,
  };
}
