import { Module } from '@nestjs/common';
import { OrderController } from './infrastructure/controllers/order.controller';
import { OrderRepositoryImpl } from './infrastructure/repositories/order.repository.impl';
import { DynamoDbConfig as DynamodbConfig } from './infrastructure/config/dynamodb.config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { CatalogRepositoryImpl } from './infrastructure/repositories/catalog.repository.impl';

@Module({
  imports: [],
  controllers: [OrderController],
  providers: [
    {
      provide: 'OrderRepository',
      useClass: OrderRepositoryImpl,
    },
    {
      provide: 'CatalogRepository',
      useClass: CatalogRepositoryImpl,
    },
    DynamodbConfig,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
  exports: ['OrderRepository', 'CatalogRepository'],
})
export class AppModule {}