
import { Link, useLocation } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Building2,
  LayoutGrid,
  Users,
} from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useApp } from "@/contexts/AppContext";

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: BarChart3,
  },
  {
    title: "Companies",
    href: "/companies",
    icon: Building2,
  },
  {
    title: "Projects",
    href: "/projects",
    icon: LayoutGrid,
  },
  {
    title: "Clients",
    href: "/clients",
    icon: Users,
  },
];

export function SidebarNavigation() {
  const location = useLocation();
  const { accentColor } = useApp();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton 
                asChild 
                isActive={location.pathname === item.href}
                className={location.pathname === item.href ? `text-${accentColor} hover:text-${accentColor}` : ""}
              >
                <Link to={item.href} className="flex items-center gap-2">
                  <item.icon className={`h-4 w-4 ${location.pathname === item.href ? `text-${accentColor}` : ""}`} />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
