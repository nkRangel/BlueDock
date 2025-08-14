// src/components/EditServiceDialog.tsx

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Novo componente!
import { ServiceOrder, updateService } from '@/api/services';

// O componente agora precisa saber QUAL serviço editar e o que fazer depois.
interface EditServiceDialogProps {
  service: ServiceOrder;
  onServiceUpdated: () => void;
}

export function EditServiceDialog({ service, onServiceUpdated }: EditServiceDialogProps) {
  const [open, setOpen] = useState(false);
  // Os estados agora começam com os valores do serviço que recebemos!
  const [customerName, setCustomerName] = useState(service.customer_name);
  const [itemDescription, setItemDescription] = useState(service.item_description);
  const [price, setPrice] = useState(service.price.toString());
  const [status, setStatus] = useState<ServiceOrder['status']>(service.status);

  // Este useEffect garante que se o mesmo modal for usado para outro serviço, os dados sejam atualizados.
  useEffect(() => {
    setCustomerName(service.customer_name);
    setItemDescription(service.item_description);
    setPrice(service.price.toString());
    setStatus(service.status);
  }, [service]);

  const handleSubmit = async () => {
    try {
      await updateService(service.id, {
        customer_name: customerName,
        item_description: itemDescription,
        price: parseFloat(price),
        status: status,
      });
      setOpen(false);
      onServiceUpdated(); // Avisa o App.tsx para atualizar a tabela
    } catch (error) {
      console.error("Erro ao atualizar serviço:", error);
      alert("Não foi possível atualizar o serviço.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Editar</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Ordem de Serviço #{service.id}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="customerName" className="text-right">Cliente</Label>
            <Input id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="itemDescription" className="text-right">Item/Serviço</Label>
            <Input id="itemDescription" value={itemDescription} onChange={(e) => setItemDescription(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">Preço (R$)</Label>
            <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Status</Label>
            {/* Usamos o componente Select do shadcn para mudar o status! */}
            <Select value={status} onValueChange={(value) => setStatus(value as ServiceOrder['status'])}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                <SelectItem value="Concluído">Concluído</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Salvar Alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}