import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ServiceOrder, updateService, getCategories, Category } from '@/api/services';
import { toast } from "sonner";

interface EditServiceDialogProps { service: ServiceOrder; onServiceUpdated: () => void; }

export function EditServiceDialog({ service, onServiceUpdated }: EditServiceDialogProps) {
  const [open, setOpen] = useState(false);
  // ... outros estados ...
  const [customerName, setCustomerName] = useState(service.customer_name);
  const [customerPhone, setCustomerPhone] = useState(service.customer_phone || '');
  const [customerAddress, setCustomerAddress] = useState(service.customer_address || '');
  const [customerEmail, setCustomerEmail] = useState(service.customer_email || '');
  const [itemDescription, setItemDescription] = useState(service.item_description);
  const [serviceDetails, setServiceDetails] = useState(service.service_details || '');
  const [price, setPrice] = useState(service.price.toString());
  const [status, setStatus] = useState<ServiceOrder['status']>(service.status);
  
  // A lógica de categorias é a mesma do modal de Adição
  const [categoryId, setCategoryId] = useState(service.category_id?.toString() || '');
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Agora o useEffect também busca as categorias quando o modal abre
    if (open) {
      const fetchCategories = async () => {
        try {
          const data = await getCategories();
          setCategories(data);
        } catch (error) {
          toast.error("Falha ao carregar as categorias.");
        }
      };
      fetchCategories();
    }
  }, [open]);

  // Usei um segundo useEffect para garantir que o formulário se atualize
  // caso o mesmo modal seja usado para editar diferentes serviços em sequência.
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
        // ... outros campos ...
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_address: customerAddress,
        customer_email: customerEmail,
        item_description: itemDescription,
        service_details: serviceDetails,
        price: parseFloat(price),
        status: status,
        category_id: categoryId ? parseInt(categoryId) : null,
      });
      toast.success('Serviço atualizado com sucesso!');
      setOpen(false);
      onServiceUpdated();
    } catch (error) {
      toast.error("Não foi possível atualizar o serviço.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button variant="outline" size="sm">Editar</Button></DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader><DialogTitle>Editar Ordem de Serviço #{service.receipt_number}</DialogTitle></DialogHeader>
        <div className="grid gap-4 py-4">
          {/* ... campos de cliente ... */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="customerName" className="text-right">Cliente</Label>
            <Input id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="customerPhone" className="text-right">Telefone</Label>
            <Input id="customerPhone" type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="customerEmail" className="text-right">E-mail</Label>
            <Input id="customerEmail" type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="customerAddress" className="text-right">Endereço</Label>
            <Input id="customerAddress" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} className="col-span-3" />
          </div>
          
          {/* --- CAMPO DE CATEGORIA --- */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">Categoria</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ... campos de serviço ... */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="itemDescription" className="text-right">Item/Serviço</Label>
            <Input id="itemDescription" value={itemDescription} onChange={(e) => setItemDescription(e.target.value)} className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="serviceDetails" className="text-right pt-2">Detalhes</Label>
            <Textarea id="serviceDetails" value={serviceDetails} onChange={(e) => setServiceDetails(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">Preço (R$)</Label>
            <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as ServiceOrder['status'])}>
              <SelectTrigger className="col-span-3"><SelectValue placeholder="Selecione o status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                <SelectItem value="Concluído">Concluído</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter><Button type="submit" onClick={handleSubmit}>Salvar Alterações</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}