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
    status: 'Em Orçamento' | 'Aguardando Aprovação' | 'Pendente' | 'Em Manutenção' | 'Aguardando Peça' | 'Peça Indisponível' | 'Pronto' | 'Concluído' | 'Cancelado';
    created_at: string;
    finished_at?: string | null;
    category_id: number | null;
    category_name: string | null;
}

export interface ProductivityData {
    date: string;
    total: number;
    concluidos: number;
    prontos: number;
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

export const getProductivityData = async (): Promise<ProductivityData[]> => {
    const response = await fetch(`${API_URL}/dashboard/productivity`);
    if (!response.ok) throw new Error('Failed to fetch productivity data');
    const result = await response.json();
    return result.data;
};

export const getServices = async (page = 1, limit = 10): Promise<PaginatedServicesResponse> => {
    const response = await fetch(`${API_URL}/services?page=${page}&limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch services');
    const result = await response.json();
    // Retorno o objeto completo (result) e não apenas result.data, 
    // pois preciso do objeto 'meta' para a paginação no frontend.
    return result; 
};

type CreateServiceDTO = Omit<ServiceOrder, 'id' | 'status' | 'created_at' | 'receipt_number' | 'category_name' | 'finished_at'>;

export const addService = async (service: CreateServiceDTO): Promise<ServiceOrder> => {
  const response = await fetch(`${API_URL}/services`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(service),
  });
  if (!response.ok) throw new Error('Failed to create service');
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