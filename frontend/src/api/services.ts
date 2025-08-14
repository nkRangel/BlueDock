// frontend/src/api/services.ts

// Centralizei a URL da API aqui. Se um dia ela mudar, só preciso alterar neste local.
const API_URL = 'http://localhost:3001/api';

// A interface ServiceOrder funciona como um "contrato" de dados entre o front e o back.
// O TypeScript me ajuda a garantir que os dados estejam sempre no formato esperado.
export interface ServiceOrder {
    id: number;
    receipt_number: string;
    customer_name: string;
    item_description: string;
    price: number;
    status: 'Pendente' | 'Em Andamento' | 'Concluído' | 'Cancelado';
    created_at: string;
}

// Usei async/await com fetch, que é a forma moderna de lidar com requisições assíncronas em JS.
export const getServices = async (): Promise<ServiceOrder[]> => {
    const response = await fetch(`${API_URL}/services`);
    if (!response.ok) {
        throw new Error('Falha ao buscar os serviços da API.');
    }
    const result = await response.json();
    return result.data;
};

// Um DTO (Data Transfer Object) para a criação, omitindo campos que são gerados pelo backend.
type CreateServiceDTO = Omit<ServiceOrder, 'id' | 'status' | 'created_at' | 'receipt_number'>;

export const addService = async (service: CreateServiceDTO): Promise<ServiceOrder> => {
  const response = await fetch(`${API_URL}/services`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(service),
  });
  if (!response.ok) { throw new Error('Falha ao adicionar o serviço.'); }
  const result = await response.json();
  return result.data;
};

// O Partial<ServiceOrder> no update é útil para enviar apenas os campos que foram alterados.
export const updateService = async (id: number, serviceData: Partial<ServiceOrder>): Promise<void> => {
  await fetch(`${API_URL}/services/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(serviceData),
  });
};

export const deleteService = async (id: number): Promise<void> => {
  await fetch(`${API_URL}/services/${id}`, {
    method: 'DELETE',
  });
};