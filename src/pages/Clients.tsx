
import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Users } from "lucide-react";

const Clients = () => {
  const { companies, addClient, updateClient, deleteClient } = useApp();
  const [newClient, setNewClient] = useState({
    name: "",
    companyId: "",
    email: "",
    phone: "",
  });
  const [editClient, setEditClient] = useState<{
    id: string;
    name: string;
    companyId: string;
    email: string;
    phone: string;
  } | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);

  // Get all clients from all companies
  const allClients = companies.flatMap((company) =>
    company.clients.map((client) => ({
      ...client,
      companyName: company.name,
    }))
  );
  const handleAddClient = () => {
    if (newClient.name.trim() && newClient.companyId) {
      addClient({
        name: newClient.name.trim(),
        companyId: newClient.companyId,
        email: newClient.email.trim() || null,
        phone: newClient.phone.trim() || null,
      });
      setNewClient({ name: "", companyId: "", email: "", phone: "" });
      setIsAddOpen(false);
    }
  };

  const handleEditClient = () => {
    if (editClient && editClient.name.trim() && editClient.companyId) {
      updateClient(editClient.id, {
        name: editClient.name.trim(),
        companyId: editClient.companyId,
        email: editClient.email.trim() || undefined,
        phone: editClient.phone.trim() || undefined,
      });
      setEditClient(null);
      setIsEditOpen(false);
    }
  };

  const handleDeleteClient = () => {
    if (clientToDelete) {
      deleteClient(clientToDelete);
      setClientToDelete(null);
      setIsDeleteOpen(false);
    }
  };

  const openEditDialog = (client: {
    id: string;
    name: string;
    companyId: string;
    email?: string;
    phone?: string;
  }) => {
    setEditClient({
      id: client.id,
      name: client.name,
      companyId: client.companyId,
      email: client.email || "",
      phone: client.phone || "",
    });
    setIsEditOpen(true);
  };

  const openDeleteDialog = (id: string) => {
    setClientToDelete(id);
    setIsDeleteOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">
            Gerencie os clientes das empresas para as quais você trabalha
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="flex items-center gap-1"
              disabled={companies.length === 0}
            >
              <Plus className="h-4 w-4" />
              <span>Adicionar</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Cliente</DialogTitle>
              <DialogDescription>
                Adicione um novo cliente a uma empresa
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="company">Empresa</Label>
                <Select
                  value={newClient.companyId}
                  onValueChange={(value) =>
                    setNewClient({ ...newClient, companyId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma empresa" />
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
                <Label htmlFor="name">Nome do Cliente</Label>
                <Input
                  id="name"
                  placeholder="Nome do cliente"
                  value={newClient.name}
                  onChange={(e) =>
                    setNewClient({ ...newClient, name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email (opcional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={newClient.email}
                  onChange={(e) =>
                    setNewClient({ ...newClient, email: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Telefone (opcional)</Label>
                <Input
                  id="phone"
                  placeholder="(99) 99999-9999"
                  value={newClient.phone}
                  onChange={(e) =>
                    setNewClient({ ...newClient, phone: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddClient}>Adicionar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Client Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>
              Atualize as informações do cliente
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-company">Empresa</Label>
              <Select
                value={editClient?.companyId || ""}
                onValueChange={(value) =>
                  setEditClient((prev) =>
                    prev ? { ...prev, companyId: value } : null
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma empresa" />
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
              <Label htmlFor="edit-name">Nome do Cliente</Label>
              <Input
                id="edit-name"
                placeholder="Nome do cliente"
                value={editClient?.name || ""}
                onChange={(e) =>
                  setEditClient((prev) =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email (opcional)</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="email@example.com"
                value={editClient?.email || ""}
                onChange={(e) =>
                  setEditClient((prev) =>
                    prev ? { ...prev, email: e.target.value } : null
                  )
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-phone">Telefone (opcional)</Label>
              <Input
                id="edit-phone"
                placeholder="(99) 99999-9999"
                value={editClient?.phone || ""}
                onChange={(e) =>
                  setEditClient((prev) =>
                    prev ? { ...prev, phone: e.target.value } : null
                  )
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditClient}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Client Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este cliente? Esta ação não pode ser
              desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteClient}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {companies.length === 0 ? (
        <Card className="p-8 text-center">
          <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhuma empresa cadastrada</h3>
          <p className="text-muted-foreground mb-4">
            Você precisa cadastrar pelo menos uma empresa antes de adicionar clientes.
          </p>
          <Button asChild>
            <a href="/companies">Cadastrar Empresa</a>
          </Button>
        </Card>
      ) : allClients.length === 0 ? (
        <Card className="p-8 text-center">
          <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhum cliente cadastrado</h3>
          <p className="text-muted-foreground mb-4">
            Adicione seu primeiro cliente para começar a gerenciá-los.
          </p>
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Cliente
          </Button>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.companyName}</TableCell>
                  <TableCell>
                    {client.email || <span className="text-muted-foreground">N/A</span>}
                  </TableCell>
                  <TableCell>
                    {client.phone || <span className="text-muted-foreground">N/A</span>}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEditDialog(client)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => openDeleteDialog(client.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Excluir</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Clients;
