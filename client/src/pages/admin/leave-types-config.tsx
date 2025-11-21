import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

//todo: remove mock functionality
const mockLeaveTypes = [
  { id: "1", name: "Annual Leave", daysAllowed: 20 },
  { id: "2", name: "Sick Leave", daysAllowed: 10 },
  { id: "3", name: "Casual Leave", daysAllowed: 7 },
  { id: "4", name: "Maternity Leave", daysAllowed: 90 },
  { id: "5", name: "Paternity Leave", daysAllowed: 14 },
];

export default function LeaveTypesConfig() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<any>(null);

  const handleEdit = (type: any) => {
    setEditingType(type);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingType(null);
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    console.log("Leave type saved:", editingType);
    setIsDialogOpen(false);
    setEditingType(null);
  };

  const handleDelete = (typeId: string) => {
    console.log("Delete leave type:", typeId);
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
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Leave Type Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Annual Leave"
                  defaultValue={editingType?.name}
                  data-testid="input-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="daysAllowed">Days Allowed (Per Year)</Label>
                <Input
                  id="daysAllowed"
                  type="number"
                  min="1"
                  placeholder="20"
                  defaultValue={editingType?.daysAllowed}
                  data-testid="input-days-allowed"
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
                {editingType ? "Save Changes" : "Create Leave Type"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Leave Types</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Leave Type</TableHead>
                <TableHead>Days Allowed (Annually)</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLeaveTypes.map((type) => (
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
        </CardContent>
      </Card>
    </div>
  );
}
