import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertLeaveTypeSchema } from "@shared/schema";
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
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { LeaveType } from "@shared/schema";

const leaveTypeFormSchema = insertLeaveTypeSchema;

export default function LeaveTypesConfig() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<LeaveType | null>(null);
  const { toast } = useToast();

  const { data: leaveTypes = [], isLoading } = useQuery<LeaveType[]>({
    queryKey: ["/api/admin/leave-types"],
  });

  const form = useForm<z.infer<typeof leaveTypeFormSchema>>({
    resolver: zodResolver(leaveTypeFormSchema),
    defaultValues: {
      name: "",
      daysAllowed: 0,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: z.infer<typeof leaveTypeFormSchema>) =>
      apiRequest("POST", "/api/admin/leave-types", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/leave-types"] });
      toast({
        title: "Success",
        description: "Leave type created successfully",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create leave type",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: string } & z.infer<typeof leaveTypeFormSchema>) =>
      apiRequest("PUT", `/api/admin/leave-types/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/leave-types"] });
      toast({
        title: "Success",
        description: "Leave type updated successfully",
      });
      setIsDialogOpen(false);
      setEditingType(null);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update leave type",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/leave-types/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/leave-types"] });
      toast({
        title: "Success",
        description: "Leave type deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete leave type",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (type: LeaveType) => {
    setEditingType(type);
    form.reset({
      name: type.name,
      daysAllowed: type.daysAllowed,
    });
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingType(null);
    form.reset({
      name: "",
      daysAllowed: 0,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (data: z.infer<typeof leaveTypeFormSchema>) => {
    if (editingType) {
      updateMutation.mutate({ id: editingType.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (typeId: string) => {
    if (confirm("Are you sure you want to delete this leave type?")) {
      deleteMutation.mutate(typeId);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Leave Types Configuration</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure leave types and annual allowances
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} data-testid="button-add-leave-type">
              <Plus className="h-4 w-4 mr-2" />
              Add Leave Type
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingType ? "Edit Leave Type" : "Add New Leave Type"}
              </DialogTitle>
              <DialogDescription>
                {editingType ? "Update leave type information" : "Create a new leave type"}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Leave Type Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., Annual Leave"
                          data-testid="input-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="daysAllowed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Days Allowed (Per Year)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="1"
                          placeholder="20"
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          data-testid="input-days-allowed"
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
                    {editingType ? "Save Changes" : "Create Leave Type"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Leave Types</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Leave Type</TableHead>
                  <TableHead>Days Allowed (Annually)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaveTypes.map((type) => (
                  <TableRow key={type.id} data-testid={`row-leave-type-${type.id}`}>
                    <TableCell className="font-medium">{type.name}</TableCell>
                    <TableCell>{type.daysAllowed} days</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(type)}
                          data-testid={`button-edit-${type.id}`}
                        >
                          <Edit2 className="h-3 w-3 mr-2" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(type.id)}
                          disabled={deleteMutation.isPending}
                          data-testid={`button-delete-${type.id}`}
                        >
                          <Trash2 className="h-3 w-3 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
