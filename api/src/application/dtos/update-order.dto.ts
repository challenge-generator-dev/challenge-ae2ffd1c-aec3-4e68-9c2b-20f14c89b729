import { IsString, IsOptional, IsEnum, IsNumber, Min, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { OrderStatus } from '../../domain/entities/order.entity';

export class UpdateOrderProductDto {
  @ApiPropertyOptional({ description: 'Identificador del producto' })
  @IsOptional()
  @IsString()
  productId?: string;

  @ApiPropertyOptional({ description: 'Cantidad del producto' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;

  @ApiPropertyOptional({ description: 'Precio unitario del producto' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  unitPrice?: number;
}

export class UpdateOrderDto {
  @ApiPropertyOptional({ 
    description: 'Estado de la orden', 
    enum: OrderStatus,
    example: OrderStatus.CONFIRMED
  })
  @IsOptional()
  @IsEnum(OrderStatus, { message: 'Estado de orden inválido' })
  status?: OrderStatus;

  @ApiPropertyOptional({ 
    description: 'Lista de productos en la orden',
    type: [UpdateOrderProductDto]
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateOrderProductDto)
  products?: UpdateOrderProductDto[];

  @ApiPropertyOptional({ description: 'Notas adicionales de la orden' })
  @IsOptional()
  @IsString()
  notes?: string;
}