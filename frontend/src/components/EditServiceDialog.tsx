import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ServiceOrder, updateService, getCategories, Category } from '@/api/services';
import { toast } from "sonner";

interface EditServiceDialogProps { service: ServiceOrder; onServiceUpdated: () => void; trigger?: React.ReactNode; }

export function EditServiceDialog({ service, onServiceUpdated, trigger }: EditServiceDialogProps) {
  const [open, setOpen] = useState(false);
  const [customerName, setCustomerName] = useState(service.customer_name);
  const [customerPhone, setCustomerPhone] = useState(service.customer_phone || '');
  const [customerAddress, setCustomerAddress] = useState(service.customer_address || '');
  const [customerEmail, setCustomerEmail] = useState(service.customer_email || '');
  const [itemDescription, setItemDescription] = useState(service.item_description);
  const [serviceDetails, setServiceDetails] = useState(service.service_details || '');
  const [price, setPrice] = useState(service.price.toString());
  const [status, setStatus] = useState<ServiceOrder['status']>(service.status);
  const [categoryId, setCategoryId] = useState(service.category_id?.toString() || '');
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (open) {
      getCategories().then(setCategories).catch(() => toast.error("Erro ao carregar categorias."));
    }
  }, [open]);

  useEffect(() => {
    setCustomerName(service.customer_name);
    setCustomerPhone(service.customer_phone || '');
    setCustomerAddress(service.customer_address || '');
    setCustomerEmail(service.customer_email || '');
    setItemDescription(service.item_description);
    setServiceDetails(service.service_details || '');
    setPrice(service.price.toString());
    setStatus(service.status);
    setCategoryId(service.category_id?.toString() || '');
  }, [service]);

  const handleSubmit = async () => {
    try {
      await updateService(service.id, {
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_address: customerAddress,
        customer_email: customerEmail,
        item_description: itemDescription,
        service_details: serviceDetails,
        price: parseFloat(price || '0'),
        status: status,
        category_id: categoryId ? parseInt(categoryId) : null,
      });
      toast.success('Atualizado com sucesso!');
      setOpen(false);
      onServiceUpdated();
    } catch (error) {
      toast.error("Erro ao atualizar.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? trigger : <Button variant="outline" size="sm">Editar</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar OS #{service.receipt_number}</DialogTitle>
          <DialogDescription>Edite os dados abaixo.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Cliente</Label>
            <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Telefone</Label>
            <Input type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">E-mail</Label>
            <Input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Endereço</Label>
            <Input value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Categoria</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="col-span-3"><SelectValue placeholder="Selecione..." /></SelectTrigger>
              <SelectContent>
                {categories.map(cat => <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Item</Label>
            <Input value={itemDescription} onChange={(e) => setItemDescription(e.target.value)} className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">Detalhes</Label>
            <Textarea value={serviceDetails} onChange={(e) => setServiceDetails(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Preço</Label>
            <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as ServiceOrder['status'])}>
              <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Em Orçamento">Em Orçamento</SelectItem>
                <SelectItem value="Aguardando Aprovação">Aguardando Aprovação</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Em Manutenção">Em Manutenção</SelectItem>
                <SelectItem value="Aguardando Peça">Aguardando Peça</SelectItem>
                <SelectItem value="Peça Indisponível">Peça Indisponível</SelectItem>
                <SelectItem value="Pronto">Pronto</SelectItem>
                <SelectItem value="Concluído">Concluído</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter><Button type="submit" onClick={handleSubmit}>Salvar</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}