import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { Plus, DollarSign, Receipt } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

//todo: remove mock functionality
const expenseSummary = [
  { category: "Travel", amount: "$12,450", claims: 8 },
  { category: "Meals", amount: "$3,200", claims: 15 },
  { category: "Accommodation", amount: "$8,900", claims: 6 },
];

//todo: remove mock functionality
const expenseClaims = [
  { id: 1, employee: "John Smith", category: "Travel", amount: "$450", date: "2024-03-25", description: "Client meeting in New York", status: "pending" as const },
  { id: 2, employee: "Sarah Johnson", category: "Meals", amount: "$120", date: "2024-03-24", description: "Team lunch", status: "approved" as const },
  { id: 3, employee: "Mike Chen", category: "Accommodation", amount: "$890", date: "2024-03-22", description: "Conference hotel stay", status: "pending" as const },
  { id: 4, employee: "Emily Davis", category: "Travel", amount: "$340", date: "2024-03-20", description: "Airport transfer", status: "approved" as const },
];

export default function Expenses() {
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Expense Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Track and manage employee expenses</p>
        </div>
        <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-submit-expense">
              <Plus className="h-4 w-4 mr-2" />
              Submit Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Submit Expense Claim</DialogTitle>
              <DialogDescription>Enter expense details for reimbursement</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger data-testid="select-expense-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="meals">Meals</SelectItem>
                    <SelectItem value="accommodation">Accommodation</SelectItem>
                    <SelectItem value="supplies">Office Supplies</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input id="amount" type="number" placeholder="0.00" data-testid="input-amount" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expenseDate">Date</Label>
                  <Input id="expenseDate" type="date" data-testid="input-expense-date" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Enter expense description" data-testid="textarea-description" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="receipt">Receipt (Optional)</Label>
                <Input id="receipt" type="file" accept="image/*,application/pdf" data-testid="input-receipt" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsSubmitDialogOpen(false)} data-testid="button-cancel">
                Cancel
              </Button>
              <Button onClick={() => {
                console.log("Expense claim submitted");
                setIsSubmitDialogOpen(false);
              }} data-testid="button-submit-claim">
                Submit Claim
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {expenseSummary.map((summary, idx) => (
          <Card key={idx} className="hover-elevate" data-testid={`expense-summary-${idx}`}>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Receipt className="h-4 w-4 text-primary" />
                {summary.category}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Amount</span>
                <span className="text-xl font-bold text-primary">{summary.amount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Claims</span>
                <span className="text-lg font-semibold">{summary.claims}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Expense Claims</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenseClaims.map((claim) => (
                <TableRow key={claim.id} data-testid={`expense-claim-${claim.id}`}>
                  <TableCell className="font-medium">{claim.employee}</TableCell>
                  <TableCell>{claim.category}</TableCell>
                  <TableCell className="font-semibold">{claim.amount}</TableCell>
                  <TableCell>{claim.date}</TableCell>
                  <TableCell className="max-w-xs truncate">{claim.description}</TableCell>
                  <TableCell>
                    <StatusBadge status={claim.status} />
                  </TableCell>
                  <TableCell>
                    {claim.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => console.log(`Approved claim ${claim.id}`)}
                          data-testid={`button-approve-${claim.id}`}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => console.log(`Rejected claim ${claim.id}`)}
                          data-testid={`button-reject-${claim.id}`}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
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
