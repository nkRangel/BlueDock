import { useState, useEffect, useMemo } from 'react';
import { getServices, ServiceOrder, getProductivityData, ProductivityData } from '@/api/services';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceTable } from './components/ServiceTable';
import { AddServiceDialog } from './components/AddServiceDialog';
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { PaginationControls } from './components/PaginationControls';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FaMoneyBillWave, FaClock, FaTools, FaSearch, FaChartBar, FaList } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ProductivityTable } from './components/ProductivityTable';

function App() {
  const [services, setServices] = useState<ServiceOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'productivity'>('dashboard');
  const [productivityData, setProductivityData] = useState<ProductivityData[]>([]);

  const fetchServices = async (page: number) => {
    try {
      const response = await getServices(page);
      // Garanto que services seja um array mesmo se response.data vier nulo
      setServices(response.data || []);
      // Optional chaining para evitar crash se meta não existir
      setTotalPages(response.meta?.totalPages || 1);
      setCurrentPage(response.meta?.page || 1);
    } catch (error) { 
      console.error("Error fetching services:", error);
      // Em caso de erro, seto array vazio para não quebrar o .filter do useMemo
      setServices([]); 
    }
  };

  const fetchProductivity = async () => {
    try {
        const data = await getProductivityData();
        setProductivityData(data || []);
    } catch (error) { 
      console.error(error); 
    }
  };

  useEffect(() => {
    fetchServices(currentPage);
    if (activeTab === 'productivity') fetchProductivity();
  }, [currentPage, activeTab]);

  const dashboardMetrics = useMemo(() => {
    if (!services) return { totalRevenue: 0, pendingServices: 0, inProgressServices: 0 };
    
    const totalRevenue = services
      .filter(service => service.status === 'Concluído')
      .reduce((sum, service) => sum + service.price, 0);
    
    const pendingServices = services.filter(s => s.status === 'Pendente').length;
    const inProgressServices = services.filter(s => s.status === 'Em Manutenção').length;
    
    return { totalRevenue, pendingServices, inProgressServices };
  }, [services]);

  const filteredServices = useMemo(() => {
    if (!services) return [];
    
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
                O gerenciador da <span className="font-medium text-secondary/90">Casa das Redes do Alencar</span>
              </p>
            </div>
          </div>
          
          <div className="mt-6 md:mt-0 flex flex-col gap-4">
             <div className="flex bg-black/40 rounded-lg p-1">
                <button 
                    onClick={() => setActiveTab('dashboard')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${activeTab === 'dashboard' ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                >
                    <FaList /> Dashboard
                </button>
                <button 
                    onClick={() => setActiveTab('productivity')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${activeTab === 'productivity' ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                >
                    <FaChartBar /> Produtividade
                </button>
             </div>
          </div>
        </header>
        
        {activeTab === 'dashboard' ? (
            <>
                <main className="grid gap-6 md:grid-cols-3">
                    <Card className="relative overflow-hidden bg-card/50 border-l-4 border-l-green-500 shadow-lg backdrop-blur-sm">
                        <div className="absolute right-[-10px] top-[-10px] opacity-5"><FaMoneyBillWave className="h-32 w-32 text-green-500" /></div>
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-wider">Faturamento</CardTitle></CardHeader>
                        <CardContent>
                        <div className="text-4xl font-bold text-white">{dashboardMetrics.totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                        <p className="text-xs text-green-400/80 mt-1 font-medium">Finalizado</p>
                        </CardContent>
                    </Card>
                    <Card className="relative overflow-hidden bg-card/50 border-l-4 border-l-yellow-500 shadow-lg backdrop-blur-sm">
                        <div className="absolute right-[-10px] top-[-10px] opacity-5"><FaClock className="h-32 w-32 text-yellow-500" /></div>
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-wider">Pendente</CardTitle></CardHeader>
                        <CardContent>
                        <div className="text-4xl font-bold text-white">{dashboardMetrics.pendingServices}</div>
                        <p className="text-xs text-yellow-400/80 mt-1 font-medium">Aguardando</p>
                        </CardContent>
                    </Card>
                    <Card className="relative overflow-hidden bg-card/50 border-l-4 border-l-blue-500 shadow-lg backdrop-blur-sm">
                        <div className="absolute right-[-10px] top-[-10px] opacity-5"><FaTools className="h-32 w-32 text-blue-500" /></div>
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-wider">Em Manutenção</CardTitle></CardHeader>
                        <CardContent>
                        <div className="text-4xl font-bold text-white">{dashboardMetrics.inProgressServices}</div>
                        <p className="text-xs text-blue-400/80 mt-1 font-medium">Na bancada</p>
                        </CardContent>
                    </Card>
                </main>

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
                                    placeholder="Buscar..." 
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
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="Em Orçamento">Em Orçamento</SelectItem>
                                    <SelectItem value="Aguardando Aprovação">Aprov. Pendente</SelectItem>
                                    <SelectItem value="Pendente">Pendente</SelectItem>
                                    <SelectItem value="Em Manutenção">Em Manutenção</SelectItem>
                                    <SelectItem value="Aguardando Peça">Ag. Peça</SelectItem>
                                    <SelectItem value="Peça Indisponível">Peça Indisp.</SelectItem>
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
            </>
        ) : (
            <div className="space-y-6">
                
                <div className="space-y-4 bg-card/30 p-6 rounded-xl border border-primary/10 shadow-xl backdrop-blur-sm min-h-[500px]">
                    <h2 className="text-2xl font-semibold text-white mb-6">Produtividade Semanal</h2>
                    <div style={{ width: '100%', height: 400, minHeight: 400 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={productivityData}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                <XAxis dataKey="date" stroke="#888888" />
                                <YAxis stroke="#888888" allowDecimals={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1D1D1B', border: '1px solid #333' }} 
                                    itemStyle={{ color: '#E2E4DF' }} 
                                />
                                <Legend />
                                <Bar dataKey="total" name="Serviços Criados" fill="#956335" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="concluidos" name="Concluídos" fill="#22c55e" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="prontos" name="Prontos" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-center text-sm text-muted-foreground mt-4">Mostrando dados a partir de 27/11/2025</p>
                </div>

                <ProductivityTable services={services} />
            </div>
        )}
      </div>

      <footer className="mt-12 border-t border-primary/10 py-6 text-center">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} <span className="font-semibold text-primary">BlueDock</span>. 
          Desenvolvido por <span className="font-bold text-foreground">Pedro Rangel</span>.
        </p>
        <p className="text-xs text-muted-foreground/60 mt-1">Todos os direitos reservados®.</p>
      </footer>

      <Toaster richColors theme="dark" />
    </div>
  );
}

export default App;