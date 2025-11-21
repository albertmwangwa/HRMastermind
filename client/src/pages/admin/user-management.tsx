import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, Search, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { User, Department } from "@shared/schema";

const roleLabels: Record<string, string> = {
  system_admin: "System Admin",
  hr_manager: "HR Manager",
  department_manager: "Department Manager",
  employee: "Employee",
};

const createUserFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["system_admin", "hr_manager", "department_manager", "employee"]),
  departmentId: z.string().optional(),
});

const updateUserFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.preprocess(
    (val) => val === "" ? undefined : val,
    z.string().min(6, "Password must be at least 6 characters").optional()
  ),
  role: z.enum(["system_admin", "hr_manager", "department_manager", "employee"]),
  departmentId: z.string().optional(),
});

export default function UserManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const { data: users = [], isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const { data: departments = [] } = useQuery<Department[]>({
    queryKey: ["/api/departments"],
  });

  // Use separate forms for create and edit to ensure proper validation
  const createForm = useForm<z.infer<typeof createUserFormSchema>>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "employee",
      departmentId: "none",
    },
  });

  const updateForm = useForm<z.infer<typeof updateUserFormSchema>>({
    resolver: zodResolver(updateUserFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "employee",
      departmentId: "none",
    },
  });

  // Use a unified form interface for the UI
  const form = editingUser ? updateForm : (createForm as any);

  const createMutation = useMutation({
    mutationFn: (data: z.infer<typeof createUserFormSchema>) =>
      apiRequest("POST", "/api/admin/users", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "Success",
        description: "User created and credentials sent via email",
      });
      setIsDialogOpen(false);
      createForm.reset();
      setShowPassword(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to create user",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: string } & z.infer<typeof updateUserFormSchema>) =>
      apiRequest("PUT", `/api/admin/users/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "Success",
        description: "User updated successfully",
      });
      setIsDialogOpen(false);
      setEditingUser(null);
      updateForm.reset();
      setShowPassword(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to update user",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    },
  });


  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
    const searchLower = searchQuery.toLowerCase();
    return (
      fullName.includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower)
    );
  });

  const handleEdit = (user: User) => {
    setEditingUser(user);
    updateForm.reset({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      password: "",
      role: user.role,
      departmentId: user.departmentId || "none",
    });
    setShowPassword(false);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingUser(null);
    createForm.reset({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "employee",
      departmentId: "none",
    });
    setShowPassword(false);
    setIsDialogOpen(true);
  };

  const handleSubmit = (data: any) => {
    // Remove empty password from update requests
    const submitData = { ...data };
    if (editingUser && (!submitData.password || submitData.password === "")) {
      delete submitData.password;
    }
    
    if (editingUser) {
      updateMutation.mutate({ id: editingUser.id, ...submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleDelete = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      deleteMutation.mutate(userId);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">User Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage users, assign roles, and set department access
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} data-testid="button-add-user">
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingUser ? "Edit User" : "Add New User"}
              </DialogTitle>
              <DialogDescription>
                {editingUser ? "Update user information and permissions" : "Create a new user account with role and department"}
              </DialogDescription>
            </DialogHeader>
            <Form {...form} key={editingUser ? `edit-${editingUser.id}` : 'create'}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John"
                            {...field}
                            data-testid="input-first-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Doe"
                            {...field}
                            data-testid="input-last-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john@company.com"
                          {...field}
                          data-testid="input-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {editingUser ? "New Password (Optional)" : "Password"}
                      </FormLabel>
                      <div className="space-y-2">
                        {editingUser && (
                          <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                            Current password is set. Leave blank to keep current password.
                          </div>
                        )}
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder={editingUser ? "Leave blank to keep current" : "Enter password"}
                              {...field}
                              className="pr-10"
                              data-testid="input-password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                              data-testid="button-toggle-password"
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-role">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="system_admin">System Admin</SelectItem>
                          <SelectItem value="hr_manager">HR Manager</SelectItem>
                          <SelectItem value="department_manager">Department Manager</SelectItem>
                          <SelectItem value="employee">Employee</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="departmentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-department">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id}>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending || updateMutation.isPending}
                    data-testid="button-submit"
                  >
                    {createMutation.isPending || updateMutation.isPending
                      ? "Saving..."
                      : editingUser
                      ? "Save Changes"
                      : "Create User"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">All Users</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
                data-testid="input-search"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {usersLoading ? (
            <div className="text-center py-8 text-muted-foreground" data-testid="loading-users">
              Loading users...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground" data-testid="no-users">
              {searchQuery ? "No users found matching your search" : "No users yet"}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => {
                  const department = departments.find(d => d.id === user.departmentId);
                  return (
                    <TableRow key={user.id} data-testid={`row-user-${user.id}`}>
                      <TableCell className="font-medium">
                        {user.firstName} {user.lastName}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" data-testid={`badge-role-${user.id}`}>
                          {roleLabels[user.role]}
                        </Badge>
                      </TableCell>
                      <TableCell>{department?.name || "-"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(user)}
                            data-testid={`button-edit-${user.id}`}
                          >
                            <Edit2 className="h-3 w-3 mr-2" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(user.id)}
                            disabled={deleteMutation.isPending}
                            data-testid={`button-delete-${user.id}`}
                          >
                            <Trash2 className="h-3 w-3 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
