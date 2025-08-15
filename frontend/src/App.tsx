// Hooks do React que usei: useState para gerenciar o estado, useEffect para efeitos colaterais
// como a busca de dados, e useMemo para otimizar a performance da filtragem.
import { useState, useEffect, useMemo } from 'react';
import { getServices, ServiceOrder } from '@/api/services';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceTable } from './components/ServiceTable';
import { AddServiceDialog } from './components/AddServiceDialog';
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { PaginationControls } from './components/PaginationControls';

// Este é o meu componente principal, onde toda a aplicação é orquestrada.
function App() {
  // Estado para armazenar a lista de serviços da página atual.
  const [services, setServices] = useState<ServiceOrder[]>([]);
  // Estado para controlar o texto digitado no campo de busca.
  const [searchTerm, setSearchTerm] = useState('');
  // Estados que adicionei para gerenciar a lógica de paginação.
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Encapsulei a lógica de busca de dados na `fetchServices`.
  // Ela agora recebe o número da página, o que a tornou mais flexível.
  const fetchServices = async (page: number) => {
    try {
      const response = await getServices(page);
      setServices(response.data);
      setTotalPages(response.meta.totalPages);
      setCurrentPage(response.meta.page);
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
    }
  };

  // O useEffect agora "escuta" por mudanças na `currentPage`.
  // Toda vez que o usuário clica para mudar de página, o estado muda, e o useEffect
  // é disparado novamente para buscar os dados da nova página. Uma abordagem bem reativa.
  useEffect(() => {
    fetchServices(currentPage);
  }, [currentPage]);

  // Usei `useMemo` para as métricas do dashboard, o que foi uma boa prática.
  // Os cálculos só são refeitos quando a lista de `services` (da página atual) muda.
  const dashboardMetrics = useMemo(() => {
    const totalRevenue = services
      .filter(service => service.status === 'Concluído')
      .reduce((sum, service) => sum + service.price, 0);
    const pendingServices = services.filter(s => s.status === 'Pendente').length;
    const inProgressServices = services.filter(s => s.status === 'Em Andamento').length;
    return { totalRevenue, pendingServices, inProgressServices };
  }, [services]);

  // A mesma otimização com `useMemo` para a lista filtrada da busca.
  // A busca agora atua sobre os dados da página atual, o que é suficiente para este projeto.
  const filteredServices = useMemo(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    if (!lowercasedFilter) return services;
    return services.filter(service =>
      service.customer_name.toLowerCase().includes(lowercasedFilter) ||
      service.item_description.toLowerCase().includes(lowercasedFilter) ||
      service.receipt_number.toLowerCase().includes(lowercasedFilter) ||
      service.category_name?.toLowerCase().includes(lowercasedFilter)
    );
  }, [services, searchTerm]);
  
  // Função de callback que será passada para o componente de paginação.
  const handlePageChange = (newPage: number) => {
      setCurrentPage(newPage);
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">BlueDock - Gerenciador de Serviços</h1>
        <p className="text-muted-foreground">Visão geral dos serviços da sua oficina.</p>
      </header>
      
      <main className="grid gap-4 md:grid-cols-3">
        {/* Os componentes <Card> do shadcn/ui facilitaram muito a criação de um dashboard limpo. */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento (Concluído)</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardMetrics.totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
            <p className="text-xs text-muted-foreground">Total de serviços finalizados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Serviços Pendentes</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground"><path d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" /></svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{dashboardMetrics.pendingServices}</div>
             <p className="text-xs text-muted-foreground">Aguardando início dos trabalhos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
          </CardHeader>
          <CardContent>
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
            {/* O callback onServiceAdded agora garante que o usuário seja levado de volta à primeira página
                para ver o novo registro que acabou de criar. */}
            <AddServiceDialog onServiceAdded={() => fetchServices(1)} />
          </div>
        </div>
        <ServiceTable
          services={filteredServices}
          onServiceDeleted={() => fetchServices(currentPage)}
          onServiceUpdated={() => fetchServices(currentPage)}
        />
        {/* Meu componente de paginação renderizado, recebendo os dados e a função de callback. */}
        <PaginationControls 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {/* O Toaster da biblioteca Sonner é a central de notificações. */}
      <Toaster richColors />
    </div>
  );
}

export default App;