import { Injectable, Logger, Inject } from '@nestjs/common';
import { OrderRepository } from '../../domain/repositories/order.repository';
import { OrderEntity, OrderStatus } from '../../domain/entities/order.entity';
import { OrderExistsException } from '../../common/exceptions/order-exists.exception';
import { DynamoDBConnectionException, DynamoDBErrorCode } from '../../common/exceptions/dynamodb-connection.exception';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,
  ) {}

  async createOrder(order: OrderEntity): Promise<OrderEntity> {
    this.logger.log(`Creando orden con ID: ${order.id}`);

    const orderExists = await this.orderRepository.exists(order.id);
    if (orderExists) {
      this.logger.warn(`Orden con ID ${order.id} ya existe`);
      throw new OrderExistsException(order.id);
    }

    try {
      const createdOrder = await this.orderRepository.create(order);
      this.logger.log(`Orden ${createdOrder.id} creada exitosamente`);
      return createdOrder;
    } catch (error) {
      this.logger.error(`Error al crear orden ${order.id}: ${error.message}`, error.stack);
      if (error instanceof DynamoDBConnectionException) {
        throw error;
      }
      throw DynamoDBConnectionException.forConnectionFailure(error as Error);
    }
  }

  async getOrder(id: string): Promise<OrderEntity | null> {
    this.logger.log(`Obteniendo orden con ID: ${id}`);

    try {
      const order = await this.orderRepository.findById(id);
      if (!order) {
        this.logger.warn(`Orden con ID ${id} no encontrada`);
        return null;
      }
      this.logger.log(`Orden ${id} encontrada`);
      return order;
    } catch (error) {
      this.logger.error(`Error al obtener orden ${id}: ${error.message}`, error.stack);
      if (error instanceof DynamoDBConnectionException) {
        throw error;
      }
      throw DynamoDBConnectionException.forConnectionFailure(error as Error);
    }
  }

  async updateOrder(id: string, updateData: Partial<OrderEntity>): Promise<OrderEntity> {
    this.logger.log(`Actualizando orden con ID: ${id}`);

    const existingOrder = await this.orderRepository.findById(id);
    if (!existingOrder) {
      this.logger.warn(`Orden con ID ${id} no encontrada para actualizar`);
      return null;
    }

    try {
      const updatedOrder = await this.orderRepository.update(id, updateData);
      this.logger.log(`Orden ${id} actualizada exitosamente`);
      return updatedOrder;
    } catch (error) {
      this.logger.error(`Error al actualizar orden ${id}: ${error.message}`, error.stack);
      if (error instanceof DynamoDBConnectionException) {
        throw error;
      }
      throw DynamoDBConnectionException.forConnectionFailure(error as Error);
    }
  }

  async deleteOrder(id: string): Promise<void> {
    this.logger.log(`Eliminando orden con ID: ${id}`);

    const existingOrder = await this.orderRepository.findById(id);
    if (!existingOrder) {
      this.logger.warn(`Orden con ID ${id} no encontrada para eliminar`);
      return;
    }

    try {
      await this.orderRepository.delete(id);
      this.logger.log(`Orden ${id} eliminada exitosamente`);
    } catch (error) {
      this.logger.error(`Error al eliminar orden ${id}: ${error.message}`, error.stack);
      if (error instanceof DynamoDBConnectionException) {
        throw error;
      }
      throw DynamoDBConnectionException.forConnectionFailure(error as Error);
    }
  }

  async getOrdersByStatus(status: OrderStatus): Promise<OrderEntity[]> {
    this.logger.log(`Obteniendo órdenes con estado: ${status}`);

    try {
      const orders = await this.orderRepository.findByStatus(status);
      this.logger.log(`Se encontraron ${orders.length} órdenes con estado ${status}`);
      return orders;
    } catch (error) {
      this.logger.error(`Error al obtener órdenes por estado ${status}: ${error.message}`, error.stack);
      if (error instanceof DynamoDBConnectionException) {
        throw error;
      }
      throw DynamoDBConnectionException.forConnectionFailure(error as Error);
    }
  }
}