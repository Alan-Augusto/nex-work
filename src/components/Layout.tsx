
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SidebarNavigation } from "@/components/SidebarNavigation";

export const Layout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b flex items-center justify-between px-4 sm:px-6">
            <SidebarTrigger />
            <div className="flex items-center space-x-4">
              <ThemeSwitcher />
            </div>
          </header>
          
          <main className="flex-1 overflow-auto">
            <div className="container py-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader className="flex h-14 items-center border-b px-4">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <div className="h-6 w-6 rounded-md bg-accent"></div>
          <span>NexWork</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarNavigation />
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 text-xs text-muted-foreground">
          © {new Date().getFullYear()} NexWork
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default Layout;
