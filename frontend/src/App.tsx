// src/App.tsx

import { useState, useEffect, useMemo } from 'react';
import { getServices, ServiceOrder } from '@/api/services';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceTable } from './components/ServiceTable';
import { AddServiceDialog } from './components/AddServiceDialog';
import { Input } from "@/components/ui/input";

function App() {
  const [services, setServices] = useState<ServiceOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchServices = async () => {
    try {
      const data = await getServices();
      setServices(data);
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // NOVO: Bloco de cálculo para as métricas do Dashboard
  // Ele observa a lista 'services' e recalcula tudo automaticamente quando ela muda.
  const dashboardMetrics = useMemo(() => {
    const totalRevenue = services
      .filter(service => service.status === 'Concluído')
      .reduce((sum, service) => sum + service.price, 0);

    const pendingServices = services.filter(s => s.status === 'Pendente').length;
    const inProgressServices = services.filter(s => s.status === 'Em Andamento').length;

    return { totalRevenue, pendingServices, inProgressServices };
  }, [services]);

  const filteredServices = useMemo(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    if (!lowercasedFilter) {
      return services;
    }
    return services.filter(service =>
      service.customer_name.toLowerCase().includes(lowercasedFilter) ||
      service.item_description.toLowerCase().includes(lowercasedFilter) ||
      service.receipt_number.toLowerCase().includes(lowercasedFilter)
    );
  }, [services, searchTerm]);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">BlueDock - Gerenciador de Serviços</h1>
        <p className="text-muted-foreground">Visão geral dos serviços da sua oficina.</p>
      </header>

      <main className="grid gap-4 md:grid-cols-3">
        {/* Card de Faturamento */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento (Concluído)</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
          </CardHeader>
          <CardContent>
            {/* ATUALIZADO */}
            <div className="text-2xl font-bold">{dashboardMetrics.totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
            <p className="text-xs text-muted-foreground">Total de serviços finalizados</p>
          </CardContent>
        </Card>

        {/* Card de Serviços Pendentes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Serviços Pendentes</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground"><path d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" /></svg>
          </CardHeader>
          <CardContent>
            {/* ATUALIZADO */}
            <div className="text-2xl font-bold">+{dashboardMetrics.pendingServices}</div>
             <p className="text-xs text-muted-foreground">Aguardando início dos trabalhos</p>
          </CardContent>
        </Card>

        {/* Card de Serviços Em Andamento */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
          </CardHeader>
          <CardContent>
            {/* ATUALIZADO */}
            <div className="text-2xl font-bold">+{dashboardMetrics.inProgressServices}</div>
             <p className="text-xs text-muted-foreground">Serviços atualmente na oficina</p>
          </CardContent>
        </Card>
      </main>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4 gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">Ordens de Serviço</h2>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Buscar por cliente, item ou canhoto..."
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <AddServiceDialog onServiceAdded={fetchServices} />
          </div>
        </div>
        <ServiceTable
          services={filteredServices}
          onServiceDeleted={fetchServices}
          onServiceUpdated={fetchServices}
        />
      </div>
    </div>
  );
}

export default App;