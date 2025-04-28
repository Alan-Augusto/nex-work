import React, { useMemo } from "react";
import { useApp } from "@/contexts/AppContext";
import MonthFilter from "@/components/MonthFilter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateTotalProjectsValue, formatCurrency, parseHourString } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { Clock, DollarSign, BarChart3, Calendar } from "lucide-react";

const Dashboard = () => {
  const { projects, companies, selectedMonth } = useApp();

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const projectMonth = project.startDate.slice(0, 7); // Assuming startDate is in ISO format
      return projectMonth === selectedMonth;
    });
  }, [projects, selectedMonth]);

  const monthlyRevenue = calculateTotalProjectsValue(filteredProjects);

  // Calculate total hours for the selected month
  const totalHours = filteredProjects.reduce((total, project) => {
    return total + parseHourString(project.estimatedHours);
  }, 0);

  // Generate company data for chart
  const companyData = companies.map(company => {
    const companyProjects = filteredProjects.filter(p => p.companyId === company.id);
    const value = calculateTotalProjectsValue(companyProjects);
    return {
      name: company.name,
      value
    };
  }).filter(item => item.value > 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral dos seus projetos e rendimentos
        </p>
      </div>

      <MonthFilter />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Faturamento Mensal
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(monthlyRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              {filteredProjects.length} projetos ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Horas</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(totalHours)}h {Math.round((totalHours % 1) * 60)}m
            </div>
            <p className="text-xs text-muted-foreground">
              Média de {(totalHours / (filteredProjects.length || 1)).toFixed(1)}h por projeto
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projetos Totais</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">
              {projects.filter(p => p.status === 'completed').length} concluídos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empresas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companies.length}</div>
            <p className="text-xs text-muted-foreground">
              {companies.reduce((total, company) => total + company.clients.length, 0)} clientes
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Faturamento por Empresa</CardTitle>
            <CardDescription>
              Distribuição do faturamento entre empresas
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            {companyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={companyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `R$ ${value}`}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${formatCurrency(value)}`, 'Valor']}
                    contentStyle={{ 
                      borderRadius: '0.5rem',
                      border: '1px solid var(--border)',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="hsl(var(--accent))" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[350px] text-muted-foreground">
                <p>Nenhum dado disponível</p>
                <p className="text-sm">Adicione empresas e projetos para visualizar o gráfico</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Projetos Recentes</CardTitle>
            <CardDescription>
              Seus projetos mais recentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredProjects.length > 0 ? (
                filteredProjects
                  .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                  .slice(0, 5)
                  .map((project) => {
                    const company = companies.find((c) => c.id === project.companyId);
                    const client = company?.clients.find((c) => c.id === project.clientId);
                    
                    return (
                      <div 
                        key={project.id} 
                        className="flex items-center justify-between border-b pb-2 last:border-0"
                      >
                        <div>
                          <div className="font-medium">{project.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {company?.name} - {client?.name || 'Cliente não definido'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {formatCurrency(parseHourString(project.estimatedHours) * project.hourlyRate)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {project.estimatedHours}h
                          </div>
                        </div>
                      </div>
                    );
                  })
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  <p>Nenhum projeto encontrado</p>
                  <p className="text-sm">Adicione projetos para visualizar aqui</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
