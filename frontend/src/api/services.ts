const API_URL = 'http://localhost:3001/api';

// Criei uma interface para o formato de uma Categoria.
export interface Category {
    id: number;
    name: string;
}

// Atualizei a ServiceOrder para incluir os novos campos.
// Usei `?` e `| null` para indicar que um serviço pode não ter uma categoria associada.
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
    status: 'Pendente' | 'Em Andamento' | 'Concluído' | 'Cancelado';
    created_at: string;
    category_id: number | null;
    category_name: string | null;
}

export interface PaginatedServicesResponse { data: ServiceOrder[]; meta: { total: number; page: number; limit: number; totalPages: number; } }

// Esta é a nova função para buscar a lista de categorias.
// Ela vai popular nossos dropdowns.
export const getCategories = async (): Promise<Category[]> => {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) { throw new Error('Falha ao buscar as categorias.'); }
    const result = await response.json();
    return result.data;
};

export const getServices = async (page = 1, limit = 10): Promise<PaginatedServicesResponse> => {
    const response = await fetch(`${API_URL}/services?page=${page}&limit=${limit}`);
    if (!response.ok) { throw new Error('Falha ao buscar os serviços da API.'); }
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
  if (!response.ok) { throw new Error('Falha ao adicionar o serviço.'); }
  const result = await response.json();
  return result.data;
};

export const updateService = async (id: number, serviceData: Partial<CreateServiceDTO>): Promise<void> => {
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