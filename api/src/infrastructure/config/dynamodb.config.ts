import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';

@Injectable()
export class DynamoDbConfig implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DynamoDbConfig.name);
  private client: DynamoDBClient | null = null;

  private readonly region: string;
  private readonly endpoint: string | undefined;
  private readonly accessKeyId: string | undefined;
  private readonly secretAccessKey: string | undefined;

  constructor() {
    this.region = process.env.AWS_REGION || 'us-east-1';
    this.endpoint = process.env.DYNAMODB_ENDPOINT;
    this.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    this.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    this.logger.debug(`Configuración de DynamoDB - Región: ${this.region}`);
    if (this.endpoint) {
      this.logger.debug(`Endpoint personalizado: ${this.endpoint}`);
    }
  }

  async onModuleInit(): Promise<void> {
    try {
      this.client = this.createClient();
      this.logger.log('Configuración de DynamoDB inicializada correctamente');
    } catch (error) {
      this.logger.error('Error al inicializar la configuración de DynamoDB', error);
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client) {
      this.client.destroy();
      this.logger.log('Conexión a DynamoDB cerrada correctamente');
    }
  }

  private createClient(): DynamoDBClient {
    const clientConfig: DynamoDBClientConfig = {
      region: this.region,
    };

    if (this.endpoint) {
      clientConfig.endpoint = this.endpoint;
      this.logger.debug('Usando endpoint personalizado para DynamoDB local');
    }

    if (this.accessKeyId && this.secretAccessKey) {
      clientConfig.credentials = {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      };
      this.logger.debug('Credenciales de AWS proporcionadas');
    }

    const client = new DynamoDBClient(clientConfig);
    this.logger.log(`Cliente DynamoDB creado para la región: ${this.region}`);
    return client;
  }

  getClient(): DynamoDBClient {
    if (!this.client) {
      this.logger.error('Cliente de DynamoDB no inicializado. Asegúrese de que onModuleInit fue llamado.');
      throw new Error('Cliente de DynamoDB no disponible. La conexión no ha sido establecida.');
    }
    return this.client;
  }

  getTableName(): string {
    const tableName = process.env.DYNAMODB_TABLE_ORDERS || 'orders';
    this.logger.debug(`Nombre de tabla configurado: ${tableName}`);
    return tableName;
  }

  isLocalMode(): boolean {
    return !!this.endpoint;
  }
}