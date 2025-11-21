import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, Users } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

//todo: remove mock functionality
const mockDepartments = [
  { id: "1", name: "Engineering", description: "Software development and IT operations", employeeCount: 45 },
  { id: "2", name: "Sales", description: "Business development and client relations", employeeCount: 28 },
  { id: "3", name: "Marketing", description: "Brand management and campaigns", employeeCount: 15 },
  { id: "4", name: "HR", description: "Human resources and talent management", employeeCount: 8 },
];

export default function DepartmentConfig() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<any>(null);

  const handleEdit = (dept: any) => {
    setEditingDept(dept);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingDept(null);
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    console.log("Department saved:", editingDept);
    setIsDialogOpen(false);
    setEditingDept(null);
  };

  const handleDelete = (deptId: string) => {
    console.log("Delete department:", deptId);
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
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Department Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Engineering"
                  defaultValue={editingDept?.name}
                  data-testid="input-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the department"
                  rows={3}
                  defaultValue={editingDept?.description}
                  data-testid="textarea-description"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} data-testid="button-submit">
                {editingDept ? "Save Changes" : "Create Department"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockDepartments.map((dept) => (
          <Card key={dept.id} data-testid={`card-department-${dept.id}`}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>{dept.name}</span>
                <div className="flex items-center gap-1 text-sm font-normal text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{dept.employeeCount}</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{dept.description}</p>
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
    </div>
  );
}
