import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { Plus, Target, TrendingUp, Award } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Performance Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Track goals, conduct appraisals, and manage feedback</p>
        </div>
        <Button data-testid="button-create-goal">
          <Plus className="h-4 w-4 mr-2" />
          {activeTab === "goals" ? "Create Goal" : activeTab === "appraisals" ? "New Appraisal" : "Give Feedback"}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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
