
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ProjectStatus } from "@/types";

interface StatusBadgeProps {
  status: ProjectStatus;
  onClick?: () => void;
  className?: string;
}

const statusConfig: Record<ProjectStatus, { label: string; className: string }> = {
  not_started: {
    label: "Not Started",
    className: "bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
  },
  in_progress: {
    label: "In Progress",
    className: "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
  },
  completed: {
    label: "Completed",
    className: "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800"
  },
  on_hold: {
    label: "On Hold",
    className: "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-200 dark:hover:bg-amber-800"
  }
};

export function StatusBadge({ status, onClick, className }: StatusBadgeProps) {
  const { label, className: statusClassName } = statusConfig[status];
  
  return (
    <Badge 
      className={cn(
        "cursor-pointer transition-colors",
        statusClassName,
        className
      )}
      variant="outline"
      onClick={onClick}
    >
      {label}
    </Badge>
  );
}
