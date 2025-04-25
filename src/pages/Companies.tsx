
import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Plus, Edit, Trash2 } from "lucide-react";
import { calculateTotalProjectsValue, formatCurrency } from "@/lib/utils";

const Companies = () => {
  const { companies, projects, addCompany, updateCompany, deleteCompany } = useApp();
  const [newCompany, setNewCompany] = useState({ name: "", logoUrl: "" });
  const [editCompany, setEditCompany] = useState<{ id: string; name: string; logoUrl: string } | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<string | null>(null);

  const handleAddCompany = () => {
    if (newCompany.name.trim()) {
      addCompany({
        name: newCompany.name.trim(),
        logoUrl: newCompany.logoUrl.trim() || null,
      });
      setNewCompany({ name: "", logoUrl: "" });
      setIsAddOpen(false);
    }
  };

  const handleEditCompany = () => {
    if (editCompany && editCompany.name.trim()) {
      updateCompany(editCompany.id, {
        name: editCompany.name.trim(),
        logoUrl: editCompany.logoUrl.trim() || undefined,
      });
      setEditCompany(null);
      setIsEditOpen(false);
    }
  };

  const handleDeleteCompany = () => {
    if (companyToDelete) {
      deleteCompany(companyToDelete);
      setCompanyToDelete(null);
      setIsDeleteOpen(false);
    }
  };

  const openEditDialog = (company: { id: string; name: string; logoUrl?: string }) => {
    setEditCompany({
      id: company.id,
      name: company.name,
      logoUrl: company.logoUrl || "",
    });
    setIsEditOpen(true);
  };

  const openDeleteDialog = (id: string) => {
    setCompanyToDelete(id);
    setIsDeleteOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Empresas</h1>
          <p className="text-muted-foreground">
            Gerencie as empresas para as quais você trabalha
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              <span>Adicionar</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Empresa</DialogTitle>
              <DialogDescription>
                Adicione uma nova empresa ao seu sistema
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  placeholder="Nome da empresa"
                  value={newCompany.name}
                  onChange={(e) =>
                    setNewCompany({ ...newCompany, name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="logoUrl">URL do Logo (opcional)</Label>
                <Input
                  id="logoUrl"
                  placeholder="https://exemplo.com/logo.png"
                  value={newCompany.logoUrl}
                  onChange={(e) =>
                    setNewCompany({ ...newCompany, logoUrl: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddCompany}>Adicionar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Company Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Empresa</DialogTitle>
            <DialogDescription>
              Atualize as informações da empresa
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Nome</Label>
              <Input
                id="edit-name"
                placeholder="Nome da empresa"
                value={editCompany?.name || ""}
                onChange={(e) =>
                  setEditCompany(prev => prev ? { ...prev, name: e.target.value } : null)
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-logoUrl">URL do Logo (opcional)</Label>
              <Input
                id="edit-logoUrl"
                placeholder="https://exemplo.com/logo.png"
                value={editCompany?.logoUrl || ""}
                onChange={(e) =>
                  setEditCompany(prev => prev ? { ...prev, logoUrl: e.target.value } : null)
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditCompany}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Company Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta empresa? Esta ação não pode ser desfeita.
              Todos os projetos e clientes relacionados a esta empresa também serão excluídos.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteCompany}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {companies.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader className="text-center">
            <Building2 className="mx-auto h-8 w-8 text-muted-foreground" />
            <CardTitle className="text-xl">Nenhuma empresa cadastrada</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            <p>Você ainda não cadastrou nenhuma empresa. Comece adicionando sua primeira empresa para gerenciar projetos.</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => setIsAddOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Empresa
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => {
            const companyProjects = projects.filter(
              (p) => p.companyId === company.id
            );
            const totalValue = calculateTotalProjectsValue(companyProjects);
            
            return (
              <Card key={company.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{company.name}</CardTitle>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEditDialog(company)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => openDeleteDialog(company.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Excluir</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Clientes:</span>
                      <span className="font-medium">{company.clients.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Projetos:</span>
                      <span className="font-medium">{companyProjects.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Valor Total:</span>
                      <span className="font-medium">{formatCurrency(totalValue)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Companies;
