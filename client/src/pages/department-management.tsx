import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Department {
  id: string;
  name: string;
  description: string;
  headCount: number;
  manager: string;
}

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState<Department[]>([
    { id: "1", name: "Engineering", description: "Software development and infrastructure", headCount: 25, manager: "Sarah Johnson" },
    { id: "2", name: "Human Resources", description: "HR operations and employee management", headCount: 5, manager: "Mike Chen" },
    { id: "3", name: "Sales", description: "Sales and business development", headCount: 15, manager: "Emily Davis" },
    { id: "4", name: "Marketing", description: "Marketing and communications", headCount: 8, manager: "David Wilson" },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "", manager: "" });

  const handleAddOrEdit = () => {
    if (!formData.name || !formData.manager) return;

    if (editingId) {
      setDepartments(prev => prev.map(d => 
        d.id === editingId 
          ? { ...d, name: formData.name, description: formData.description, manager: formData.manager }
          : d
      ));
    } else {
      setDepartments(prev => [...prev, {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        manager: formData.manager,
        headCount: 0
      }]);
    }

    setFormData({ name: "", description: "", manager: "" });
    setEditingId(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (dept: Department) => {
    setFormData({ name: dept.name, description: dept.description, manager: dept.manager });
    setEditingId(dept.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setDepartments(prev => prev.filter(d => d.id !== id));
  };

  const handleCloseDialog = () => {
    setFormData({ name: "", description: "", manager: "" });
    setEditingId(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Department Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage departments and organizational structure</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-department">
              <Plus className="h-4 w-4 mr-2" />
              Add Department
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Department" : "Add New Department"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Update the department details" : "Create a new department"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Department Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Engineering"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  data-testid="input-dept-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Department description and responsibilities"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  data-testid="textarea-dept-description"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manager">Department Manager</Label>
                <Input
                  id="manager"
                  placeholder="Manager name"
                  value={formData.manager}
                  onChange={(e) => setFormData(prev => ({ ...prev, manager: e.target.value }))}
                  data-testid="input-dept-manager"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCloseDialog} data-testid="button-cancel">
                Cancel
              </Button>
              <Button onClick={handleAddOrEdit} data-testid="button-save-department">
                {editingId ? "Update" : "Add"} Department
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.reduce((sum, d) => sum + d.headCount, 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Largest Department</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.max(...departments.map(d => d.headCount))}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Team Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(departments.reduce((sum, d) => sum + d.headCount, 0) / departments.length)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Departments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Employees</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((dept) => (
                <TableRow key={dept.id} data-testid={`dept-row-${dept.id}`}>
                  <TableCell className="font-medium">{dept.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{dept.description}</TableCell>
                  <TableCell>{dept.manager}</TableCell>
                  <TableCell>{dept.headCount}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(dept)}
                        data-testid={`button-edit-${dept.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(dept.id)}
                        data-testid={`button-delete-${dept.id}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
