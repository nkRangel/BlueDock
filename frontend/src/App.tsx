// frontend/src/App.tsx

// Hooks do React que usei: useState para gerenciar o estado, useEffect para efeitos colaterais
// como a busca de dados, e useMemo para otimizar a performance da filtragem.
import { useState, useEffect, useMemo } from 'react';
import { getServices, ServiceOrder } from '@/api/services';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceTable } from './components/ServiceTable';
import { AddServiceDialog } from './components/AddServiceDialog';
import { Input } from "@/components/ui/input";

function App() {
  // Estado para armazenar a lista completa de serviços vinda da API.
  const [services, setServices] = useState<ServiceOrder[]>([]);
  // Estado para controlar o texto digitado no campo de busca.
  const [searchTerm, setSearchTerm] = useState('');

  // A lógica de busca de dados foi encapsulada nesta função para poder ser reutilizada.
  // Isso é útil para atualizar a tabela após adicionar, editar ou excluir um serviço.
  const fetchServices = async () => {
    try {
      const data = await getServices();
      setServices(data);
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
    }
  };

  // O useEffect com array de dependências vazio [] é um padrão do React para executar
  // uma ação apenas uma vez, quando o componente é montado na tela. Perfeito para a busca inicial de dados.
  useEffect(() => {
    fetchServices();
  }, []);

  // Achei importante usar 'useMemo' para a filtragem. Isso otimiza a performance,
  // pois o React só vai refazer o filtro se a lista de 'services' ou o 'searchTerm' mudarem.
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

  // Os dados do dashboard ainda são estáticos, um ponto para melhoria futura.
  const totalRevenue = 0;
  const pendingServices = 0;
  const inProgressServices = 0;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">BlueDock - Gerenciador de Serviços</h1>
        <p className="text-muted-foreground">Visão geral dos serviços da sua oficina.</p>
      </header>

      <main className="grid gap-4 md:grid-cols-3">
        {/* Cards do Dashboard... */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento (Concluído)</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total de serviços finalizados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Serviços Pendentes</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground"><path d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" /></svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{pendingServices}</div>
             <p className="text-xs text-muted-foreground">Aguardando início dos trabalhos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{inProgressServices}</div>
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
            {/* Passo a função fetchServices como prop para o modal de adição.
                Isso permite que o modal "avise" o App para atualizar a lista após a criação. */}
            <AddServiceDialog onServiceAdded={fetchServices} />
          </div>
        </div>
        {/* A tabela recebe a lista já filtrada e as funções de atualização. */}
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