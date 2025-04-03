
import { ProjectStatus } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "./StatusBadge";
import { Check } from "lucide-react";

interface StatusMenuProps {
  status: ProjectStatus;
  onStatusChange: (status: ProjectStatus) => void;
  className?: string;
}

export function StatusMenu({ status, onStatusChange, className }: StatusMenuProps) {
  const statuses: ProjectStatus[] = ["not_started", "in_progress", "completed", "on_hold"];
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <StatusBadge status={status} className={className} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {statuses.map((statusOption) => (
          <DropdownMenuItem 
            key={statusOption} 
            onClick={() => onStatusChange(statusOption)}
            className="flex items-center gap-2"
          >
            {status === statusOption && <Check className="w-4 h-4" />}
            <span className={status === statusOption ? "font-medium" : ""}>
              {statusOption === "not_started" ? "Not Started" : 
               statusOption === "in_progress" ? "In Progress" : 
               statusOption === "completed" ? "Completed" : "On Hold"}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
