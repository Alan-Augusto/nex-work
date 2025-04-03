
export interface Company {
  id: string;
  name: string;
  logoUrl?: string;
  clients: Client[];
  projects: Project[];
}

export interface Client {
  id: string;
  name: string;
  companyId: string;
  email?: string;
  phone?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  companyId: string;
  clientId: string;
  hourlyRate: number;
  estimatedHours: string; // Format: "4:15" for 4 hours and 15 minutes
  startDate: string;
  endDate?: string;
  status: ProjectStatus;
  notes?: string;
}

export type ProjectStatus = 'not_started' | 'in_progress' | 'completed' | 'on_hold';
