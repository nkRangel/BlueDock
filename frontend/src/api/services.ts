// Detecta IP dinâmico para acesso via rede local
const API_URL = `http://${window.location.hostname}:3001/api`;

export interface Category { id: number; name: string; }

export interface ServiceOrder {
    id: number;
    receipt_number: string;
    customer_name: string;
    customer_phone?: string;
    customer_address?: string;
    customer_email?: string;
    item_description: string;
    service_details?: string;
    price: number;
    status: 'Orçamento Enviado' | 'Aguardando Aprovação' | 'Pendente' | 'Em Andamento' | 'Aguardando Peça' | 'Pronto' | 'Concluído' | 'Cancelado';
    created_at: string;
    category_id: number | null;
    category_name: string | null;
}

export interface PaginatedServicesResponse { 
    data: ServiceOrder[]; 
    meta: { total: number; page: number; limit: number; totalPages: number; } 
}

export const getCategories = async (): Promise<Category[]> => {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    const result = await response.json();
    return result.data;
};

export const getServices = async (page = 1, limit = 10): Promise<PaginatedServicesResponse> => {
    const response = await fetch(`${API_URL}/services?page=${page}&limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch services');
    const result = await response.json();
    return result;
};

type CreateServiceDTO = Omit<ServiceOrder, 'id' | 'status' | 'created_at' | 'receipt_number' | 'category_name'>;

export const addService = async (service: CreateServiceDTO): Promise<ServiceOrder> => {
  const response = await fetch(`${API_URL}/services`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(service),
  });
  if (!response.ok) throw new Error('Failed to add service');
  const result = await response.json();
  return result.data;
};

export const updateService = async (id: number, serviceData: Partial<CreateServiceDTO> & { status?: string }): Promise<void> => {
  await fetch(`${API_URL}/services/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(serviceData),
  });
};

export const deleteService = async (id: number): Promise<void> => {
  await fetch(`${API_URL}/services/${id}`, { method: 'DELETE' });
};