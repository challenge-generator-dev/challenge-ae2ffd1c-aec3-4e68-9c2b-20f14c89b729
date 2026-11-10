import { v4 as uuidv4 } from 'uuid';

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  CONFIRMED = 'CONFIRMED'
}

export class OrderProduct {
  constructor(
    public readonly productId: string,
    public readonly name: string,
    public readonly price: number,
    public readonly quantity: number
  ) {}
}

export class OrderEntity {
  public readonly id: string;
  public readonly createdAt: Date;
  public status: OrderStatus;
  public readonly products: OrderProduct[];

  constructor(
    id: string | null,
    status: OrderStatus,
    products: OrderProduct[],
    createdAt?: Date
  ) {
    this.id = id || uuidv4();
    this.status = status;
    this.products = products;
    this.createdAt = createdAt || new Date();
  }

  public calculateTotal(): number {
    return this.products.reduce((total, product) => total + (product.price * product.quantity), 0);
  }

  public updateStatus(newStatus: OrderStatus): void {
    if (!Object.values(OrderStatus).includes(newStatus)) {
      throw new Error(`Invalid status: ${newStatus}`);
    }
    this.status = newStatus;
  }

  public toPartialEntity(): Partial<OrderEntity> {
    return {
      id: this.id,
      status: this.status,
      products: this.products,
      createdAt: this.createdAt
    };
  }
}