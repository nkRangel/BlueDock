import { ServiceOrder } from "@/api/services";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface ProductivityTableProps {
    services: ServiceOrder[];
}

const calculateDuration = (start: string, end?: string | null) => {
    if (!end) return "Em andamento";
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Mesmo dia";
    if (diffDays === 1) return "1 dia";
    return `${diffDays} dias`;
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
    });
};

export function ProductivityTable({ services }: ProductivityTableProps) {
    const DEPLOY_DATE = new Date('2025-11-27T00:00:00');

    const completedServices = services.filter(s => {
        const createdDate = new Date(s.created_at);
        const isAfterDeploy = createdDate >= DEPLOY_DATE;
        const isFinished = s.status === 'Pronto' || s.status === 'Concluído';
        return isAfterDeploy && isFinished;
    });

    return (
        <div className="rounded-xl border bg-card/50 backdrop-blur-sm overflow-hidden shadow-sm mt-6">
            <div className="p-4 border-b border-primary/10">
                <h3 className="font-semibold text-lg text-white">Relatório de Prazos (Pós-Implantação)</h3>
                <p className="text-sm text-muted-foreground">Tempo decorrido para serviços iniciados após 27/11/2025.</p>
            </div>
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow>
                        <TableHead>Canhoto</TableHead>
                        <TableHead>Item</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Entrada</TableHead>
                        <TableHead>Conclusão</TableHead>
                        <TableHead className="text-right">Tempo Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {completedServices.length > 0 ? (
                        completedServices.map((service) => (
                            <TableRow key={service.id} className="hover:bg-muted/30">
                                <TableCell className="font-mono text-xs">{service.receipt_number}</TableCell>
                                <TableCell>{service.item_description}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{service.status}</Badge>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {formatDate(service.created_at)}
                                </TableCell>
                                <TableCell className="text-sm text-green-400">
                                    {service.finished_at ? formatDate(service.finished_at) : '-'}
                                </TableCell>
                                <TableCell className="text-right font-bold text-white">
                                    {calculateDuration(service.created_at, service.finished_at)}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                Nenhum serviço finalizado neste período.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}