export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderProduct {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderEntity {
  id: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
  products: OrderProduct[];
  totalAmount: number;
  customerEmail?: string;
  customerName?: string;
}

export interface CreateOrderDto {
  id: string;
  status?: OrderStatus;
  products: Array<{
    productId: string;
    quantity: number;
  }>;
  customerEmail?: string;
  customerName?: string;
}

export interface UpdateOrderDto {
  status?: OrderStatus;
  products?: Array<{
    productId: string;
    quantity: number;
  }>;
  customerEmail?: string;
  customerName?: string;
}

export interface OrdersListResponse {
  orders: OrderEntity[];
  total: number;
}

export interface OrderFilters {
  status?: OrderStatus;
  customerEmail?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export function calculateTotalAmount(products: OrderProduct[]): number {
  return products.reduce((total, product) => {
    return total + product.quantity * product.unitPrice;
  }, 0);
}

export function isValidOrderStatus(status: string): status is OrderStatus {
  const validStatuses: OrderStatus[] = [
    'PENDING',
    'CONFIRMED',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
  ];
  return validStatuses.includes(status as OrderStatus);
}

export function canTransitionStatus(
  currentStatus: OrderStatus,
  newStatus: OrderStatus
): boolean {
  const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
    PENDING: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['SHIPPED', 'CANCELLED'],
    SHIPPED: ['DELIVERED', 'CANCELLED'],
    DELIVERED: [],
    CANCELLED: [],
  };
  
  return allowedTransitions[currentStatus]?.includes(newStatus) ?? false;
}