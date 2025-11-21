import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Department } from "@shared/schema";

const departmentFormSchema = z.object({
  name: z.string().min(1, "Department name is required"),
  description: z.string().optional(),
});

export default function DepartmentConfig() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const { toast } = useToast();

  const { data: departments = [], isLoading } = useQuery<Department[]>({
    queryKey: ["/api/departments"],
  });

  const form = useForm<z.infer<typeof departmentFormSchema>>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: z.infer<typeof departmentFormSchema>) => {
      const payload = {
        name: data.name,
        description: data.description || undefined,
      };
      return apiRequest("POST", "/api/departments", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/departments"] });
      toast({
        title: "Success",
        description: "Department created successfully",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create department",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: string } & z.infer<typeof departmentFormSchema>) =>
      apiRequest("PUT", `/api/admin/departments/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/departments"] });
      toast({
        title: "Success",
        description: "Department updated successfully",
      });
      setIsDialogOpen(false);
      setEditingDept(null);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update department",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/departments/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/departments"] });
      toast({
        title: "Success",
        description: "Department deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete department",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (dept: Department) => {
    setEditingDept(dept);
    form.reset({
      name: dept.name,
      description: dept.description || "",
    });
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingDept(null);
    form.reset({
      name: "",
      description: "",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (data: z.infer<typeof departmentFormSchema>) => {
    if (editingDept) {
      updateMutation.mutate({ id: editingDept.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (deptId: string) => {
    if (confirm("Are you sure you want to delete this department?")) {
      deleteMutation.mutate(deptId);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Department Configuration</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage organizational departments and structure
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} data-testid="button-add-department">
              <Plus className="h-4 w-4 mr-2" />
              Add Department
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingDept ? "Edit Department" : "Add New Department"}
              </DialogTitle>
              <DialogDescription>
                {editingDept ? "Update department information" : "Create a new department"}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., Engineering"
                          data-testid="input-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Brief description of the department"
                          rows={3}
                          data-testid="textarea-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
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
                    {editingDept ? "Save Changes" : "Create Department"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-muted animate-pulse rounded mb-4" />
                <div className="flex gap-2">
                  <div className="h-9 bg-muted animate-pulse rounded flex-1" />
                  <div className="h-9 bg-muted animate-pulse rounded flex-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <Card key={dept.id} data-testid={`card-department-${dept.id}`}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>{dept.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {dept.description || "No description provided"}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(dept)}
                    className="flex-1"
                    data-testid={`button-edit-${dept.id}`}
                  >
                    <Edit2 className="h-3 w-3 mr-2" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(dept.id)}
                    disabled={deleteMutation.isPending}
                    className="flex-1"
                    data-testid={`button-delete-${dept.id}`}
                  >
                    <Trash2 className="h-3 w-3 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
