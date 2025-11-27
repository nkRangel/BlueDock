import { ServiceOrder, deleteService, updateService } from "@/api/services";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EditServiceDialog } from "./EditServiceDialog";
import { toast } from "sonner";
import { FaWhatsapp, FaTrash, FaEdit } from "react-icons/fa";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ServiceTableProps { 
  services: ServiceOrder[]; 
  onServiceDeleted: () => void; 
  onServiceUpdated: () => void; 
}

const STATUS_OPTIONS: ServiceOrder['status'][] = [
  'Orçamento Enviado', 'Aguardando Aprovação', 'Pendente', 
  'Em Andamento', 'Aguardando Peça', 'Pronto', 
  'Concluído', 'Cancelado'
];

const statusConfig: Record<ServiceOrder['status'], { className: string }> = {
  'Orçamento Enviado': { className: 'bg-slate-500/20 text-slate-500 border-slate-500/50' },
  'Aguardando Aprovação': { className: 'bg-orange-500/20 text-orange-500 border-orange-500/50' },
  'Pendente': { className: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50' },
  'Em Andamento': { className: 'bg-blue-500/20 text-blue-500 border-blue-500/50' },
  'Aguardando Peça': { className: 'bg-purple-500/20 text-purple-500 border-purple-500/50' },
  'Pronto': { className: 'bg-cyan-500/20 text-cyan-500 border-cyan-500/50' },
  'Concluído': { className: 'bg-green-500/20 text-green-500 border-green-500/50' },
  'Cancelado': { className: 'bg-red-500/20 text-red-500 border-red-500/50' },
};

const formatPhone = (phone?: string) => {
  if (!phone) return "-";
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
  if (match) return `(${match[1]}) ${match[2]}-${match[3]}`;
  return phone;
};

export function ServiceTable({ services, onServiceDeleted, onServiceUpdated }: ServiceTableProps) {
  
  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir?')) {
      try {
        await deleteService(id);
        toast.success('Excluído com sucesso!');
        onServiceDeleted();
      } catch (error) { toast.error('Erro ao excluir.'); }
    }
  };

  const handleStatusChange = async (id: number, newStatus: ServiceOrder['status']) => {
    try {
      await updateService(id, { status: newStatus });
      toast.success(`Status alterado para: ${newStatus}`);
      onServiceUpdated();
    } catch (error) {
      toast.error("Erro ao atualizar status.");
    }
  };

  const handleNotifyWhatsApp = (service: ServiceOrder) => {
    if (!service.customer_phone) {
      toast.error("Cliente sem telefone.");
      return;
    }
    const phoneNumber = `55${service.customer_phone.replace(/\D/g, '')}`;
    const message = encodeURIComponent(
      `Olá, ${service.customer_name}! Novidades sobre sua Ordem de Serviço #${service.receipt_number} - ${service.item_description}:\n\n` +
      `O status foi atualizado para: *${service.status}*\n\n` +
      `Atenciosamente,\n` +
      `Equipe Casa das Redes do Alencar!`
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="rounded-xl border bg-card/50 backdrop-blur-sm overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[100px] font-bold">Canhoto</TableHead>
            <TableHead className="font-bold">Cliente</TableHead>
            <TableHead className="font-bold">Item</TableHead>
            <TableHead className="w-[120px] font-bold">Categoria</TableHead>
            <TableHead className="w-[180px] font-bold text-center">Status</TableHead>
            <TableHead className="w-[120px] text-right font-bold">Preço</TableHead>
            <TableHead className="w-[140px] text-right font-bold">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.length > 0 ? (
            services.map((service) => (
              <TableRow key={service.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-mono text-xs font-medium text-muted-foreground">
                  #{service.receipt_number}
                </TableCell>
                <TableCell>
                  <div className="font-medium text-foreground">{service.customer_name}</div>
                  <div className="text-xs text-muted-foreground/80">{formatPhone(service.customer_phone)}</div>
                </TableCell>
                <TableCell className="text-sm">{service.item_description}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{service.category_name || '-'}</TableCell>
                
                <TableCell className="py-2">
                  <Select 
                    defaultValue={service.status} 
                    onValueChange={(val) => handleStatusChange(service.id, val as ServiceOrder['status'])}
                  >
                    <SelectTrigger 
                      className={`h-7 text-xs font-semibold border-0 ring-1 ring-inset ${statusConfig[service.status]?.className} focus:ring-2`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status} value={status} className="text-xs">
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>

                <TableCell className="text-right font-medium">
                  {service.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </TableCell>
                
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleNotifyWhatsApp(service)} 
                      className="h-8 w-8 text-green-500 hover:text-green-400 hover:bg-green-500/10"
                      title="WhatsApp"
                    >
                      <FaWhatsapp className="h-4 w-4" />
                    </Button>

                    <div className="inline-block">
                        <EditServiceDialog 
                            service={service} 
                            onServiceUpdated={onServiceUpdated} 
                            trigger={
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10" title="Editar">
                                    <FaEdit className="h-4 w-4" />
                                </Button>
                            }
                        />
                    </div>

                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(service.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                      title="Excluir"
                    >
                      <FaTrash className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow><TableCell colSpan={7} className="h-32 text-center text-muted-foreground">Nenhum serviço encontrado.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}