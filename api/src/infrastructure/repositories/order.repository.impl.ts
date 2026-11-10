import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, DeleteCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { OrderRepository } from '../../domain/repositories/order.repository';
import { OrderEntity, OrderStatus, OrderProduct } from '../../domain/entities/order.entity';
import { DynamoDbConfig } from '../config/dynamodb.config';

@Injectable()
export class OrderRepositoryImpl implements OrderRepository, OnModuleInit {
  private readonly logger = new Logger(OrderRepositoryImpl.name);
  private docClient: DynamoDBDocumentClient;
  private readonly tableName = process.env.DYNAMODB_TABLE_ORDERS || 'orders';

  constructor(private readonly dynamoDbConfig: DynamoDbConfig) {}

  async onModuleInit(): Promise<void> {
    try {
      const client = this.dynamoDbConfig.getClient();
      this.docClient = DynamoDBDocumentClient.from(client, {
        marshallOptions: {
          removeUndefinedValues: true,
          convertClassInstanceToMap: true,
        },
      });
      this.logger.log('Conexión a DynamoDB establecida correctamente');
    } catch (error) {
      this.logger.error('Error al inicializar el cliente de DynamoDB', error);
      throw error;
    }
  }

  private mapToOrderEntity(item: Record<string, unknown>): OrderEntity {
    const products: OrderProduct[] = (item.products as Array<Record<string, unknown>>).map(
      (p) => new OrderProduct(
        p.productId as string,
        p.name as string,
        p.price as number,
        p.quantity as number
      ),
    );

    const order = new OrderEntity(
      item.id as string,
      item.status as OrderStatus,
      products,
      item.createdAt instanceof Date ? item.createdAt : new Date(item.createdAt as string),
    );

    return order;
  }

  private mapToDynamoDbItem(order: OrderEntity): Record<string, unknown> {
    return {
      id: order.id,
      status: order.status,
      createdAt: order.createdAt.toISOString(),
      products: order.products.map((p) => ({
        productId: p.productId,
        name: p.name,
        price: p.price,
        quantity: p.quantity,
      })),
      total: order.calculateTotal(),
    };
  }

  async create(order: OrderEntity): Promise<OrderEntity> {
    try {
      const item = this.mapToDynamoDbItem(order);
      await this.docClient.send(
        new PutCommand({
          TableName: this.tableName,
          Item: item,
          ConditionExpression: 'attribute_not_exists(id)',
        }),
      );
      this.logger.log(`Orden ${order.id} creada exitosamente en DynamoDB`);
      return order;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('ConditionalCheckFailedException')) {
        this.logger.warn(`Intento de crear orden duplicada: ${order.id}`);
        throw new Error('Ya existe una orden con ese identificador');
      }
      this.logger.error(`Error al crear orden ${order.id}`, error);
      throw new Error(`Error al crear la orden: ${errorMessage}`);
    }
  }

  async findById(id: string): Promise<OrderEntity | null> {
    try {
      const result = await this.docClient.send(
        new GetCommand({
          TableName: this.tableName,
          Key: { id },
        }),
      );

      if (!result.Item) {
        this.logger.debug(`Orden ${id} no encontrada`);
        return null;
      }

      this.logger.debug(`Orden ${id} recuperada exitosamente`);
      return this.mapToOrderEntity(result.Item as Record<string, unknown>);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error al buscar orden ${id}`, error);
      throw new Error(`Error al buscar la orden: ${errorMessage}`);
    }
  }

  async update(id: string, orderData: Partial<OrderEntity>): Promise<OrderEntity> {
    try {
      const existingOrder = await this.findById(id);
      if (!existingOrder) {
        throw new Error('Orden no encontrada');
      }

      const updateExpressions: string[] = [];
      const expressionAttributeValues: Record<string, unknown> = {};

      if (orderData.status !== undefined) {
        updateExpressions.push('#status = :status');
        expressionAttributeValues[':status'] = orderData.status;
      }

      if (orderData.products !== undefined) {
        updateExpressions.push('#products = :products');
        expressionAttributeValues[':products'] = orderData.products.map((p) => ({
          productId: p.productId,
          name: p.name,
          price: p.price,
          quantity: p.quantity,
        }));
      }

      if (updateExpressions.length === 0) {
        return existingOrder;
      }

      expressionAttributeValues[':updatedAt'] = new Date().toISOString();
      updateExpressions.push('#updatedAt = :updatedAt');

      const updateExpression = 'SET ' + updateExpressions.join(', ');

      await this.docClient.send(
        new UpdateCommand({
          TableName: this.tableName,
          Key: { id },
          UpdateExpression: updateExpression,
          ExpressionAttributeNames: {
            '#status': 'status',
            '#products': 'products',
            '#updatedAt': 'updatedAt',
          },
          ExpressionAttributeValues: expressionAttributeValues,
          ReturnValues: 'ALL_NEW',
        }),
      );

      this.logger.log(`Orden ${id} actualizada exitosamente`);
      const updatedOrder = await this.findById(id);
      return updatedOrder!;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error al actualizar orden ${id}`, error);
      throw new Error(`Error al actualizar la orden: ${errorMessage}`);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const existingOrder = await this.findById(id);
      if (!existingOrder) {
        throw new Error('Orden no encontrada');
      }

      await this.docClient.send(
        new DeleteCommand({
          TableName: this.tableName,
          Key: { id },
        }),
      );

      this.logger.log(`Orden ${id} eliminada exitosamente`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error al eliminar orden ${id}`, error);
      throw new Error(`Error al eliminar la orden: ${errorMessage}`);
    }
  }

  async findByStatus(status: OrderStatus): Promise<OrderEntity[]> {
    try {
      const result = await this.docClient.send(
        new QueryCommand({
          TableName: this.tableName,
          IndexName: 'status-index',
          KeyConditionExpression: '#status = :status',
          ExpressionAttributeNames: {
            '#status': 'status',
          },
          ExpressionAttributeValues: {
            ':status': status,
          },
        }),
      );

      if (!result.Items || result.Items.length === 0) {
        return [];
      }

      return result.Items.map((item) => this.mapToOrderEntity(item as Record<string, unknown>));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error al buscar órdenes por status ${status}`, error);
      throw new Error(`Error al buscar órdenes por status: ${errorMessage}`);
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const order = await this.findById(id);
      return order !== null;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error al verificar existencia de orden ${id}`, error);
      throw new Error(`Error al verificar existencia: ${errorMessage}`);
    }
  }
}