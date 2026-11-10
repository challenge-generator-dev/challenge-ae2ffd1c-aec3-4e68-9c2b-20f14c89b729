import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import {
  DynamoDBDocumentClient,
  GetCommand,
  BatchGetCommand,
} from '@aws-sdk/lib-dynamodb';
import { CatalogRepository } from '../../domain/repositories/catalog.repository';
import { CatalogProduct } from '../../domain/repositories/catalog-product.interface';
import { DynamoDbConfig } from '../config/dynamodb.config';

@Injectable()
export class CatalogRepositoryImpl
  implements CatalogRepository, OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(CatalogRepositoryImpl.name);
  private docClient: DynamoDBDocumentClient;
  private readonly tableName: string;

  constructor(private readonly dynamoDbConfig: DynamoDbConfig) {
    this.tableName = this.dynamoDbConfig.getTableName();
  }

  async onModuleInit(): Promise<void> {
    this.docClient = DynamoDBDocumentClient.from(
      this.dynamoDbConfig.getClient(),
      {
        marshallOptions: {
          removeUndefinedValues: true,
          convertClassInstanceToMap: true,
        },
        unmarshallOptions: {
          wrapNumbers: false,
        },
      },
    );
    this.logger.log('CatalogRepositoryImpl inicializado correctamente');
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('CatalogRepositoryImpl destruido');
  }

  async exists(productId: string): Promise<boolean> {
    try {
      const result = await this.docClient.send(
        new GetCommand({
          TableName: this.tableName,
          Key: { id: productId },
          ProjectionExpression: 'id',
        }),
      );
      return !!result.Item;
    } catch (error) {
      this.logger.error(
        `Error al verificar existencia del producto ${productId}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  async existsMany(productIds: string[]): Promise<Map<string, boolean>> {
    const resultMap = new Map<string, boolean>();

    if (!productIds || productIds.length === 0) {
      return resultMap;
    }

    try {
      const keys = productIds.map((id) => ({ id }));
      const chunks = this.chunkArray(keys, 100);

      for (const chunk of chunks) {
        const result = await this.docClient.send(
          new BatchGetCommand({
            RequestItems: {
              [this.tableName]: {
                Keys: chunk,
                ProjectionExpression: 'id',
              },
            },
          }),
        );

        const foundIds = new Set<string>();
        const responses = result.Responses?.[this.tableName] || [];
        for (const item of responses) {
          if (item.id) {
            foundIds.add(item.id as string);
          }
        }

        for (const id of chunk) {
          resultMap.set(id.id as string, foundIds.has(id.id as string));
        }
      }

      for (const productId of productIds) {
        if (!resultMap.has(productId)) {
          resultMap.set(productId, false);
        }
      }

      return resultMap;
    } catch (error) {
      this.logger.error(
        `Error al verificar existencia de múltiples productos`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  async findById(productId: string): Promise<CatalogProduct | null> {
    try {
      const result = await this.docClient.send(
        new GetCommand({
          TableName: this.tableName,
          Key: { id: productId },
        }),
      );

      if (!result.Item) {
        this.logger.warn(`Producto ${productId} no encontrado en el catálogo`);
        return null;
      }

      return this.mapToCatalogProduct(result.Item as Record<string, unknown>);
    } catch (error) {
      this.logger.error(
        `Error al buscar producto ${productId} en el catálogo`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  private mapToCatalogProduct(item: Record<string, unknown>): CatalogProduct {
    return {
      id: item.id as string,
      name: item.name as string,
      description: item.description as string | undefined,
      price: item.price as number,
      category: item.category as string | undefined,
      inStock: (item.inStock as boolean) ?? false,
      quantity: item.quantity as number | undefined,
      createdAt: item.createdAt
        ? new Date(item.createdAt as string)
        : undefined,
      updatedAt: item.updatedAt
        ? new Date(item.updatedAt as string)
        : undefined,
    };
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}