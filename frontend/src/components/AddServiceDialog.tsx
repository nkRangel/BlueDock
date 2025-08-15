import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addService, getCategories, Category } from '@/api/services';
import { toast } from "sonner";

interface AddServiceDialogProps { onServiceAdded: () => void; }

export function AddServiceDialog({ onServiceAdded }: AddServiceDialogProps) {
  const [open, setOpen] = useState(false);
  // Estados para todos os campos do formulário
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [serviceDetails, setServiceDetails] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState(''); // Estado para o ID da categoria selecionada
  const [categories, setCategories] = useState<Category[]>([]); // Estado para a lista de categorias

  // Usei o useEffect para buscar a lista de categorias assim que o modal for aberto.
  useEffect(() => {
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
  }, [open]); // A dependência [open] garante que isso rode toda vez que o modal abrir.

  const handleSubmit = async () => {
    if (!customerName || !itemDescription || !price) {
      toast.error('Nome do cliente, descrição e preço são obrigatórios.');
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
        price: parseFloat(price),
        category_id: categoryId ? parseInt(categoryId) : null, // Envio o ID da categoria
      });
      toast.success('Serviço adicionado com sucesso!');
      setOpen(false);
      onServiceAdded();
    } catch (error) {
      toast.error("Não foi possível adicionar o serviço.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button>Adicionar Novo Serviço</Button></DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader><DialogTitle>Adicionar Nova Ordem de Serviço</DialogTitle></DialogHeader>
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
          
          {/* --- NOVO CAMPO DE CATEGORIA --- */}
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
            <Textarea id="serviceDetails" value={serviceDetails} onChange={(e) => setServiceDetails(e.target.value)} className="col-span-3" placeholder="Detalhes completos do serviço..." />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">Preço (R$)</Label>
            <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter><Button type="submit" onClick={handleSubmit}>Salvar Serviço</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}