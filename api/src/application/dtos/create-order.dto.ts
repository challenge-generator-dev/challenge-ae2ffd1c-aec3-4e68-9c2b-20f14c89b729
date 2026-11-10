import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../../domain/entities/order.entity';

class OrderProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Product ID is required' })
  productId: string;

  @IsNumber()
  @IsPositive({ message: 'Quantity must be a positive number' })
  quantity: number;
}

export class CreateOrderDto {
  @IsEnum(OrderStatus, { message: 'Status must be a valid order status' })
  status: OrderStatus;

  @IsArray({ message: 'Products must be an array' })
  @ValidateNested({ each: true })
  @Type(() => OrderProductDto)
  products: OrderProductDto[];

  public toDomain(): { status: OrderStatus; products: { productId: string; quantity: number }[] } {
    return {
      status: this.status,
      products: this.products.map(product => ({
        productId: product.productId,
        quantity: product.quantity
      }))
    };
  }

  public validateProductsExist(catalogProducts: string[]): void {
    const invalidProducts = this.products.filter(
      product => !catalogProducts.includes(product.productId)
    );
    if (invalidProducts.length > 0) {
      throw new Error(`Products not found in catalog: ${invalidProducts.map(p => p.productId).join(', ')}`);
    }
  }
}