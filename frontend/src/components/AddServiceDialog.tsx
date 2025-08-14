// src/components/AddServiceDialog.tsx

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addService } from '@/api/services';

// Nosso componente vai receber uma função para ser chamada quando um serviço for adicionado.
interface AddServiceDialogProps {
  onServiceAdded: () => void;
}

export function AddServiceDialog({ onServiceAdded }: AddServiceDialogProps) {
  const [open, setOpen] = useState(false);
  // Criamos um estado para cada campo do formulário.
  const [customerName, setCustomerName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async () => {
    // Validação simples
    if (!customerName || !itemDescription || !price) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    try {
      // Chamamos nossa função da API para adicionar o serviço
      await addService({
        customer_name: customerName,
        item_description: itemDescription,
        price: parseFloat(price),
      });
      // Se deu tudo certo, limpamos os campos, fechamos o modal e avisamos o App.tsx
      setCustomerName('');
      setItemDescription('');
      setPrice('');
      setOpen(false);
      onServiceAdded(); // ESSA É A LINHA QUE "AVISA" PARA ATUALIZAR A TABELA!
    } catch (error) {
      console.error("Erro ao adicionar serviço:", error);
      alert("Não foi possível adicionar o serviço. Tente novamente.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Adicionar Novo Serviço</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Ordem de Serviço</DialogTitle>
          <DialogDescription>
            Preencha os dados do novo serviço. O status inicial será "Pendente".
          </DialogDescription>
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
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Salvar Serviço</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}