import { OrderEntity } from '../entities/order.entity';
import { OrderStatus } from '../entities/order.entity';

export interface OrderRepository {
  create(order: OrderEntity): Promise<OrderEntity>;
  findById(id: string): Promise<OrderEntity | null>;
  update(id: string, order: Partial<OrderEntity>): Promise<OrderEntity>;
  delete(id: string): Promise<void>;
  findByStatus(status: OrderStatus): Promise<OrderEntity[]>;
  exists(id: string): Promise<boolean>;
}