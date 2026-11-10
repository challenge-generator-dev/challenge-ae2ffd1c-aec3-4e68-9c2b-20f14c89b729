import axios, { AxiosInstance, AxiosError } from 'axios';
import { OrderEntity, CreateOrderDto, UpdateOrderDto } from '@/types/order';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class OrderService {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_BASE_URL}/orders`,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response) {
          const status = error.response.status;
          const data = error.response.data as { message?: string };
          
          switch (status) {
            case 400:
              throw new Error(data.message || 'Solicitud inválida');
            case 404:
              throw new Error(data.message || 'Orden no encontrada');
            case 409:
              throw new Error(data.message || 'Conflicto: la orden ya existe');
            case 500:
              throw new Error(data.message || 'Error interno del servidor');
            default:
              throw new Error(data.message || 'Error al procesar la orden');
          }
        } else if (error.request) {
          throw new Error('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
        } else {
          throw new Error('Error al configurar la solicitud');
        }
      }
    );
  }

  async getAllOrders(): Promise<OrderEntity[]> {
    const response = await this.client.get<OrderEntity[]>('/');
    return response.data;
  }

  async getOrderById(id: string): Promise<OrderEntity> {
    const response = await this.client.get<OrderEntity>(`/${id}`);
    return response.data;
  }

  async createOrder(data: CreateOrderDto): Promise<OrderEntity> {
    this.validateOrderData(data);
    
    const orderData = {
      ...data,
      createdAt: new Date().toISOString(),
      status: data.status || 'pending'
    };
    
    const response = await this.client.post<OrderEntity>('/', orderData);
    return response.data;
  }

  async updateOrder(id: string, data: UpdateOrderDto): Promise<OrderEntity> {
    if (!id || id.trim() === '') {
      throw new Error('El ID de la orden es requerido');
    }
    
    this.validateUpdateData(data);
    
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    const response = await this.client.put<OrderEntity>(`/${id}`, updateData);
    return response.data;
  }

  async deleteOrder(id: string): Promise<void> {
    if (!id || id.trim() === '') {
      throw new Error('El ID de la orden es requerido');
    }
    
    await this.client.delete(`/${id}`);
  }

  private validateOrderData(data: CreateOrderDto): void {
    if (!data.id || data.id.trim() === '') {
      throw new Error('El ID de la orden es requerido');
    }
    
    if (!data.products || !Array.isArray(data.products) || data.products.length === 0) {
      throw new Error('La orden debe contener al menos un producto');
    }
    
    for (const product of data.products) {
      if (!product.id || !product.name || !product.price || !product.quantity) {
        throw new Error('Cada producto debe tener id, nombre, precio y cantidad');
      }
      
      if (product.price < 0) {
        throw new Error('El precio del producto no puede ser negativo');
      }
      
      if (product.quantity <= 0) {
        throw new Error('La cantidad del producto debe ser mayor a cero');
      }
    }
  }

  private validateUpdateData(data: UpdateOrderDto): void {
    if (data.status && !['pending', 'processing', 'completed', 'cancelled'].includes(data.status)) {
      throw new Error('Estado inválido. Estados permitidos: pending, processing, completed, cancelled');
    }
    
    if (data.products && (!Array.isArray(data.products) || data.products.length === 0)) {
      throw new Error('La orden debe contener al menos un producto');
    }
    
    if (data.products) {
      for (const product of data.products) {
        if (product.price !== undefined && product.price < 0) {
          throw new Error('El precio del producto no puede ser negativo');
        }
        
        if (product.quantity !== undefined && product.quantity <= 0) {
          throw new Error('La cantidad del producto debe ser mayor a cero');
        }
      }
    }
  }
}

export const orderService = new OrderService();