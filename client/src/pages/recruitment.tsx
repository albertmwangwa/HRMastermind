import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { Plus, Briefcase, Users } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
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

//todo: remove mock functionality
const jobPostings = [
  { id: 1, title: "Senior Software Engineer", department: "Engineering", location: "Remote", type: "Full-time", applicants: 24, status: "active" as const },
  { id: 2, title: "Product Manager", department: "Product", location: "New York", type: "Full-time", applicants: 18, status: "active" as const },
  { id: 3, title: "UX Designer", department: "Design", location: "San Francisco", type: "Full-time", applicants: 12, status: "active" as const },
];

//todo: remove mock functionality
const candidates = [
  { id: 1, name: "Alex Thompson", position: "Senior Software Engineer", stage: "Technical Interview", score: 85, email: "alex.t@email.com", phone: "+1 234 567 8901" },
  { id: 2, name: "Jamie Roberts", position: "Product Manager", stage: "Final Interview", score: 92, email: "jamie.r@email.com", phone: "+1 234 567 8902" },
  { id: 3, name: "Taylor Kim", position: "UX Designer", stage: "Portfolio Review", score: 78, email: "taylor.k@email.com", phone: "+1 234 567 8903" },
  { id: 4, name: "Jordan Lee", position: "Senior Software Engineer", stage: "Phone Screening", score: 70, email: "jordan.l@email.com", phone: "+1 234 567 8904" },
];

export default function Recruitment() {
  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false);
  const [, navigate] = useLocation();

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Recruitment</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage job postings and track candidates</p>
        </div>
        <Dialog open={isJobDialogOpen} onOpenChange={setIsJobDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-post-job">
              <Plus className="h-4 w-4 mr-2" />
              Post New Job
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create Job Posting</DialogTitle>
              <DialogDescription>Enter details for the new job opening</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input id="jobTitle" placeholder="e.g., Senior Software Engineer" data-testid="input-job-title" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select>
                    <SelectTrigger data-testid="select-department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobType">Job Type</Label>
                  <Select>
                    <SelectTrigger data-testid="select-job-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fulltime">Full-time</SelectItem>
                      <SelectItem value="parttime">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="e.g., Remote, New York, etc." data-testid="input-location" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Job description and requirements" rows={4} data-testid="textarea-description" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsJobDialogOpen(false)} data-testid="button-cancel">
                Cancel
              </Button>
              <Button onClick={() => {
                console.log("Job posting created");
                setIsJobDialogOpen(false);
              }} data-testid="button-publish-job">
                Publish Job
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="jobs" className="space-y-6">
        <TabsList>
          <TabsTrigger value="jobs" data-testid="tab-jobs">
            <Briefcase className="h-4 w-4 mr-2" />
            Job Postings
          </TabsTrigger>
          <TabsTrigger value="candidates" data-testid="tab-candidates">
            <Users className="h-4 w-4 mr-2" />
            Candidates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jobs">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobPostings.map((job) => (
              <Card key={job.id} className="hover-elevate" data-testid={`job-posting-${job.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base font-semibold">{job.title}</CardTitle>
                    <StatusBadge status={job.status} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Department</span>
                      <span className="font-medium">{job.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location</span>
                      <span className="font-medium">{job.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type</span>
                      <span className="font-medium">{job.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Applicants</span>
                      <span className="font-bold text-primary">{job.applicants}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1" 
                      onClick={() => navigate(`/recruitment/job/${job.id}`)}
                      data-testid={`button-view-${job.id}`}
                    >
                      View Details
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1" 
                      onClick={() => navigate(`/recruitment/job/${job.id}`)}
                      data-testid={`button-edit-${job.id}`}
                    >
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="candidates">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Candidate Pipeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {candidates.map((candidate) => (
                <Card key={candidate.id} className="hover-elevate" data-testid={`candidate-${candidate.id}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{candidate.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{candidate.position}</p>
                        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                          <span>{candidate.email}</span>
                          <span>{candidate.phone}</span>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Stage</p>
                          <p className="text-sm font-medium">{candidate.stage}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Score</p>
                          <p className="text-lg font-bold text-primary">{candidate.score}/100</p>
                        </div>
                      </div>
                      <div className="ml-4">
                        <Button size="sm" variant="outline" data-testid={`button-evaluate-${candidate.id}`}>
                          Evaluate
                        </Button>
                      </div>
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
