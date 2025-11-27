

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addService, getCategories, Category } from '@/api/services';
import { toast } from "sonner";

interface AddServiceDialogProps { onServiceAdded: () => void; }

export function AddServiceDialog({ onServiceAdded }: AddServiceDialogProps) {
  const [open, setOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [serviceDetails, setServiceDetails] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (open) {
      getCategories().then(setCategories).catch(() => toast.error("Erro ao carregar categorias."));
    }
  }, [open]);

  const handleSubmit = async () => {
    
    if (!customerName || !itemDescription) {
      toast.error('Nome do cliente e descrição são obrigatórios.');
      return;
    }
    try {
      await addService({
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_address: customerAddress,
        customer_email: customerEmail,
        item_description: itemDescription,
        service_details: serviceDetails,
        price: price ? parseFloat(price) : 0, 
        category_id: categoryId ? parseInt(categoryId) : null,
      });
      toast.success('Serviço adicionado!');
      
      setCustomerName(''); setCustomerPhone(''); setCustomerAddress('');
      setCustomerEmail(''); setItemDescription(''); setServiceDetails('');
      setPrice(''); setCategoryId('');

      setOpen(false);
      onServiceAdded();
    } catch (error) {
      toast.error("Erro ao adicionar.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button>Adicionar Novo Serviço</Button></DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader><DialogTitle>Nova Ordem de Serviço</DialogTitle></DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Cliente *</Label>
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
            <Label className="text-right">Item *</Label>
            <Input value={itemDescription} onChange={(e) => setItemDescription(e.target.value)} className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">Detalhes</Label>
            <Textarea value={serviceDetails} onChange={(e) => setServiceDetails(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Preço (R$)</Label>
            <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="col-span-3" placeholder="0.00" />
          </div>
        </div>
        <DialogFooter><Button type="submit" onClick={handleSubmit}>Salvar</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}