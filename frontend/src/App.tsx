import { useState, useEffect, useMemo } from 'react';
import { getServices, ServiceOrder } from '@/api/services';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceTable } from './components/ServiceTable';
import { AddServiceDialog } from './components/AddServiceDialog';
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { PaginationControls } from './components/PaginationControls';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FaMoneyBillWave, FaClock, FaTools, FaSearch } from "react-icons/fa";

function App() {
  const [services, setServices] = useState<ServiceOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchServices = async (page: number) => {
    try {
      const response = await getServices(page); 
      setServices(response.data);
      setTotalPages(response.meta.totalPages);
      setCurrentPage(response.meta.page);
    } catch (error) { 
        console.error("Error fetching services:", error); 
    }
  };

  useEffect(() => {
    fetchServices(currentPage);
  }, [currentPage]);

  const dashboardMetrics = useMemo(() => {
    const totalRevenue = services
      .filter(service => service.status === 'Concluído')
      .reduce((sum, service) => sum + service.price, 0);
    const pendingServices = services.filter(s => s.status === 'Pendente').length;
    const inProgressServices = services.filter(s => s.status === 'Em Andamento').length;
    return { totalRevenue, pendingServices, inProgressServices };
  }, [services]);

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const lowercasedFilter = searchTerm.toLowerCase();
      const matchesSearch = 
        !lowercasedFilter || 
        service.customer_name.toLowerCase().includes(lowercasedFilter) ||
        service.item_description.toLowerCase().includes(lowercasedFilter) ||
        service.receipt_number.toLowerCase().includes(lowercasedFilter) ||
        service.category_name?.toLowerCase().includes(lowercasedFilter);
      const matchesStatus = statusFilter === 'all' || service.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [services, searchTerm, statusFilter]);
  
  const handlePageChange = (newPage: number) => { setCurrentPage(newPage); }

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans text-foreground flex flex-col">
      <div className="max-w-7xl mx-auto space-y-8 flex-grow w-full">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center border-b border-white/10 pb-8 mb-8 bg-gradient-to-r from-transparent via-white/5 to-transparent p-6 rounded-xl">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-secondary to-primary rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <img src="/logo.png" alt="Logo" className="relative h-24 w-auto object-contain drop-shadow-2xl transform transition-transform duration-300 hover:scale-105" />
            </div>
            <div className="hidden md:block h-16 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent mx-2"></div>
            <div className="text-center md:text-left">
              <h1 className="text-5xl font-extrabold tracking-tight text-white drop-shadow-md" style={{ fontFamily: 'Inter, sans-serif' }}>
                Blue<span className="text-secondary">Dock</span>
              </h1>
              <p className="text-gray-300 mt-1 text-lg font-light tracking-wide">
                O gerenciador de serviços da <span className="font-medium text-secondary/90">Casa das Redes do Alencar</span>
              </p>
            </div>
          </div>
          <div className="mt-6 md:mt-0 bg-black/20 px-6 py-3 rounded-full border border-white/5 backdrop-blur-md shadow-inner">
            <div className="flex flex-col items-end">
              <p className="text-xs text-secondary font-bold uppercase tracking-[0.2em]">Sistema Online</p>
              <p className="text-sm text-white/90 font-medium capitalize">
                {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
          </div>
        </header>
        
        {/* Dashboard Metrics */}
        <main className="grid gap-6 md:grid-cols-3">
          <Card className="relative overflow-hidden bg-card/50 border-l-4 border-l-green-500 shadow-lg backdrop-blur-sm">
            <div className="absolute right-[-10px] top-[-10px] opacity-5"><FaMoneyBillWave className="h-32 w-32 text-green-500" /></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-wider">Faturamento (Concluído)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white">{dashboardMetrics.totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
              <p className="text-xs text-green-400/80 mt-1 font-medium">Total finalizado no período</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-card/50 border-l-4 border-l-yellow-500 shadow-lg backdrop-blur-sm">
            <div className="absolute right-[-10px] top-[-10px] opacity-5"><FaClock className="h-32 w-32 text-yellow-500" /></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-wider">Pendente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white">{dashboardMetrics.pendingServices}</div>
               <p className="text-xs text-yellow-400/80 mt-1 font-medium">Aguardando início</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-card/50 border-l-4 border-l-blue-500 shadow-lg backdrop-blur-sm">
            <div className="absolute right-[-10px] top-[-10px] opacity-5"><FaTools className="h-32 w-32 text-blue-500" /></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-wider">Em Andamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white">{dashboardMetrics.inProgressServices}</div>
               <p className="text-xs text-blue-400/80 mt-1 font-medium">Na bancada agora</p>
            </CardContent>
          </Card>
        </main>

        {/* Table Section */}
        <div className="space-y-4 bg-card/30 p-6 rounded-xl border border-primary/10 shadow-xl backdrop-blur-sm">
          <div className="flex flex-col xl:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full xl:w-auto">
                <div className="bg-primary/20 p-2 rounded-full"><FaTools className="text-primary h-5 w-5"/></div>
                <h2 className="text-2xl font-semibold tracking-tight text-white">Ordens de Serviço</h2>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
              <div className="relative w-full sm:w-[300px]">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar cliente, item, canhoto..."
                  className="pl-10 bg-background/50 border-primary/20 focus:border-primary h-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[200px] bg-background/50 border-primary/20 h-10">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="Orçamento Enviado">Orçamento Enviado</SelectItem>
                  <SelectItem value="Aguardando Aprovação">Aguardando Aprovação</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                  <SelectItem value="Aguardando Peça">Aguardando Peça</SelectItem>
                  <SelectItem value="Pronto">Pronto</SelectItem>
                  <SelectItem value="Concluído">Concluído</SelectItem>
                  <SelectItem value="Cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>

              <AddServiceDialog onServiceAdded={() => fetchServices(1)} />
            </div>
          </div>
          
          <ServiceTable
            services={filteredServices}
            onServiceDeleted={() => fetchServices(currentPage)}
            onServiceUpdated={() => fetchServices(currentPage)}
          />
          
          <PaginationControls 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 border-t border-primary/10 py-6 text-center">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} <span className="font-semibold text-primary">BlueDock</span>. 
          Desenvolvido por <span className="font-bold text-foreground">Pedro Rangel</span>.
        </p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          Todos os direitos reservados®.
        </p>
      </footer>

      <Toaster richColors theme="dark" />
    </div>
  );
}

export default App;