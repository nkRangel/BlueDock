import { ServiceOrder, deleteService } from "@/api/services";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditServiceDialog } from "./EditServiceDialog";
import { toast } from "sonner";
// Decidi usar a biblioteca 'react-icons' para o ícone do WhatsApp. É leve e muito fácil de usar.
import { FaWhatsapp } from "react-icons/fa";

// A interface de props do componente, definindo o que ele espera receber.
interface ServiceTableProps { 
  services: ServiceOrder[]; 
  onServiceDeleted: () => void; 
  onServiceUpdated: () => void; 
}

// Meu objeto de configuração para dar cores aos status. Deixa o código JSX mais limpo.
const statusConfig: Record<ServiceOrder['status'], { label: string; className: string }> = {
  'Pendente': { label: 'Pendente', className: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/80' },
  'Em Andamento': { label: 'Em Andamento', className: 'bg-blue-500/20 text-blue-500 border-blue-500/80' },
  'Concluído': { label: 'Concluído', className: 'bg-green-500/20 text-green-500 border-green-500/80' },
  'Cancelado': { label: 'Cancelado', className: 'bg-red-500/20 text-red-500 border-red-500/80' },
};

export function ServiceTable({ services, onServiceDeleted, onServiceUpdated }: ServiceTableProps) {
  
  const handleDelete = async (id: number) => {
    // Mantive o window.confirm aqui por ser uma ação destrutiva. É uma camada de segurança importante.
    if (window.confirm('Tem certeza que deseja excluir este serviço? Esta ação não pode ser desfeita.')) {
      try {
        await deleteService(id);
        toast.success('Serviço excluído com sucesso!');
        onServiceDeleted();
      } catch (error) { 
        toast.error('Não foi possível excluir o serviço.'); 
      }
    }
  };

  // Criei uma função separada para a lógica de notificação do WhatsApp para manter o JSX limpo.
  const handleNotifyWhatsApp = (service: ServiceOrder) => {
    // Primeiro, uma validação simples para garantir que o cliente tem um telefone cadastrado.
    if (!service.customer_phone) {
      toast.error("Este cliente não possui um número de telefone cadastrado.");
      return;
    }

    // O link do WhatsApp exige um formato específico (código do país + número sem caracteres especiais),
    // então achei importante fazer essa limpeza e formatação aqui. Incluí '55' para o Brasil.
    const phoneNumber = `55${service.customer_phone.replace(/\D/g, '')}`;

    // Criei um modelo de mensagem usando template literals. Achei útil incluir o nome do cliente,
    // o número do canhoto e o status atual para dar todo o contexto na mensagem.
    // O encodeURIComponent é a parte chave: ele converte espaços e caracteres especiais (como a quebra de linha \n)
    // em um formato que a URL do navegador entende, evitando que o link quebre.
    const message = encodeURIComponent(
      `Olá, ${service.customer_name}! Novidades sobre sua Ordem de Serviço #${service.receipt_number} (${service.item_description}):\n\nO status foi atualizado para: *${service.status}*.\n\nAtenciosamente,\nEquipe BlueDock`
    );

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    // Usei window.open para abrir o link em uma nova aba. Achei que seria uma
    // melhor experiência para o usuário, que não perde a tela do sistema.
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Canhoto #</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Item/Serviço</TableHead>
            <TableHead className="w-[150px]">Categoria</TableHead>
            <TableHead className="w-[150px]">Status</TableHead>
            <TableHead className="w-[150px] text-right">Preço</TableHead>
            {/* Ajustei a largura da coluna de Ações para acomodar o novo botão confortavelmente. */}
            <TableHead className="w-[220px] text-right">Ações</TableHead> 
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.length > 0 ? (
            services.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-mono text-xs text-muted-foreground">{service.receipt_number}</TableCell>
                <TableCell>
                  <div className="font-medium">{service.customer_name}</div>
                  <div className="text-xs text-muted-foreground">{service.customer_phone}</div>
                </TableCell>
                <TableCell>{service.item_description}</TableCell>
                <TableCell>{service.category_name || '-'}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusConfig[service.status].className}>
                    {service.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {service.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </TableCell>
                <TableCell className="text-right space-x-1">
                  {/* Adicionei o novo botão de WhatsApp aqui. */}
                  <Button variant="outline" size="sm" onClick={() => handleNotifyWhatsApp(service)} className="text-green-500 hover:text-green-600 hover:border-green-600 border-green-500/80">
                    <FaWhatsapp className="h-4 w-4" />
                  </Button>
                  <EditServiceDialog service={service} onServiceUpdated={onServiceUpdated} />
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(service.id)}>Excluir</Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Nenhum serviço encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}