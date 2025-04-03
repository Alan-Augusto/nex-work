
import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency, formatHourString, parseHourString } from "@/lib/utils";
import { Client, Project, ProjectStatus } from "@/types";
import { Calendar, CircleDollarSign, Clock, Edit, LayoutGrid, List, Plus, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusMenu } from "@/components/StatusMenu";
import { StatusBadge } from "@/components/StatusBadge";

const Projects = () => {
  const { companies, projects, addProject, updateProject, deleteProject } = useApp();
  const [newProject, setNewProject] = useState<Omit<Project, "id">>({
    name: "",
    description: "",
    companyId: "",
    clientId: "",
    hourlyRate: 0,
    estimatedHours: "0:00",
    startDate: new Date().toISOString().split("T")[0],
    status: "not_started",
  });
  
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [selectedCompanyClients, setSelectedCompanyClients] = useState<Client[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleAddProject = () => {
    if (newProject.name.trim() && newProject.companyId && newProject.estimatedHours && newProject.hourlyRate > 0) {
      addProject({
        ...newProject,
        name: newProject.name.trim(),
        description: newProject.description.trim(),
        notes: newProject.notes?.trim(),
      });
      setNewProject({
        name: "",
        description: "",
        companyId: "",
        clientId: "",
        hourlyRate: 0,
        estimatedHours: "0:00",
        startDate: new Date().toISOString().split("T")[0],
        status: "not_started",
      });
      setIsAddOpen(false);
    }
  };

  const handleEditProject = () => {
    if (editProject && editProject.name.trim() && editProject.companyId && editProject.estimatedHours && editProject.hourlyRate > 0) {
      updateProject(editProject.id, {
        ...editProject,
        name: editProject.name.trim(),
        description: editProject.description.trim(),
        notes: editProject.notes?.trim(),
      });
      setEditProject(null);
      setIsEditOpen(false);
    }
  };

  const handleDeleteProject = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete);
      setProjectToDelete(null);
      setIsDeleteOpen(false);
    }
  };

  const handleCompanyChange = (companyId: string, isEdit: boolean = false) => {
    const company = companies.find((c) => c.id === companyId);
    if (company) {
      setSelectedCompanyClients(company.clients);
      if (isEdit) {
        setEditProject(prev => prev ? { ...prev, companyId, clientId: "" } : null);
      } else {
        setNewProject(prev => ({ ...prev, companyId, clientId: "" }));
      }
    } else {
      setSelectedCompanyClients([]);
    }
  };

  const handleStatusChange = (projectId: string, newStatus: ProjectStatus) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    // If status is changing to completed, set the end date to today
    const updates: Partial<Project> = { status: newStatus };
    if (newStatus === "completed" && project.status !== "completed") {
      updates.endDate = new Date().toISOString().split("T")[0];
    }
    
    updateProject(projectId, updates);
  };

  const openEditDialog = (project: Project) => {
    setEditProject(project);
    handleCompanyChange(project.companyId, true);
    setIsEditOpen(true);
  };

  const openDeleteDialog = (id: string) => {
    setProjectToDelete(id);
    setIsDeleteOpen(true);
  };

  const handleEstimatedHoursChange = (value: string, isEdit: boolean = false) => {
    // Format input to maintain HH:MM format
    let formattedValue = value.replace(/[^0-9:]/g, "");
    const parts = formattedValue.split(":");
    
    if (parts.length > 2) {
      formattedValue = `${parts[0]}:${parts[1]}`;
    } else if (parts.length === 2 && parts[1].length > 2) {
      formattedValue = `${parts[0]}:${parts[1].substring(0, 2)}`;
    } else if (parts.length === 1 && formattedValue.length > 0) {
      formattedValue = `${parts[0]}`;
      if (formattedValue.includes(":")) {
        formattedValue = `${parts[0].replace(":", "")}:`;
      }
    }

    if (isEdit) {
      setEditProject(prev => prev ? { ...prev, estimatedHours: formattedValue } : null);
    } else {
      setNewProject(prev => ({ ...prev, estimatedHours: formattedValue }));
    }
  };

  const filteredProjects = projects.filter(project => {
    if (activeTab === "all") return true;
    return project.status === activeTab;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage your projects and track their progress
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border rounded-md overflow-hidden">
            <Button 
              variant={viewMode === "grid" ? "default" : "ghost"} 
              size="sm"
              className="rounded-none h-8 px-2" 
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="sr-only">Grid view</span>
            </Button>
            <Button 
              variant={viewMode === "list" ? "default" : "ghost"} 
              size="sm" 
              className="rounded-none h-8 px-2"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
              <span className="sr-only">List view</span>
            </Button>
          </div>

          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="flex items-center gap-1"
                disabled={companies.length === 0}
              >
                <Plus className="h-4 w-4" />
                <span>Add</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add Project</DialogTitle>
                <DialogDescription>
                  Fill in the details for the new project
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="company">Company</Label>
                    <Select
                      value={newProject.companyId}
                      onValueChange={(value) => handleCompanyChange(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a company" />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.map((company) => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="client">Client</Label>
                    <Select
                      value={newProject.clientId}
                      onValueChange={(value) =>
                        setNewProject({ ...newProject, clientId: value })
                      }
                      disabled={selectedCompanyClients.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedCompanyClients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Project Name</Label>
                  <Input
                    id="name"
                    placeholder="Project name"
                    value={newProject.name}
                    onChange={(e) =>
                      setNewProject({ ...newProject, name: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Project description"
                    value={newProject.description}
                    onChange={(e) =>
                      setNewProject({ ...newProject, description: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="hourlyRate">Hourly Rate</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="hourlyRate"
                        type="number"
                        min="0"
                        step="1"
                        className="pl-8"
                        placeholder="100"
                        value={newProject.hourlyRate || ""}
                        onChange={(e) =>
                          setNewProject({
                            ...newProject,
                            hourlyRate: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="estimatedHours">Estimated Hours</Label>
                    <Input
                      id="estimatedHours"
                      placeholder="4:30"
                      value={newProject.estimatedHours}
                      onChange={(e) => handleEstimatedHoursChange(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={newProject.status}
                      onValueChange={(value) =>
                        setNewProject({
                          ...newProject,
                          status: value as ProjectStatus,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Project status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="not_started">Not Started</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="on_hold">On Hold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={newProject.startDate}
                      onChange={(e) =>
                        setNewProject({ ...newProject, startDate: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endDate">End Date (optional)</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={newProject.endDate || ""}
                      onChange={(e) =>
                        setNewProject({ ...newProject, endDate: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional notes"
                    value={newProject.notes || ""}
                    onChange={(e) =>
                      setNewProject({ ...newProject, notes: e.target.value })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddProject}>Add</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Edit Project Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update the project information
            </DialogDescription>
          </DialogHeader>
          {editProject && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-company">Company</Label>
                  <Select
                    value={editProject.companyId}
                    onValueChange={(value) => handleCompanyChange(value, true)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-client">Client</Label>
                  <Select
                    value={editProject.clientId}
                    onValueChange={(value) =>
                      setEditProject({ ...editProject, clientId: value })
                    }
                    disabled={selectedCompanyClients.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedCompanyClients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Project Name</Label>
                <Input
                  id="edit-name"
                  placeholder="Project name"
                  value={editProject.name}
                  onChange={(e) =>
                    setEditProject({ ...editProject, name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Project description"
                  value={editProject.description}
                  onChange={(e) =>
                    setEditProject({
                      ...editProject,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-hourlyRate">Hourly Rate</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="edit-hourlyRate"
                      type="number"
                      min="0"
                      step="1"
                      className="pl-8"
                      placeholder="100"
                      value={editProject.hourlyRate || ""}
                      onChange={(e) =>
                        setEditProject({
                          ...editProject,
                          hourlyRate: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-estimatedHours">Estimated Hours</Label>
                  <Input
                    id="edit-estimatedHours"
                    placeholder="4:30"
                    value={editProject.estimatedHours}
                    onChange={(e) => handleEstimatedHoursChange(e.target.value, true)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={editProject.status}
                    onValueChange={(value) => {
                      const newStatus = value as ProjectStatus;
                      const updates: Partial<Project> = { status: newStatus };
                      
                      // If status is changing to completed, set the end date to today
                      if (newStatus === "completed" && editProject.status !== "completed") {
                        updates.endDate = new Date().toISOString().split("T")[0];
                      }
                      
                      setEditProject({...editProject, ...updates});
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Project status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not_started">Not Started</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="on_hold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-startDate">Start Date</Label>
                  <Input
                    id="edit-startDate"
                    type="date"
                    value={editProject.startDate}
                    onChange={(e) =>
                      setEditProject({
                        ...editProject,
                        startDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-endDate">End Date (optional)</Label>
                  <Input
                    id="edit-endDate"
                    type="date"
                    value={editProject.endDate || ""}
                    onChange={(e) =>
                      setEditProject({
                        ...editProject,
                        endDate: e.target.value || undefined,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-notes">Notes (optional)</Label>
                <Textarea
                  id="edit-notes"
                  placeholder="Additional notes"
                  value={editProject.notes || ""}
                  onChange={(e) =>
                    setEditProject({
                      ...editProject,
                      notes: e.target.value || undefined,
                    })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditProject}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Project Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProject}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {companies.length === 0 ? (
        <Card className="p-8 text-center">
          <LayoutGrid className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No companies registered</h3>
          <p className="text-muted-foreground mb-4">
            You need to register at least one company before adding projects.
          </p>
          <Button asChild>
            <a href="/companies">Register Company</a>
          </Button>
        </Card>
      ) : projects.length === 0 ? (
        <Card className="p-8 text-center">
          <LayoutGrid className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No projects registered</h3>
          <p className="text-muted-foreground mb-4">
            Add your first project to start managing them.
          </p>
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        </Card>
      ) : (
        <>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="not_started">Not Started</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="on_hold">On Hold</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {viewMode === "grid" ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => {
                const company = companies.find((c) => c.id === project.companyId);
                const client = company?.clients.find((c) => c.id === project.clientId);
                const totalValue = parseHourString(project.estimatedHours) * project.hourlyRate;
                
                return (
                  <Card key={project.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="font-semibold leading-none">{project.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {company?.name} - {client?.name || "Client not defined"}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEditDialog(project)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => openDeleteDialog(project.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-4">
                        <div>
                          <StatusMenu 
                            status={project.status} 
                            onStatusChange={(status) => handleStatusChange(project.id, status)} 
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{project.estimatedHours}h</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                            <span>{formatCurrency(project.hourlyRate)}/h</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {new Date(project.startDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <div className="font-medium">
                              {formatCurrency(totalValue)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <p className="text-xs text-muted-foreground">
                        {project.description.substring(0, 100)}
                        {project.description.length > 100 ? "..." : ""}
                      </p>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-medium text-muted-foreground">Project</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Client</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Hours</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Rate</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Total</th>
                    <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredProjects.map((project) => {
                    const company = companies.find((c) => c.id === project.companyId);
                    const client = company?.clients.find((c) => c.id === project.clientId);
                    const totalValue = parseHourString(project.estimatedHours) * project.hourlyRate;
                    
                    return (
                      <tr key={project.id} className="hover:bg-muted/50">
                        <td className="p-3">
                          <div className="font-medium">{project.name}</div>
                          <div className="text-xs text-muted-foreground">{company?.name}</div>
                        </td>
                        <td className="p-3">{client?.name || "Not defined"}</td>
                        <td className="p-3">
                          <StatusMenu 
                            status={project.status} 
                            onStatusChange={(status) => handleStatusChange(project.id, status)} 
                          />
                        </td>
                        <td className="p-3">{project.estimatedHours}</td>
                        <td className="p-3">{formatCurrency(project.hourlyRate)}</td>
                        <td className="p-3 font-medium">{formatCurrency(totalValue)}</td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => openEditDialog(project)}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => openDeleteDialog(project.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Projects;
