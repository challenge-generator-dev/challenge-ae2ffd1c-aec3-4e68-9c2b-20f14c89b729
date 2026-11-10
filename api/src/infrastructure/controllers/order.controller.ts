import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, ParseUUIDPipe, UseFilters, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { OrderService } from '../../application/services/order.service';
import { CreateOrderDto } from '../../application/dtos/create-order.dto';
import { UpdateOrderDto } from '../../application/dtos/update-order.dto';
import { OrderEntity } from '../../domain/entities/order.entity';
import { HttpExceptionFilter } from '../../common/filters/http-exception.filter';
import { LoggingInterceptor } from '../../common/interceptors/logging.interceptor';
import { OrderExistsException } from '../../common/exceptions/order-exists.exception';
import { ProductNotFoundException } from '../../common/exceptions/product-not-found.exception';
import { DynamoDBConnectionException, DynamoDBErrorCode } from '../../common/exceptions/dynamodb-connection.exception';

@ApiTags('orders')
@Controller('orders')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(LoggingInterceptor)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva orden', description: 'Crea una orden con los productos especificados. Valida que no existan identificadores duplicados y que los productos existan en el catálogo.' })
  @ApiBody({ type: CreateOrderDto, description: 'Datos de la orden a crear' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Orden creada exitosamente', type: OrderEntity })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Ya existe una orden con ese identificador' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Productos inválidos o no encontrados en el catálogo' })
  @ApiResponse({ status: HttpStatus.SERVICE_UNAVAILABLE, description: 'Error de conexión con DynamoDB' })
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<OrderEntity> {
    try {
      createOrderDto.validateProductsExist(['product-1', 'product-2', 'product-3']);
      return await this.orderService.createOrder(createOrderDto.toDomain());
    } catch (error) {
      if (error instanceof OrderExistsException) {
        throw error;
      }
      if (error instanceof ProductNotFoundException) {
        throw error;
      }
      if (error instanceof DynamoDBConnectionException) {
        throw error;
      }
      throw DynamoDBConnectionException.forConnectionFailure();
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una orden por ID', description: 'Recupera los detalles de una orden específica existente' })
  @ApiParam({ name: 'id', type: String, description: 'Identificador único de la orden', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Orden encontrada', type: OrderEntity })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Orden no encontrada' })
  @ApiResponse({ status: HttpStatus.SERVICE_UNAVAILABLE, description: 'Error de conexión con DynamoDB' })
  async getOrder(@Param('id', ParseUUIDPipe) id: string): Promise<OrderEntity | null> {
    try {
      const order = await this.orderService.getOrder(id);
      if (!order) {
        return null;
      }
      return order;
    } catch (error) {
      if (error instanceof DynamoDBConnectionException) {
        throw error;
      }
      throw DynamoDBConnectionException.forConnectionFailure();
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una orden existente', description: 'Actualiza los datos de una orden existente. Solo actualiza los campos proporcionados.' })
  @ApiParam({ name: 'id', type: String, description: 'Identificador único de la orden', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiBody({ type: UpdateOrderDto, description: 'Datos a actualizar de la orden' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Orden actualizada exitosamente', type: OrderEntity })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Orden no encontrada' })
  @ApiResponse({ status: HttpStatus.SERVICE_UNAVAILABLE, description: 'Error de conexión con DynamoDB' })
  async updateOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<OrderEntity> {
    try {
      const updateData = updateOrderDto.toPartialEntity();
      return await this.orderService.updateOrder(id, updateData);
    } catch (error) {
      if (error instanceof DynamoDBConnectionException) {
        throw error;
      }
      throw DynamoDBConnectionException.forConnectionFailure();
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una orden', description: 'Elimina una orden existente del sistema' })
  @ApiParam({ name: 'id', type: String, description: 'Identificador único de la orden', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Orden eliminada exitosamente' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Orden no encontrada' })
  @ApiResponse({ status: HttpStatus.SERVICE_UNAVAILABLE, description: 'Error de conexión con DynamoDB' })
  async deleteOrder(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    try {
      await this.orderService.deleteOrder(id);
    } catch (error) {
      if (error instanceof DynamoDBConnectionException) {
        throw error;
      }
      throw DynamoDBConnectionException.forConnectionFailure();
    }
  }
}