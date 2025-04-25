import { createContext, useContext, useEffect, useState } from "react";
import { Client, Company, Project, ProjectStatus } from "@/types";
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    onSnapshot,
    getDoc 
} from "firebase/firestore";
import { db } from "./firebase"; // Importa o Firestore inicializado

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
    const [companies, setCompanies] = useState<Company[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const [accentColor, setAccentColor] = useState<AccentColor>("purple");

    // Fetch companies from Firestore
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "companies"), (snapshot) => {
            const companiesData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Company[];
            setCompanies(companiesData);
        });

        return () => unsubscribe();
    }, []);

    // Fetch projects from Firestore
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "projects"), (snapshot) => {
            const projectsData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Project[];
            setProjects(projectsData);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);

    useEffect(() => {
        document.documentElement.className = document.documentElement.className
            .replace(/theme-\w+/g, '')
            .trim();
        document.documentElement.classList.add(`theme-${accentColor}`);
    }, [accentColor]);

    // Companies CRUD
    const addCompany = async (company: Omit<Company, "id" | "clients" | "projects">) => {
        await addDoc(collection(db, "companies"), {
            ...company,
            clients: [],
            projects: []
        });
    };

    const updateCompany = async (id: string, company: Partial<Company>) => {
        const companyRef = doc(db, "companies", id);
        await updateDoc(companyRef, company);
    };

    const deleteCompany = async (id: string) => {
        const companyRef = doc(db, "companies", id);
        await deleteDoc(companyRef);

        // Also delete associated projects
        const projectSnapshots = await getDocs(collection(db, "projects"));
        projectSnapshots.forEach(async (projectDoc) => {
            if (projectDoc.data().companyId === id) {
                await deleteDoc(doc(db, "projects", projectDoc.id));
            }
        });
    };

    // Clients CRUD
    const addClient = async (client: Omit<Client, "id">) => {
        const companyRef = doc(db, "companies", client.companyId);
        const companySnapshot = await getDoc(companyRef);
        const companyData = companySnapshot.data() as Company;

        await updateDoc(companyRef, {
            clients: [...companyData.clients, { id: crypto.randomUUID(), ...client }],
        });
    };

    const updateClient = async (id: string, clientData: Partial<Client>) => {
        const companySnapshots = await getDocs(collection(db, "companies"));
        companySnapshots.forEach(async (companyDoc) => {
            const companyData = companyDoc.data() as Company;
            const updatedClients = companyData.clients.map((client) =>
                client.id === id ? { ...client, ...clientData } : client
            );

            await updateDoc(doc(db, "companies", companyDoc.id), { clients: updatedClients });
        });
    };

    const deleteClient = async (id: string) => {
        const companySnapshots = await getDocs(collection(db, "companies"));
        companySnapshots.forEach(async (companyDoc) => {
            const companyData = companyDoc.data() as Company;
            const updatedClients = companyData.clients.filter((client) => client.id !== id);

            await updateDoc(doc(db, "companies", companyDoc.id), { clients: updatedClients });
        });

        // Update projects to remove clientId
        const projectSnapshots = await getDocs(collection(db, "projects"));
        projectSnapshots.forEach(async (projectDoc) => {
            if (projectDoc.data().clientId === id) {
                await updateDoc(doc(db, "projects", projectDoc.id), { clientId: "" });
            }
        });
    };

    // Projects CRUD
    const addProject = async (project: Omit<Project, "id">) => {
        await addDoc(collection(db, "projects"), project);
    };

    const updateProject = async (id: string, project: Partial<Project>) => {
        const projectRef = doc(db, "projects", id);
        await updateDoc(projectRef, project);
    };

    const deleteProject = async (id: string) => {
        const projectRef = doc(db, "projects", id);
        await deleteDoc(projectRef);
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
