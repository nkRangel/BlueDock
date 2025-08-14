// frontend/src/components/ServiceTable.tsx

import { ServiceOrder, deleteService } from "@/api/services";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditServiceDialog } from "./EditServiceDialog";

interface ServiceTableProps {
  services: ServiceOrder[];
  onServiceDeleted: () => void;
  onServiceUpdated: () => void;
}

const statusConfig: Record<ServiceOrder['status'], { label: string; className: string }> = {
  'Pendente': { label: 'Pendente', className: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/80' },
  'Em Andamento': { label: 'Em Andamento', className: 'bg-blue-500/20 text-blue-500 border-blue-500/80' },
  'Concluído': { label: 'Concluído', className: 'bg-green-500/20 text-green-500 border-green-500/80' },
  'Cancelado': { label: 'Cancelado', className: 'bg-red-500/20 text-red-500 border-red-500/80' },
};

export function ServiceTable({ services, onServiceDeleted, onServiceUpdated }: ServiceTableProps) {
  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço? Esta ação não pode ser desfeita.')) {
      try {
        await deleteService(id);
        onServiceDeleted();
      } catch (error) {
        console.error("Erro ao excluir serviço:", error);
        alert('Não foi possível excluir o serviço.');
      }
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Canhoto #</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Item/Descrição</TableHead>
            <TableHead className="w-[150px]">Status</TableHead>
            <TableHead className="w-[150px] text-right">Preço</TableHead>
            <TableHead className="w-[180px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.length > 0 ? (
            services.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-mono text-xs text-muted-foreground">{service.receipt_number}</TableCell>
                <TableCell className="font-medium">{service.customer_name}</TableCell>
                <TableCell>{service.item_description}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusConfig[service.status].className}>
                    {service.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {service.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <EditServiceDialog service={service} onServiceUpdated={onServiceUpdated} />
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(service.id)}>Excluir</Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Nenhum serviço encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}