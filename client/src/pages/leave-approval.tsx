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
import { Check, X, Calendar } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface LeaveRequest {
  id: string;
  employee: string;
  type: string;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
}

export default function LeaveApproval() {
  const [requests, setRequests] = useState<LeaveRequest[]>([
    { id: "1", employee: "John Smith", type: "Annual Leave", fromDate: "2024-04-01", toDate: "2024-04-05", days: 5, reason: "Family vacation", status: "pending" },
    { id: "2", employee: "Sarah Johnson", type: "Sick Leave", fromDate: "2024-03-28", toDate: "2024-03-29", days: 2, reason: "Medical appointment", status: "pending" },
    { id: "3", employee: "Mike Chen", type: "Casual Leave", fromDate: "2024-04-10", toDate: "2024-04-10", days: 1, reason: "Personal work", status: "pending" },
  ]);

  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [approvalNotes, setApprovalNotes] = useState("");

  const handleApprove = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "approved" as const } : r));
    setSelectedRequest(null);
    setApprovalNotes("");
  };

  const handleReject = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "rejected" as const } : r));
    setSelectedRequest(null);
    setApprovalNotes("");
  };

  const pendingRequests = requests.filter(r => r.status === "pending");

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Leave Request Approvals</h1>
        <p className="text-sm text-muted-foreground mt-1">Review and approve pending leave requests from your team</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requests.filter(r => r.status === "approved").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requests.filter(r => r.status === "rejected").length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Leave Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id} data-testid={`leave-request-row-${request.id}`}>
                  <TableCell className="font-medium">{request.employee}</TableCell>
                  <TableCell>{request.type}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {request.fromDate} to {request.toDate}
                    </div>
                  </TableCell>
                  <TableCell>{request.days}</TableCell>
                  <TableCell>
                    <StatusBadge status={request.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedRequest(request)}
                        data-testid={`button-view-${request.id}`}
                      >
                        View Details
                      </Button>
                      {request.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApprove(request.id)}
                            data-testid={`button-approve-${request.id}`}
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(request.id)}
                            data-testid={`button-reject-${request.id}`}
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

      {selectedRequest && (
        <Dialog open={!!selectedRequest} onOpenChange={() => { setSelectedRequest(null); setApprovalNotes(""); }}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Leave Request Details</DialogTitle>
              <DialogDescription>Review and approve/reject the leave request</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Employee</p>
                  <p className="text-sm text-muted-foreground">{selectedRequest.employee}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Leave Type</p>
                  <p className="text-sm text-muted-foreground">{selectedRequest.type}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">From Date</p>
                  <p className="text-sm text-muted-foreground">{selectedRequest.fromDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">To Date</p>
                  <p className="text-sm text-muted-foreground">{selectedRequest.toDate}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Reason</p>
                <p className="text-sm text-muted-foreground">{selectedRequest.reason}</p>
              </div>
              {selectedRequest.status === "pending" && (
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
                onClick={() => { setSelectedRequest(null); setApprovalNotes(""); }}
                data-testid="button-cancel"
              >
                Close
              </Button>
              {selectedRequest.status === "pending" && (
                <>
                  <Button
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => handleReject(selectedRequest.id)}
                    data-testid="button-reject-confirm"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleApprove(selectedRequest.id)}
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
