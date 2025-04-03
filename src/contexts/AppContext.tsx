
import { createContext, useContext, useEffect, useState } from "react";
import { Client, Company, Project, ProjectStatus } from "@/types";

interface AppContextType {
  companies: Company[];
  addCompany: (company: Omit<Company, "id" | "clients" | "projects">) => void;
  updateCompany: (id: string, company: Partial<Company>) => void;
  deleteCompany: (id: string) => void;
  
  addClient: (client: Omit<Client, "id">) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  
  projects: Project[];
  addProject: (project: Omit<Project, "id">) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
}

export type AccentColor = "purple" | "blue" | "green" | "orange" | "pink" | "teal" | "amber" | "red" | "indigo";

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [companies, setCompanies] = useState<Company[]>(() => {
    const saved = localStorage.getItem("nexwork-companies");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem("nexwork-projects");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("nexwork-theme");
    return saved ? (saved as "light" | "dark") : "light";
  });
  
  const [accentColor, setAccentColor] = useState<AccentColor>(() => {
    const saved = localStorage.getItem("nexwork-accent-color");
    return saved ? (saved as AccentColor) : "purple";
  });

  useEffect(() => {
    localStorage.setItem("nexwork-companies", JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem("nexwork-projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("nexwork-theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("nexwork-accent-color", accentColor);
    document.documentElement.className = document.documentElement.className
      .replace(/theme-\w+/g, '')
      .trim();
    document.documentElement.classList.add(`theme-${accentColor}`);
  }, [accentColor]);

  // Companies CRUD
  const addCompany = (company: Omit<Company, "id" | "clients" | "projects">) => {
    const newCompany: Company = {
      id: crypto.randomUUID(),
      ...company,
      clients: [],
      projects: []
    };
    setCompanies((prev) => [...prev, newCompany]);
  };

  const updateCompany = (id: string, company: Partial<Company>) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...company } : c))
    );
  };

  const deleteCompany = (id: string) => {
    setCompanies((prev) => prev.filter((c) => c.id !== id));
    // Also remove all associated projects
    setProjects((prev) => prev.filter((p) => p.companyId !== id));
  };

  // Clients CRUD
  const addClient = (client: Omit<Client, "id">) => {
    const newClient: Client = {
      id: crypto.randomUUID(),
      ...client
    };
    
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === client.companyId
          ? { ...c, clients: [...c.clients, newClient] }
          : c
      )
    );
  };

  const updateClient = (id: string, clientData: Partial<Client>) => {
    setCompanies((prev) =>
      prev.map((c) => ({
        ...c,
        clients: c.clients.map((client) =>
          client.id === id ? { ...client, ...clientData } : client
        )
      }))
    );
  };

  const deleteClient = (id: string) => {
    setCompanies((prev) =>
      prev.map((c) => ({
        ...c,
        clients: c.clients.filter((client) => client.id !== id)
      }))
    );
    
    // Also update projects with this client to set clientId to empty
    setProjects((prev) =>
      prev.map((p) => (p.clientId === id ? { ...p, clientId: "" } : p))
    );
  };

  // Projects CRUD
  const addProject = (project: Omit<Project, "id">) => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      ...project
    };
    setProjects((prev) => [...prev, newProject]);
  };

  const updateProject = (id: string, project: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...project } : p))
    );
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        companies,
        addCompany,
        updateCompany,
        deleteCompany,
        addClient,
        updateClient,
        deleteClient,
        projects,
        addProject,
        updateProject,
        deleteProject,
        theme,
        setTheme,
        accentColor,
        setAccentColor
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
