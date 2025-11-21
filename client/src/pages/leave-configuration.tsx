import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, X } from "lucide-react";
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

interface LeaveType {
  id: string;
  name: string;
  daysAllowed: number;
  requiresApproval: boolean;
}

export default function LeaveConfiguration() {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([
    { id: "1", name: "Annual Leave", daysAllowed: 20, requiresApproval: true },
    { id: "2", name: "Sick Leave", daysAllowed: 12, requiresApproval: false },
    { id: "3", name: "Casual Leave", daysAllowed: 8, requiresApproval: true },
    { id: "4", name: "Maternity Leave", daysAllowed: 180, requiresApproval: true },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", daysAllowed: "", requiresApproval: true });

  const handleAddOrEdit = () => {
    if (!formData.name || !formData.daysAllowed) return;

    if (editingId) {
      setLeaveTypes(prev => prev.map(lt => 
        lt.id === editingId 
          ? { ...lt, name: formData.name, daysAllowed: parseInt(formData.daysAllowed), requiresApproval: formData.requiresApproval }
          : lt
      ));
    } else {
      setLeaveTypes(prev => [...prev, {
        id: Date.now().toString(),
        name: formData.name,
        daysAllowed: parseInt(formData.daysAllowed),
        requiresApproval: formData.requiresApproval
      }]);
    }

    setFormData({ name: "", daysAllowed: "", requiresApproval: true });
    setEditingId(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (type: LeaveType) => {
    setFormData({ name: type.name, daysAllowed: type.daysAllowed.toString(), requiresApproval: type.requiresApproval });
    setEditingId(type.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setLeaveTypes(prev => prev.filter(lt => lt.id !== id));
  };

  const handleCloseDialog = () => {
    setFormData({ name: "", daysAllowed: "", requiresApproval: true });
    setEditingId(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Leave Type Configuration</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage leave types and policies</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-leave-type">
              <Plus className="h-4 w-4 mr-2" />
              Add Leave Type
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Leave Type" : "Add New Leave Type"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Update the leave type details" : "Create a new leave type for your organization"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Leave Type Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Annual Leave"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  data-testid="input-leave-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="daysAllowed">Days Allowed Per Year</Label>
                <Input
                  id="daysAllowed"
                  type="number"
                  placeholder="20"
                  value={formData.daysAllowed}
                  onChange={(e) => setFormData(prev => ({ ...prev, daysAllowed: e.target.value }))}
                  data-testid="input-days-allowed"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="requiresApproval">Requires Manager Approval</Label>
                <input
                  id="requiresApproval"
                  type="checkbox"
                  checked={formData.requiresApproval}
                  onChange={(e) => setFormData(prev => ({ ...prev, requiresApproval: e.target.checked }))}
                  data-testid="checkbox-requires-approval"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCloseDialog} data-testid="button-cancel">
                Cancel
              </Button>
              <Button onClick={handleAddOrEdit} data-testid="button-save-leave-type">
                {editingId ? "Update" : "Add"} Leave Type
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Leave Types</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Leave Type</TableHead>
                <TableHead>Days Allowed</TableHead>
                <TableHead>Requires Approval</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveTypes.map((type) => (
                <TableRow key={type.id} data-testid={`leave-type-row-${type.id}`}>
                  <TableCell className="font-medium">{type.name}</TableCell>
                  <TableCell>{type.daysAllowed}</TableCell>
                  <TableCell>{type.requiresApproval ? "Yes" : "No"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(type)}
                        data-testid={`button-edit-${type.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(type.id)}
                        data-testid={`button-delete-${type.id}`}
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

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Holiday Calendar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Configure national and company-specific holidays. Employees cannot apply for leave on these days.
          </p>
          <Button variant="outline" data-testid="button-manage-holidays">
            Manage Holidays
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
