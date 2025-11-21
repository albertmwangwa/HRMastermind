import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { Plus, Target, TrendingUp, Award } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Progress } from "@/components/ui/progress";

//todo: remove mock functionality
const goals = [
  { id: 1, employee: "John Smith", title: "Complete React Migration", progress: 75, deadline: "2024-04-30", status: "active" as const },
  { id: 2, employee: "Sarah Johnson", title: "Hire 5 New Developers", progress: 60, deadline: "2024-05-15", status: "active" as const },
  { id: 3, employee: "Mike Chen", title: "Launch Mobile App", progress: 90, deadline: "2024-04-15", status: "active" as const },
];

//todo: remove mock functionality
const appraisals = [
  { id: 1, employee: "Emily Davis", period: "Q1 2024", rating: 4.5, reviewer: "Sarah Johnson", date: "2024-03-30", status: "approved" as const },
  { id: 2, employee: "David Wilson", period: "Q1 2024", rating: 3.8, reviewer: "John Smith", date: "2024-03-28", status: "approved" as const },
  { id: 3, employee: "Lisa Anderson", period: "Q1 2024", rating: 4.2, reviewer: "Sarah Johnson", date: "2024-03-25", status: "pending" as const },
];

//todo: remove mock functionality
const feedback = [
  { id: 1, from: "John Smith", to: "Mike Chen", type: "Peer Review", comment: "Great collaboration on the project", date: "2024-03-20" },
  { id: 2, from: "Sarah Johnson", to: "Emily Davis", type: "Manager Feedback", comment: "Excellent leadership skills demonstrated", date: "2024-03-18" },
];

export default function Performance() {
  const [activeTab, setActiveTab] = useState("goals");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setIsDialogOpen(false);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Performance Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Track goals, conduct appraisals, and manage feedback</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-goal">
              <Plus className="h-4 w-4 mr-2" />
              {activeTab === "goals" ? "Create Goal" : activeTab === "appraisals" ? "New Appraisal" : "Give Feedback"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {activeTab === "goals" ? "Create Performance Goal" : activeTab === "appraisals" ? "Conduct Performance Appraisal" : "Provide Feedback"}
              </DialogTitle>
              <DialogDescription>
                {activeTab === "goals" ? "Set a new performance goal or KRA" : activeTab === "appraisals" ? "Complete performance review" : "Share feedback with a team member"}
              </DialogDescription>
            </DialogHeader>
            {activeTab === "goals" && (
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="goalEmployee">Employee</Label>
                  <Select>
                    <SelectTrigger data-testid="select-goal-employee">
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emp1">John Smith</SelectItem>
                      <SelectItem value="emp2">Sarah Johnson</SelectItem>
                      <SelectItem value="emp3">Mike Chen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goalTitle">Goal Title</Label>
                  <Input id="goalTitle" placeholder="e.g., Complete React Migration" data-testid="input-goal-title" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goalDescription">Description</Label>
                  <Textarea id="goalDescription" placeholder="Describe the goal and success criteria" rows={3} data-testid="textarea-goal-description" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="goalDeadline">Deadline</Label>
                    <Input id="goalDeadline" type="date" data-testid="input-goal-deadline" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="goalPriority">Priority</Label>
                    <Select>
                      <SelectTrigger data-testid="select-goal-priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "appraisals" && (
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="appraisalEmployee">Employee</Label>
                  <Select>
                    <SelectTrigger data-testid="select-appraisal-employee">
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emp1">John Smith</SelectItem>
                      <SelectItem value="emp2">Sarah Johnson</SelectItem>
                      <SelectItem value="emp3">Mike Chen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appraisalPeriod">Review Period</Label>
                  <Select>
                    <SelectTrigger data-testid="select-appraisal-period">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="q1-2024">Q1 2024</SelectItem>
                      <SelectItem value="q2-2024">Q2 2024</SelectItem>
                      <SelectItem value="q3-2024">Q3 2024</SelectItem>
                      <SelectItem value="q4-2024">Q4 2024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appraisalRating">Overall Rating (1-5)</Label>
                  <Input id="appraisalRating" type="number" min="1" max="5" step="0.1" placeholder="4.5" data-testid="input-appraisal-rating" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appraisalStrengths">Strengths</Label>
                  <Textarea id="appraisalStrengths" placeholder="Key strengths and accomplishments" rows={3} data-testid="textarea-appraisal-strengths" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appraisalAreas">Areas for Improvement</Label>
                  <Textarea id="appraisalAreas" placeholder="Development areas and action items" rows={3} data-testid="textarea-appraisal-areas" />
                </div>
              </div>
            )}
            {activeTab === "feedback" && (
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="feedbackTo">To</Label>
                  <Select>
                    <SelectTrigger data-testid="select-feedback-to">
                      <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emp1">John Smith</SelectItem>
                      <SelectItem value="emp2">Sarah Johnson</SelectItem>
                      <SelectItem value="emp3">Mike Chen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="feedbackType">Feedback Type</Label>
                  <Select>
                    <SelectTrigger data-testid="select-feedback-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="peer">Peer Review</SelectItem>
                      <SelectItem value="manager">Manager Feedback</SelectItem>
                      <SelectItem value="recognition">Recognition</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="feedbackComment">Feedback</Label>
                  <Textarea id="feedbackComment" placeholder="Share your feedback..." rows={4} data-testid="textarea-feedback-comment" />
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} data-testid="button-cancel">
                Cancel
              </Button>
              <Button onClick={() => {
                console.log(`${activeTab} submitted`);
                setIsDialogOpen(false);
              }} data-testid="button-submit">
                Submit
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList>
          <TabsTrigger value="goals" data-testid="tab-goals">
            <Target className="h-4 w-4 mr-2" />
            Goals & KRAs
          </TabsTrigger>
          <TabsTrigger value="appraisals" data-testid="tab-appraisals">
            <Award className="h-4 w-4 mr-2" />
            Appraisals
          </TabsTrigger>
          <TabsTrigger value="feedback" data-testid="tab-feedback">
            <TrendingUp className="h-4 w-4 mr-2" />
            Feedback
          </TabsTrigger>
        </TabsList>

        <TabsContent value="goals">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Active Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {goals.map((goal) => (
                <Card key={goal.id} className="hover-elevate" data-testid={`goal-${goal.id}`}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-sm">{goal.title}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{goal.employee}</p>
                        </div>
                        <StatusBadge status={goal.status} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Deadline: {goal.deadline}</span>
                        <Button size="sm" variant="outline" data-testid={`button-update-${goal.id}`}>
                          Update Progress
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appraisals">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Appraisals</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Reviewer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appraisals.map((appraisal) => (
                    <TableRow key={appraisal.id} data-testid={`appraisal-${appraisal.id}`}>
                      <TableCell className="font-medium">{appraisal.employee}</TableCell>
                      <TableCell>{appraisal.period}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Award className="h-4 w-4 text-yellow-500" />
                          <span className="font-semibold">{appraisal.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>{appraisal.reviewer}</TableCell>
                      <TableCell>{appraisal.date}</TableCell>
                      <TableCell>
                        <StatusBadge status={appraisal.status} />
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" data-testid={`button-view-${appraisal.id}`}>
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Feedback History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {feedback.map((item) => (
                <Card key={item.id} className="hover-elevate" data-testid={`feedback-${item.id}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-semibold">{item.from}</span>
                          <span className="text-xs text-muted-foreground">→</span>
                          <span className="text-sm font-medium">{item.to}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{item.type}</p>
                        <p className="text-sm">{item.comment}</p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{item.date}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
