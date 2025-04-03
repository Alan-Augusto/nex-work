
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Project } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
}

export function parseHourString(hourString: string): number {
  const [hours, minutes = 0] = hourString.split(':').map(Number);
  return hours + minutes / 60;
}

export function formatHourString(decimalHours: number): string {
  const hours = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours - hours) * 60);
  return `${hours}:${minutes.toString().padStart(2, '0')}`;
}

export function getCurrentMonthProjects(projects: Project[]): Project[] {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  return projects.filter(project => {
    const projectStart = new Date(project.startDate);
    const projectEnd = project.endDate ? new Date(project.endDate) : null;
    
    // Project starts this month
    if (projectStart >= startOfMonth && projectStart <= endOfMonth) return true;
    
    // Project ends this month
    if (projectEnd && projectEnd >= startOfMonth && projectEnd <= endOfMonth) return true;
    
    // Project spans this month
    if (projectStart <= startOfMonth && (!projectEnd || projectEnd >= endOfMonth)) return true;
    
    return false;
  });
}

export function calculateProjectValue(project: Project): number {
  const hours = parseHourString(project.estimatedHours);
  return hours * project.hourlyRate;
}

export function calculateTotalProjectsValue(projects: Project[]): number {
  return projects.reduce((total, project) => total + calculateProjectValue(project), 0);
}

export function getProjectProgress(project: Project): number {
  switch (project.status) {
    case 'not_started':
      return 0;
    case 'completed':
      return 100;
    case 'in_progress': {
      // Calculate progress based on dates
      if (!project.endDate) return 50; // Default to 50% if no end date
      
      const start = new Date(project.startDate).getTime();
      const end = new Date(project.endDate).getTime();
      const now = new Date().getTime();
      
      if (now >= end) return 100;
      if (now <= start) return 0;
      
      const total = end - start;
      const elapsed = now - start;
      return Math.round((elapsed / total) * 100);
    }
    case 'on_hold':
      return project.endDate ? getProjectProgress({ ...project, status: 'in_progress' }) : 0;
    default:
      return 0;
  }
}

export function getProjectStatusLabel(status: string): string {
  const statusMap: Record<string, string> = {
    not_started: 'Não Iniciado',
    in_progress: 'Em Progresso',
    completed: 'Concluído',
    on_hold: 'Em Espera'
  };
  
  return statusMap[status] || status;
}
