import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { Check, X, FileText } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ExpenseClaim {
  id: string;
  employee: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  status: "pending" | "approved" | "rejected";
}

export default function ExpenseApproval() {
  const [claims, setClaims] = useState<ExpenseClaim[]>([
    { id: "1", employee: "John Smith", category: "Travel", amount: 5000, date: "2024-03-28", description: "Flight tickets for client meeting", status: "pending" },
    { id: "2", employee: "Sarah Johnson", category: "Meals", amount: 1200, date: "2024-03-29", description: "Team lunch meeting", status: "pending" },
    { id: "3", employee: "Mike Chen", category: "Accommodation", amount: 8000, date: "2024-03-25", description: "Hotel stay for conference", status: "pending" },
  ]);

  const [selectedClaim, setSelectedClaim] = useState<ExpenseClaim | null>(null);
  const [approvalNotes, setApprovalNotes] = useState("");

  const handleApprove = (id: string) => {
    setClaims(prev => prev.map(c => c.id === id ? { ...c, status: "approved" as const } : c));
    setSelectedClaim(null);
    setApprovalNotes("");
  };

  const handleReject = (id: string) => {
    setClaims(prev => prev.map(c => c.id === id ? { ...c, status: "rejected" as const } : c));
    setSelectedClaim(null);
    setApprovalNotes("");
  };

  const pendingClaims = claims.filter(c => c.status === "pending");
  const totalPending = pendingClaims.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Expense Claim Approvals</h1>
        <p className="text-sm text-muted-foreground mt-1">Review and approve pending expense claims from your team</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Claims</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingClaims.length}</div>
            <p className="text-sm text-muted-foreground mt-1">₹{totalPending.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{claims.filter(c => c.status === "approved").length}</div>
            <p className="text-sm text-muted-foreground mt-1">₹{claims.filter(c => c.status === "approved").reduce((sum, c) => sum + c.amount, 0).toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{claims.filter(c => c.status === "rejected").length}</div>
            <p className="text-sm text-muted-foreground mt-1">₹{claims.filter(c => c.status === "rejected").reduce((sum, c) => sum + c.amount, 0).toLocaleString()}</p>
          </CardContent>
        </Card>
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
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {claims.map((claim) => (
                <TableRow key={claim.id} data-testid={`expense-claim-row-${claim.id}`}>
                  <TableCell className="font-medium">{claim.employee}</TableCell>
                  <TableCell>{claim.category}</TableCell>
                  <TableCell className="font-medium">₹{claim.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{claim.date}</TableCell>
                  <TableCell>
                    <StatusBadge status={claim.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedClaim(claim)}
                        data-testid={`button-view-${claim.id}`}
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      {claim.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApprove(claim.id)}
                            data-testid={`button-approve-${claim.id}`}
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(claim.id)}
                            data-testid={`button-reject-${claim.id}`}
                          >
                            <X className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedClaim && (
        <Dialog open={!!selectedClaim} onOpenChange={() => { setSelectedClaim(null); setApprovalNotes(""); }}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Expense Claim Details</DialogTitle>
              <DialogDescription>Review and approve/reject the expense claim</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Employee</p>
                  <p className="text-sm text-muted-foreground">{selectedClaim.employee}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Category</p>
                  <p className="text-sm text-muted-foreground">{selectedClaim.category}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Amount</p>
                <p className="text-lg font-bold text-primary">₹{selectedClaim.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Description</p>
                <p className="text-sm text-muted-foreground">{selectedClaim.description}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Date</p>
                <p className="text-sm text-muted-foreground">{selectedClaim.date}</p>
              </div>
              {selectedClaim.status === "pending" && (
                <div className="space-y-2">
                  <Label htmlFor="approvalNotes">Approval Notes (Optional)</Label>
                  <Textarea
                    id="approvalNotes"
                    placeholder="Add notes for the employee..."
                    value={approvalNotes}
                    onChange={(e) => setApprovalNotes(e.target.value)}
                    data-testid="textarea-approval-notes"
                    rows={3}
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => { setSelectedClaim(null); setApprovalNotes(""); }}
                data-testid="button-cancel"
              >
                Close
              </Button>
              {selectedClaim.status === "pending" && (
                <>
                  <Button
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => handleReject(selectedClaim.id)}
                    data-testid="button-reject-confirm"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleApprove(selectedClaim.id)}
                    data-testid="button-approve-confirm"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
