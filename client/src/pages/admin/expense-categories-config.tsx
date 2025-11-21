import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertExpenseCategorySchema } from "@shared/schema";
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
import type { ExpenseCategory } from "@shared/schema";

const expenseCategoryFormSchema = insertExpenseCategorySchema;

export default function ExpenseCategoriesConfig() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null);
  const { toast } = useToast();

  const { data: expenseCategories = [], isLoading } = useQuery<ExpenseCategory[]>({
    queryKey: ["/api/admin/expense-categories"],
  });

  const form = useForm<z.infer<typeof expenseCategoryFormSchema>>({
    resolver: zodResolver(expenseCategoryFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: z.infer<typeof expenseCategoryFormSchema>) =>
      apiRequest("POST", "/api/admin/expense-categories", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/expense-categories"] });
      toast({
        title: "Success",
        description: "Expense category created successfully",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create expense category",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: string } & z.infer<typeof expenseCategoryFormSchema>) =>
      apiRequest("PUT", `/api/admin/expense-categories/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/expense-categories"] });
      toast({
        title: "Success",
        description: "Expense category updated successfully",
      });
      setIsDialogOpen(false);
      setEditingCategory(null);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update expense category",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/expense-categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/expense-categories"] });
      toast({
        title: "Success",
        description: "Expense category deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete expense category",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (category: ExpenseCategory) => {
    setEditingCategory(category);
    form.reset({
      name: category.name,
    });
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingCategory(null);
    form.reset({
      name: "",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (data: z.infer<typeof expenseCategoryFormSchema>) => {
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (categoryId: string) => {
    if (confirm("Are you sure you want to delete this expense category?")) {
      deleteMutation.mutate(categoryId);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Expense Categories Configuration</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage expense categories for claims and reimbursements
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} data-testid="button-add-category">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Expense Category" : "Add New Expense Category"}
              </DialogTitle>
              <DialogDescription>
                {editingCategory ? "Update category information" : "Create a new expense category"}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., Travel"
                          data-testid="input-name"
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
                    {editingCategory ? "Save Changes" : "Create Category"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Expense Categories</CardTitle>
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
                  <TableHead>Category Name</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenseCategories.map((category) => (
                  <TableRow key={category.id} data-testid={`row-category-${category.id}`}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(category)}
                          data-testid={`button-edit-${category.id}`}
                        >
                          <Edit2 className="h-3 w-3 mr-2" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(category.id)}
                          disabled={deleteMutation.isPending}
                          data-testid={`button-delete-${category.id}`}
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
