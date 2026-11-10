# Prompt para Mejorar el Codigo Base

Copia y pega el contenido del bloque de abajo en un asistente de IA (Claude, ChatGPT)
para obtener el proyecto completo y arrancable. Guarda los archivos que te devuelva en la
carpeta del repo, respetando exactamente las rutas.

Si preferis trabajar en tu editor con un agente local (Claude Code, Cursor, Copilot), usa `AGENTS.md` en vez de este archivo: dice lo mismo pero para que escriba los archivos en disco.

## Las dos reglas que no se negocian

1. **Completa el boilerplate.** Todo lo que el proyecto necesita para compilar y arrancar: manifiesto de dependencias, punto de entrada, configuracion, capa de interfaz, y las capas del patron arquitectonico declarado. Eso es andamiaje y es tu trabajo.
2. **NO resuelvas el reto.** Los entregables de las fases son el trabajo de la persona. El hueco pedagogico se deja como esta: el proyecto arranca, pero lo que el reto pide implementar NO esta implementado.

Dicho de otra forma: si algo impide compilar, arreglalo. Si algo es logica de negocio incompleta, validaciones ausentes, un secreto hardcodeado o un patron mejorable, dejalo exactamente como esta — es lo que la persona tiene que encontrar.

## Mapa de componentes

El repo tiene una carpeta por componente. Cada uno se instala y verifica dentro de la suya.

| Componente | Carpeta | Rol | Capa | Track | Tecnologias |
|---|---|---|---|---|---|
| `api` | `api/` | practice | server | Node | DynamoDB |
| `client` | `client/` | chapter, support | client | React | React |
| `infra` | `infra/` | support | infra | Terraform (AWS) | Terraform |
| `infra-local` | (raiz) | support | infra | Compose local | DynamoDB |

## Orden de arranque

1. `docker compose up -d` (en la raiz) — levanta la infraestructura local.
2. `cd infra && terraform fmt -check -recursive && terraform init -backend=false && terraform validate` — componente `infra` (support).
3. `cd api && npm install && npm run build` — componente `api` (practice).
4. `cd client && npm install && npm run build` — componente `client` (chapter, support).

### Contratos entre componentes

- `api` expone http (api: http://localhost:3000):
  - `POST /orders`
  - `GET /orders/:id`
  - `PUT /orders/:id`
  - `DELETE /orders/:id`

## Herramientas

- **Terraform**: Herramienta de trabajo del candidato: usala en la fase donde se depura o se prueba la solucion (no es una dependencia del proyecto).

## Lo que le falta a este proyecto

Esto NO lo tenes que adivinar: salio de comparar el proyecto contra la arquitectura declarada del reto y de un analisis estatico del codigo. Completalo TODO.

### Referencias colgando en el codigo que si esta

Cada una rompe la compilacion:

- `api/src/domain/entities/order.entity.ts` — `OrderProduct.reduce`: Se invoca `reduce` sobre `OrderProduct`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `api/src/application/dtos/create-order.dto.ts` — `OrderProductDto.map`: Se invoca `map` sobre `OrderProductDto`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `api/src/application/dtos/create-order.dto.ts` — `OrderProductDto.filter`: Se invoca `filter` sobre `OrderProductDto`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `api/src/infrastructure/repositories/order.repository.impl.ts` — `OrderProduct.map`: Se invoca `map` sobre `OrderProduct`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `client/src/features/orders/components/OrderList.tsx` — `OrderEntity.map`: Se invoca `map` sobre `OrderEntity`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.

## Como saber que terminaste

```bash
(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && (cd infra && terraform fmt -check -recursive && terraform init -backend=false && terraform validate) && docker compose config -q
```

Ese comando corriendo sin errores es la definicion de "listo".

---

```
## Briefing del reto (autoridad)
Este bloque manda sobre los archivos adjuntos. El stack y el rol salen de AQUÍ, no de un topic genérico ni de markdown placeholder.

### Perfil
Chapter Frontend, Especialidad Desarrollador, Tecnología React, Advanced L2

### Brecha de conocimiento
CRUD de ordenes en DynamoDB desde la interfaz (corrida e2e 20261109213213585), Implementa operaciones CRUD de ordenes en DynamoDB desde la interfaz y versiona la infraestructura

### Misión / candidato
Gestionar ordenes

### Reto
- Tema: Persistir ordenes en DynamoDB desde la interfaz
- Seniority: advanced-l2
- Tipo: practical
- Título: Implementación de operaciones CRUD de órdenes en DynamoDB
- Tiempo estimado: 8 horas

### Fases (trabajo del HUMANO — PROHIBIDO completarlas)
No implementes estos entregables. Dejalos como hueco pedagógico. El asistente solo materializa el proyecto arrancable para que el participante pueda trabajar.
- Fase 1: Configuración del entorno y persistencia básica de órdenes — objetivo: Configurar el entorno de desarrollo y permitir la persistencia básica de órdenes en DynamoDB. — entregable (NO resolver): Entorno de desarrollo configurado y funcionalidad básica de CRUD para órdenes en DynamoDB.
- Fase 2: Actualización y eliminación de órdenes — objetivo: Implementar la funcionalidad para actualizar y eliminar órdenes en DynamoDB. — entregable (NO resolver): Funcionalidad completa de CRUD para órdenes en DynamoDB, incluyendo actualización y eliminación.
- Fase 3: Manejo de errores y notificación al usuario — objetivo: Implementar el manejo de errores de conexión a DynamoDB y notificar al usuario. — entregable (NO resolver): Sistema con manejo completo de errores de conexión a DynamoDB y notificación al usuario.

Eres un asistente experto en análisis, corrección y generación de archivos de cualquier tipo:
código fuente, documentación, hojas de cálculo, documentos Word, configuraciones, entre otros.
Voy a enviarte una cadena de texto que contiene uno o más archivos. Cada archivo está delimitado por un marcador con el siguiente formato:
// === ARCHIVO: ruta/del/archivo.extension ===
o también puede aparecer como:
## === ARCHIVO: ruta/del/archivo.extension ===
Lo que sigue al marcador puede ser:

El contenido real del archivo (código, texto, YAML, etc.)
Una descripción en lenguaje natural de lo que debe contener el archivo


TU TAREA
PASO 0 — ¿Esto es un proyecto o una carcasa?
Antes de extraer archivos, leé el Briefing (si está) y diagnosticá el adjunto.

Es CARCASA si ocurre CUALQUIERA de estas:
- No hay manifiesto de dependencias del stack del briefing (manifest.json de VTEX IO / package.json / pom.xml / build.gradle / requirements.txt / go.mod / *.tf / *.csproj, según corresponda)
- Hay un "binario" que en realidad es un comentario ("no puede ser mostrado como texto plano", placeholder .fig/.docx vacío)
- Los markdowns ya completan entregables de fases posteriores ("se implementó fade-in", lista de áreas ya resuelta)

Si es CARCASA:
- MATERIALIZÁ un proyecto que arranca en el stack del briefing (VTEX IO Store Framework, Angular, Terraform, pytest, Nest, etc.). Incluí manifiesto, punto de entrada y capa de interfaz reales.
- NO copies los markdowns de "solución" como si fueran el producto. Son ruido de generación.
- NO resuelvas las fases del briefing (están marcadas PROHIBIDO). Dejá el hueco pedagógico: el flujo existe, las microinteracciones/calidad/infra que el reto pide NO están hechas.
- Después seguí al PASO 5 (entrega de archivos).

Si es un proyecto REAL (manifiesto + código que compila o arranca):
- Seguí PASO 1 en adelante. 🔴 compilación sí. 🟡 pedagógico no.

PASO 1 — Detección y extracción
Identifica todos los archivos presentes en la cadena. Para cada archivo extrae:

Su ruta completa (ej: src/main/java/com/pragma/Service.java)
Su contenido o descripción

PASO 2 — Clasificación por tipo
Clasifica cada archivo en una de estas categorías:
A) Código fuente (Java, Python, TypeScript, JavaScript, Kotlin, etc.)
B) Configuración / documentación (YAML, properties, Markdown, JSON, txt, etc.)
C) Excel (.xlsx, .xls, .csv)
D) Word (.docx, .doc)
E) Otro tipo de archivo binario o especial
PASO 3 — Clasificación de errores en código fuente

Objetivo prioritario: que el proyecto compile. No corrijas flujo de negocio ni lógica funcional.

Antes de modificar cualquier archivo de código fuente, clasifica cada problema encontrado en una de estas dos categorías:
🔴 ERROR DE COMPILACIÓN — corregir siempre
Son errores que impiden que el proyecto arranque, sin valor pedagógico:

Import faltante o incorrecto
Clase, método o variable referenciada que no existe en ningún archivo del proyecto
Error de sintaxis
Anotación con atributos inválidos
Dependencia ausente en pom.xml, package.json, etc.
Archivo referenciado que no existe y debe ser creado con implementación mínima

→ CORREGIR estos errores.
🟡 PROBLEMA FUNCIONAL O DE CALIDAD — preservar siempre
Son problemas que no impiden compilar. Pueden ser intencionales para el aprendizaje:

Clave secreta hardcodeada ("secret", "password123")
API deprecada que funciona pero tiene reemplazo moderno
Lógica de negocio incorrecta o incompleta
Código redundante o de baja legibilidad
Falta de validaciones en flujo de negocio
Patrones de diseño incorrectos pero funcionales
Concurrencia no segura
Configuración funcional pero no óptima

→ PRESERVAR tal cual. No corregir, no mejorar, no comentar.
PASO 4 — Procesamiento según tipo de archivo
Tipo A — Código fuente
Aplica únicamente las correcciones clasificadas como 🔴 ERROR DE COMPILACIÓN.
No alteres ningún elemento clasificado como 🟡 PROBLEMA FUNCIONAL O DE CALIDAD.
Si falta un archivo referenciado, créalo con la implementación mínima necesaria para compilar.
Tipo B — Configuración / documentación
Extrae el contenido tal cual, sin modificaciones salvo errores evidentes de sintaxis
(ej: YAML mal indentado).
Tipo C — Excel (.xlsx)
Si viene con contenido real, genera el archivo respetando ese contenido.
Si viene con descripción en lenguaje natural, genera un archivo Excel funcional con:

Fila de encabezados en negrita con color de fondo distintivo
Columnas con ancho ajustado al contenido
Tipos de dato correctos por columna
Validaciones si la descripción lo indica
Hojas nombradas descriptivamente si hay más de una
Filas de ejemplo si no hay datos reales

Tipo D — Word (.docx)
Si viene con contenido real, genera el archivo respetando ese contenido.
Si viene con descripción en lenguaje natural, genera un documento Word funcional con:

Estilos de título (Título 1, Título 2) para jerarquía de secciones
Fuente legible (Calibri o equivalente), tamaño 11-12pt para cuerpo
Márgenes estándar
Tabla de contenido si tiene múltiples secciones
Tablas con encabezados en negrita si aplica

Tipo E — Otro
Genera el archivo con el contenido o estructura más apropiada según la descripción.
PASO 5 — Entrega de archivos
Entregá cada archivo con su ruta completa, respetando exactamente la estructura de rutas
indicada por los marcadores: un bloque por archivo, precedido por su ruta. No generes ZIPs
ni archivos adjuntos.
La entrega debe incluir:

Archivos de código con únicamente los errores de compilación corregidos
Archivos de configuración y documentación sin cambios
Archivos nuevos creados para resolver dependencias de compilación faltantes
Archivos Excel y Word generados desde descripción

IMPORTANTE: Entregá los archivos completos al finalizar. No preguntes si el usuario
quiere recibirlos. Simplemente entregalos; No debes desplegar en el chat el resumen de lo que arreglaste, solo entregá los archivos.

REGLAS IMPORTANTES

No omitas ningún archivo aunque no tenga errores ni modificaciones
Respeta los nombres y rutas exactas indicadas por los marcadores
Si un archivo no tiene marcador claro, infiere el nombre desde su contenido
Si la cadena contiene solo documentación, placeholders o binarios fake, NO la reproduzcas:
aplicá PASO 0 (materializar el proyecto del briefing). Reproducir la carcasa es un fallo.
No agregues texto después del último archivo entregado
No preguntes si el usuario quiere los archivos: simplemente entregalos siempre
Si detectas que falta un archivo de configuración necesario para compilar
(pom.xml, package.json, requirements.txt, build.gradle, etc.), créalo e inclúyelo
inferiendo su contenido desde los imports y frameworks detectados en el código
Nunca corrijas problemas 🟡 aunque parezcan obvios o fáciles de mejorar.
El participante que recibirá este proyecto los debe encontrar y resolver él mismo.


INPUT
Aquí está la cadena con los archivos:

// === ARCHIVO: api/src/app.module.ts ===
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

// === ARCHIVO: api/package.json ===
{
  "name": "orders-api",
  "version": "1.0.0",
  "description": "API para gestión de órdenes con persistencia en DynamoDB",
  "main": "dist/src/main.js",
  "scripts": {
    "build": "tsc",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "ts-node src/main.ts",
    "start:prod": "node dist/src/main.js",
    "lint": "eslint \"src/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage"
  },
  "dependencies": {
    "@aws-sdk/client-dynamodb": "^3.556.0",
    "@aws-sdk/lib-dynamodb": "^3.556.0",
    "@nestjs/common": "^11.0.0",
    "@nestjs/core": "^11.0.0",
    "@nestjs/platform-express": "^11.0.0",
    "@nestjs/swagger": "^11.4.8",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.0",
    "reflect-metadata": "^0.2.1",
    "rxjs": "^7.8.1",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "@nestjs/testing": "^11.0.0",
    "@types/express": "^5.0.0",
    "@types/jest": "^29.5.12",
    "@types/node": "^20.12.7",
    "@types/uuid": "^9.0.8",
    "@typescript-eslint/eslint-plugin": "^7.6.0",
    "@typescript-eslint/parser": "^7.6.0",
    "eslint": "^8.57.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-prettier": "^5.1.3",
    "jest": "^29.7.0",
    "prettier": "^3.2.5",
    "ts-jest": "^29.1.2",
    "ts-node": "^10.9.2",
    "typescript": "^5.7.0"
  },
  "jest": {
    "moduleFileExtensions": [
      "js",
      "json",
      "ts"
    ],
    "rootDir": "src",
    "testRegex": ".spec.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}

// === ARCHIVO: api/tsconfig.json ===
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2022",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": ".",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "strictBindCallApply": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmitOnError": true,
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "exclude": ["node_modules", "dist", "test"]
}

// === ARCHIVO: api/src/main.ts ===
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración global de pipes para validación
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Configuración global de filtros para manejo de excepciones
  app.useGlobalFilters(new HttpExceptionFilter());

  // Configuración global de interceptores para logging
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Orders API')
    .setDescription('API para gestión de órdenes con persistencia en DynamoDB')
    .setVersion('1.0')
    .addTag('orders')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();

// === ARCHIVO: api/src/domain/entities/order.entity.ts ===
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

// === ARCHIVO: api/src/domain/repositories/order.repository.ts ===
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

// === ARCHIVO: api/src/application/dtos/create-order.dto.ts ===
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

// === ARCHIVO: api/src/application/dtos/update-order.dto.ts ===
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

// === ARCHIVO: api/src/infrastructure/controllers/order.controller.ts ===
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

// === ARCHIVO: api/src/infrastructure/repositories/order.repository.impl.ts ===
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

// === ARCHIVO: api/src/infrastructure/config/dynamodb.config.ts ===
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

// === ARCHIVO: api/src/infrastructure/repositories/catalog.repository.impl.ts ===
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

// === ARCHIVO: api/src/common/exceptions/order-exists.exception.ts ===
import { HttpException, HttpStatus } from '@nestjs/common';

export class OrderExistsException extends HttpException {
  constructor(orderId: string) {
    const message = `Order with id '${orderId}' already exists in the system`;
    super(
      {
        statusCode: HttpStatus.CONFLICT,
        message: message,
        error: 'Order Already Exists',
        orderId,
        timestamp: new Date().toISOString(),
      },
      HttpStatus.CONFLICT,
    );
  }

  public getOrderId(): string {
    return this.getResponse()['orderId'] as string;
  }

  public getErrorDetails(): { statusCode: number; message: string; error: string } {
    const response = this.getResponse() as Record<string, unknown>;
    return {
      statusCode: response.statusCode as number,
      message: response.message as string,
      error: response.error as string,
    };
  }

  public static forValidation(orderId: string): OrderExistsException {
    if (!orderId || orderId.trim().length === 0) {
      throw new Error('Order ID cannot be empty when throwing OrderExistsException');
    }
    return new OrderExistsException(orderId);
  }
}

// === ARCHIVO: api/src/common/exceptions/product-not-found.exception.ts ===
import { HttpException, HttpStatus } from '@nestjs/common';

export class ProductNotFoundException extends HttpException {
  private readonly missingProducts: string[];

  constructor(productIds: string | string[]) {
    const products = Array.isArray(productIds) ? productIds : [productIds];
    const message =
      products.length === 1
        ? `Product with id '${products[0]}' not found in catalog`
        : `Products not found in catalog: ${products.join(', ')}`;

    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        message: message,
        error: 'Product Not Found',
        missingProducts: products,
        timestamp: new Date().toISOString(),
      },
      HttpStatus.NOT_FOUND,
    );
    this.missingProducts = products;
  }

  public getMissingProducts(): string[] {
    return [...this.missingProducts];
  }

  public hasMultipleMissingProducts(): boolean {
    return this.missingProducts.length > 1;
  }

  public getFirstMissingProduct(): string {
    return this.missingProducts[0];
  }

  public static forSingleProduct(productId: string): ProductNotFoundException {
    if (!productId || productId.trim().length === 0) {
      throw new Error('Product ID cannot be empty when throwing ProductNotFoundException');
    }
    return new ProductNotFoundException(productId);
  }

  public static forMultipleProducts(productIds: string[]): ProductNotFoundException {
    if (!productIds || productIds.length === 0) {
      throw new Error('At least one product ID must be provided when throwing ProductNotFoundException');
    }
    const validIds = productIds.filter((id) => id && id.trim().length > 0);
    if (validIds.length === 0) {
      throw new Error('All provided product IDs are empty');
    }
    return new ProductNotFoundException(validIds);
  }
}

// === ARCHIVO: api/src/common/exceptions/dynamodb-connection.exception.ts ===
import { HttpException, HttpStatus } from '@nestjs/common';

export enum DynamoDBErrorCode {
  CONNECTION_FAILED = 'DYNAMODB_CONNECTION_FAILED',
  TIMEOUT = 'DYNAMODB_TIMEOUT',
  CREDENTIALS_INVALID = 'DYNAMODB_CREDENTIALS_INVALID',
  TABLE_NOT_FOUND = 'DYNAMODB_TABLE_NOT_FOUND',
  THROTTLING = 'DYNAMODB_THROTTLING',
  UNKNOWN = 'DYNAMODB_UNKNOWN_ERROR',
}

export class DynamoDBConnectionException extends HttpException {
  private readonly errorCode: DynamoDBErrorCode;
  private readonly originalError: Error | null;
  private readonly retryable: boolean;

  constructor(
    message: string,
    errorCode: DynamoDBErrorCode = DynamoDBErrorCode.UNKNOWN,
    originalError?: Error,
    retryable: boolean = true,
  ) {
    const response = {
      statusCode: HttpStatus.SERVICE_UNAVAILABLE,
      message: `Database connection error: ${message}`,
      error: 'DynamoDB Connection Error',
      errorCode,
      retryable,
      timestamp: new Date().toISOString(),
    };

    super(response, HttpStatus.SERVICE_UNAVAILABLE);
    this.errorCode = errorCode;
    this.originalError = originalError || null;
    this.retryable = retryable;
  }

  public getErrorCode(): DynamoDBErrorCode {
    return this.errorCode;
  }

  public getOriginalError(): Error | null {
    return this.originalError;
  }

  public isRetryable(): boolean {
    return this.retryable;
  }

  public static forConnectionFailure(originalError?: Error): DynamoDBConnectionException {
    return new DynamoDBConnectionException(
      'Unable to establish connection to DynamoDB',
      DynamoDBErrorCode.CONNECTION_FAILED,
      originalError,
      true,
    );
  }

  public static forTimeout(originalError?: Error): DynamoDBConnectionException {
    return new DynamoDBConnectionException(
      'Request to DynamoDB timed out',
      DynamoDBErrorCode.TIMEOUT,
      originalError,
      true,
    );
  }

  public static forInvalidCredentials(originalError?: Error): DynamoDBConnectionException {
    return new DynamoDBConnectionException(
      'Invalid AWS credentials for DynamoDB access',
      DynamoDBErrorCode.CREDENTIALS_INVALID,
      originalError,
      false,
    );
  }

  public static forTableNotFound(tableName: string): DynamoDBConnectionException {
    return new DynamoDBConnectionException(
      `DynamoDB table '${tableName}' not found`,
      DynamoDBErrorCode.TABLE_NOT_FOUND,
      undefined,
      false,
    );
  }

  public static forThrottling(originalError?: Error): DynamoDBConnectionException {
    return new DynamoDBConnectionException(
      'DynamoDB request throttled due to high load',
      DynamoDBErrorCode.THROTTLING,
      originalError,
      true,
    );
  }
}

// === ARCHIVO: api/src/common/interceptors/logging.interceptor.ts ===
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const now = Date.now();
    const requestId = request.headers['x-request-id'] || this.generateRequestId();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const duration = Date.now() - now;
        const statusCode = response.statusCode;

        this.logRequest(method, url, statusCode, duration, requestId);
      }),
    );
  }

  private logRequest(
    method: string,
    url: string,
    statusCode: number,
    duration: number,
    requestId: string,
  ): void {
    const logLevel = statusCode >= 400 ? 'error' : 'log';
    const message = `[${requestId}] \${method} \${url} - \${statusCode} (\${duration}ms)`;

    if (logLevel === 'error') {
      console.error(message);
    } else {
      console.log(message);
    }
  }

  private generateRequestId(): string {
    return `req-\${Date.now()}-\${Math.random().toString(36).substring(2, 9)}`;
  }
}

// === ARCHIVO: api/src/common/filters/http-exception.filter.ts ===
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';
    let details: any = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as Record<string, any>;
        message = responseObj.message || message;
        error = responseObj.error || error;
        details = responseObj.details;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(
        `Unhandled exception: ${exception.message}`,
        exception.stack,
      );
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error,
      message: Array.isArray(message) ? message : [message],
      ...(details && { details }),
    };

    this.logger.error(
      `\${request.method} \${request.url} - \${status}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    response.status(status).json(errorResponse);
  }
}

// === ARCHIVO: api/src/application/services/order.service.ts ===
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

// === ARCHIVO: api/src/domain/repositories/catalog.repository.ts ===
export interface CatalogProduct {
  id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  stock?: number;
}

export interface CatalogRepository {
  exists(productId: string): Promise<boolean>;
  existsMany(productIds: string[]): Promise<Map<string, boolean>>;
  findById(productId: string): Promise<CatalogProduct | null>;
}

// === ARCHIVO: api/src/domain/repositories/catalog-product.interface.ts ===
export interface CatalogProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  inStock: boolean;
  quantity?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// === ARCHIVO: client/package.json ===
{
  "name": "client",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx",
    "preview": "vite preview",
    "test": "vitest",
    "format": "prettier --write ."
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^6.22.3",
    "@tanstack/react-query": "^5.28.9",
    "axios": "^1.6.8",
    "react-error-boundary": "4.1.2"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.7.0",
    "vite": "^5.2.7",
    "eslint": "^8.57.0",
    "eslint-plugin-react": "^7.34.1",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.6",
    "prettier": "^3.2.5",
    "vitest": "^1.4.0",
    "@testing-library/react": "^16.3.3",
    "@testing-library/jest-dom": "^6.4.2",
    "@testing-library/user-event": "^14.5.2"
  }
}

// === ARCHIVO: client/vite.config.ts ===
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@app': resolve(__dirname, './src/app'),
      '@features': resolve(__dirname, './src/features'),
      '@shared': resolve(__dirname, './src/shared'),
      '@services': resolve(__dirname, './src/services'),
      '@utils': resolve(__dirname, './src/utils'),
      '@types': resolve(__dirname, './src/types')
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
});

// === ARCHIVO: client/tsconfig.json ===
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": [
      "DOM",
      "DOM.Iterable",
      "ESNext"
    ],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "src/*"
      ],
      "@app/*": [
        "src/app/*"
      ],
      "@features/*": [
        "src/features/*"
      ],
      "@shared/*": [
        "src/shared/*"
      ],
      "@services/*": [
        "src/services/*"
      ],
      "@utils/*": [
        "src/utils/*"
      ],
      "@types/*": [
        "src/types/*"
      ]
    }
  },
  "include": [
    "src"
  ]
}


// === ARCHIVO: client/src/main.tsx ===
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';
import './index.scss';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000 // 5 minutes
    }
  }
});

// Mount the app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

// === ARCHIVO: client/src/app/App.tsx ===
import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorNotification } from '@shared/components/ErrorNotification';
import routes from './routes';

/**
 * Componente raíz de la aplicación que gestiona las rutas y el manejo global de errores.
 * Implementa un ErrorBoundary para capturar errores no manejados en componentes hijos.
 */
const App = () => {
  const location = useLocation();
  const [errorKey, setErrorKey] = useState<number>(0);

  const handleReset = () => {
    setErrorKey(prevKey => prevKey + 1);
  };

  return (
    <div className="app-container">
      <ErrorBoundary
        key={errorKey}
        FallbackComponent={({ error, resetErrorBoundary }) => (
          <ErrorNotification
            error={error}
            onRetry={() => {
              resetErrorBoundary();
              handleReset();
            }}
          />
        )}
        onReset={handleReset}
      >
        <Routes location={location} key={location.pathname}>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<route.element />}
            />
          ))}
        </Routes>
      </ErrorBoundary>
    </div>
  );
};

export default App;

// === ARCHIVO: client/index.html ===
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Sistema de gestión de órdenes con persistencia en DynamoDB" />
    <meta name="keywords" content="ordenes, dynamodb, crud, gestión" />
    <meta name="author" content="Equipo de Desarrollo" />
    <meta name="theme-color" content="#2563eb" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Gestión de Órdenes | DynamoDB</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      html {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      body {
        min-height: 100vh;
        background-color: #f8fafc;
        color: #1e293b;
      }
      #root {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }
      @media (prefers-color-scheme: dark) {
        body {
          background-color: #0f172a;
          color: #f1f5f9;
        }
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>

// === ARCHIVO: client/src/app/routes.tsx ===
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { OrdersPage } from '@features/orders/OrdersPage';
import { OrderForm } from '@features/orders/components/OrderForm';
import { OrderItem } from '@features/orders/components/OrderItem';
import { ErrorNotification } from '@shared/components/ErrorNotification';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/orders" replace />,
    index: true,
  },
  {
    path: '/orders',
    element: <OrdersPage />,
    children: [
      {
        index: true,
        element: (
          <div className="orders-list-container">
            <OrdersPage />
          </div>
        ),
      },
      {
        path: 'new',
        element: (
          <div className="order-form-container">
            <OrderForm />
          </div>
        ),
      },
      {
        path: ':id',
        element: (
          <div className="order-detail-container">
            <OrderItem />
          </div>
        ),
      },
      {
        path: ':id/edit',
        element: (
          <div className="order-edit-container">
            <OrderForm isEdit={true} />
          </div>
        ),
      },
    ],
  },
  {
    path: '*',
    element: (
      <div className="not-found-container">
        <ErrorNotification 
          message="Página no encontrada" 
          type="error" 
        />
        <a href="/orders">Volver a Órdenes</a>
      </div>
    ),
  },
];

const router = createBrowserRouter(routes, {
  future: {
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorBoundary: true,
  },
});

export function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;

// === ARCHIVO: client/src/features/orders/OrdersPage.tsx ===
import { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useOrders } from './hooks/useOrders';
import { OrderForm } from './components/OrderForm';
import { OrderList } from './components/OrderList';
import { OrderEntity, CreateOrderDto, UpdateOrderDto } from '@/types/order';
import { ErrorNotification } from '@/shared/components/ErrorNotification';

export function OrdersPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderEntity | null>(null);
  const [showForm, setShowForm] = useState(false);

  const {
    orders,
    isLoading,
    error,
    createOrder,
    updateOrder,
    deleteOrder,
    refetch
  } = useOrders();

  const handleCreate = useCallback(async (data: CreateOrderDto) => {
    try {
      await createOrder(data);
      setShowForm(false);
      refetch();
    } catch (err) {
      console.error('Error al crear orden:', err);
    }
  }, [createOrder, refetch]);

  const handleUpdate = useCallback(async (data: UpdateOrderDto) => {
    if (!selectedOrder) return;
    try {
      await updateOrder({ id: selectedOrder.id, data });
      setIsEditing(false);
      setSelectedOrder(null);
      refetch();
    } catch (err) {
      console.error('Error al actualizar orden:', err);
    }
  }, [selectedOrder, updateOrder, refetch]);

  const handleDelete = useCallback(async (orderId: string) => {
    const confirmed = window.confirm('¿Estás seguro de que deseas eliminar esta orden?');
    if (!confirmed) return;
    try {
      await deleteOrder(orderId);
      refetch();
    } catch (err) {
      console.error('Error al eliminar orden:', err);
    }
  }, [deleteOrder, refetch]);

  const handleEdit = useCallback((order: OrderEntity) => {
    setSelectedOrder(order);
    setIsEditing(true);
  }, []);

  const handleCancel = useCallback(() => {
    setShowForm(false);
    setIsEditing(false);
    setSelectedOrder(null);
  }, []);

  const handleViewDetails = useCallback((order: OrderEntity) => {
    navigate(`/orders/${order.id}`);
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="orders-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando órdenes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <header className="orders-page__header">
        <h1>Gestión de Órdenes</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Nueva Orden
        </button>
      </header>

      {error && (
        <ErrorNotification
          message={error.message || 'Error al cargar las órdenes'}
          onRetry={refetch}
        />
      )}

      {(showForm || isEditing) && (
        <div className="orders-page__form-overlay">
          <OrderForm
            order={selectedOrder}
            onSubmit={isEditing ? handleUpdate : handleCreate}
            onCancel={handleCancel}
            isEditing={isEditing}
          />
        </div>
      )}

      <main className="orders-page__content">
        <OrderList
          orders={orders}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewDetails={handleViewDetails}
        />
      </main>
    </div>
  );
}

// === ARCHIVO: client/src/features/orders/components/OrderForm.tsx ===
import { useState, useEffect, FormEvent } from 'react';
import { OrderEntity, CreateOrderDto, UpdateOrderDto } from '@/types/order';

interface OrderFormProps {
  order?: OrderEntity | null;
  onSubmit: (data: CreateOrderDto | UpdateOrderDto) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

export function OrderForm({ order, onSubmit, onCancel, isEditing = false }: OrderFormProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [status, setStatus] = useState<'pending' | 'processing' | 'completed' | 'cancelled'>('pending');
  const [products, setProducts] = useState<Array<{ productId: string; quantity: number }>>([]);
  const [newProductId, setNewProductId] = useState('');
  const [newQuantity, setNewQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (order) {
      setCustomerName(order.customerName);
      setCustomerEmail(order.customerEmail);
      setStatus(order.status);
      setProducts(order.products);
    }
  }, [order]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!customerName.trim()) {
      errors.customerName = 'El nombre del cliente es obligatorio';
    } else if (customerName.length < 2) {
      errors.customerName = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!customerEmail.trim()) {
      errors.customerEmail = 'El correo electrónico es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      errors.customerEmail = 'Ingrese un correo electrónico válido';
    }

    if (products.length === 0) {
      errors.products = 'Debe agregar al menos un producto';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = isEditing
        ? { status, products }
        : { customerName, customerEmail, status, products };
      
      await onSubmit(orderData as CreateOrderDto | UpdateOrderDto);
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddProduct = () => {
    if (!newProductId.trim()) {
      return;
    }

    const existingIndex = products.findIndex(p => p.productId === newProductId);
    if (existingIndex >= 0) {
      const updatedProducts = [...products];
      updatedProducts[existingIndex].quantity += newQuantity;
      setProducts(updatedProducts);
    } else {
      setProducts([...products, { productId: newProductId, quantity: newQuantity }]);
    }

    setNewProductId('');
    setNewQuantity(1);
  };

  const handleRemoveProduct = (productId: string) => {
    setProducts(products.filter(p => p.productId !== productId));
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setProducts(
      products.map(p =>
        p.productId === productId ? { ...p, quantity } : p
      )
    );
  };

  return (
    <div className="order-form">
      <h2>{isEditing ? 'Editar Orden' : 'Nueva Orden'}</h2>
      
      <form onSubmit={handleSubmit} className="order-form__content">
        <div className="form-group">
          <label htmlFor="customerName">Nombre del Cliente</label>
          <input
            id="customerName"
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            disabled={isSubmitting}
            className={validationErrors.customerName ? 'input-error' : ''}
          />
          {validationErrors.customerName && (
            <span className="error-message">{validationErrors.customerName}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="customerEmail">Correo Electrónico</label>
          <input
            id="customerEmail"
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            disabled={isSubmitting}
            className={validationErrors.customerEmail ? 'input-error' : ''}
          />
          {validationErrors.customerEmail && (
            <span className="error-message">{validationErrors.customerEmail}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="status">Estado</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            disabled={isSubmitting}
          >
            <option value="pending">Pendiente</option>
            <option value="processing">Procesando</option>
            <option value="completed">Completado</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>

        <div className="form-group">
          <label>Productos</label>
          <div className="products-add">
            <input
              type="text"
              placeholder="ID del producto"
              value={newProductId}
              onChange={(e) => setNewProductId(e.target.value)}
              disabled={isSubmitting}
            />
            <input
              type="number"
              min="1"
              value={newQuantity}
              onChange={(e) => setNewQuantity(parseInt(e.target.value) || 1)}
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={handleAddProduct}
              disabled={isSubmitting || !newProductId.trim()}
              className="btn btn-secondary"
            >
              Agregar
            </button>
          </div>
          {validationErrors.products && (
            <span className="error-message">{validationErrors.products}</span>
          )}
        </div>

        {products.length > 0 && (
          <div className="products-list">
            <h3>Productos seleccionados</h3>
            <ul>
              {products.map((product) => (
                <li key={product.productId} className="product-item">
                  <span>Producto: {product.productId}</span>
                  <div className="quantity-controls">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(product.productId, product.quantity - 1)}
                      disabled={product.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{product.quantity}</span>
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(product.productId, product.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveProduct(product.productId)}
                    className="btn-remove"
                    disabled={isSubmitting}
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="form-actions">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
          >
            {isSubmitting ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="btn btn-secondary"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

// === ARCHIVO: client/src/features/orders/components/OrderList.tsx ===
import { OrderEntity } from '@/types/order';

interface OrderListProps {
  orders: OrderEntity[];
  onEdit: (order: OrderEntity) => void;
  onDelete: (orderId: string) => void;
  onViewDetails: (order: OrderEntity) => void;
}

export function OrderList({ orders, onEdit, onDelete, onViewDetails }: OrderListProps) {
  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      pending: '#ffa500',
      processing: '#1e90ff',
      completed: '#32cd32',
      cancelled: '#dc143c'
    };
    return colors[status] || '#808080';
  };

  const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      processing: 'Procesando',
      completed: 'Completado',
      cancelled: 'Cancelado'
    };
    return labels[status] || status;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getTotalItems = (products: Array<{ productId: string; quantity: number }>): number => {
    return products.reduce((total, product) => total + product.quantity, 0);
  };

  if (orders.length === 0) {
    return (
      <div className="order-list order-list--empty">
        <div className="empty-state">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
          <h3>No hay órdenes</h3>
          <p>Crea tu primera orden para comenzar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-list">
      <table className="order-list__table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Correo</th>
            <th>Productos</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="order-item">
              <td className="order-item__id">
                <button
                  className="link-button"
                  onClick={() => onViewDetails(order)}
                  title="Ver detalles"
                >
                  {order.id.substring(0, 8)}...
                </button>
              </td>
              <td className="order-item__customer">{order.customerName}</td>
              <td className="order-item__email">{order.customerEmail}</td>
              <td className="order-item__products">
                <span className="products-count">
                  {getTotalItems(order.products)} items
                </span>
              </td>
              <td className="order-item__status">
                <span
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {getStatusLabel(order.status)}
                </span>
              </td>
              <td className="order-item__date">
                {formatDate(order.createdAt)}
              </td>
              <td className="order-item__actions">
                <button
                  className="btn btn-icon"
                  onClick={() => onEdit(order)}
                  title="Editar orden"
                  aria-label="Editar orden"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button
                  className="btn btn-icon btn-danger"
                  onClick={() => onDelete(order.id)}
                  title="Eliminar orden"
                  aria-label="Eliminar orden"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// === ARCHIVO: client/src/features/orders/components/OrderItem.tsx ===
import React from 'react';
import { OrderEntity } from '@/types/order';
import './OrderItem.css';

interface OrderItemProps {
  order: OrderEntity;
  onEdit: (order: OrderEntity) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export const OrderItem: React.FC<OrderItemProps> = ({
  order,
  onEdit,
  onDelete,
  isDeleting = false
}) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusColor = (status: string): string => {
    const statusColors: Record<string, string> = {
      pending: 'status-pending',
      processing: 'status-processing',
      completed: 'status-completed',
      cancelled: 'status-cancelled'
    };
    return statusColors[status.toLowerCase()] || 'status-default';
  };

  const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      processing: 'Procesando',
      completed: 'Completada',
      cancelled: 'Cancelada'
    };
    return labels[status.toLowerCase()] || status;
  };

  const handleDeleteClick = () => {
    if (window.confirm(`¿Estás seguro de eliminar la orden ${order.id}?`)) {
      onDelete(order.id);
    }
  };

  return (
    <div className="order-item" data-testid={`order-item-${order.id}`}>
      <div className="order-item__header">
        <h3 className="order-item__id">Orden #{order.id.slice(0, 8).toUpperCase()}</h3>
        <span className={`order-item__status ${getStatusColor(order.status)}`}>
          {getStatusLabel(order.status)}
        </span>
      </div>
      
      <div className="order-item__details">
        <div className="order-item__date">
          <span className="order-item__label">Fecha de creación:</span>
          <span className="order-item__value">{formatDate(order.createdAt)}</span>
        </div>
        
        <div className="order-item__products">
          <span className="order-item__label">Productos ({order.products?.length || 0}):</span>
          <ul className="order-item__product-list">
            {order.products?.map((product, index) => (
              <li key={index} className="order-item__product">
                {product.name} - ${product.price.toFixed(2)} x {product.quantity}
              </li>
            ))}
          </ul>
        </div>
        
        {order.total !== undefined && (
          <div className="order-item__total">
            <span className="order-item__label">Total:</span>
            <span className="order-item__value order-item__total-value">
              ${order.total.toFixed(2)}
            </span>
          </div>
        )}
      </div>
      
      <div className="order-item__actions">
        <button
          className="order-item__button order-item__button--edit"
          onClick={() => onEdit(order)}
          disabled={isDeleting}
          aria-label={`Editar orden ${order.id}`}
        >
          Editar
        </button>
        <button
          className="order-item__button order-item__button--delete"
          onClick={handleDeleteClick}
          disabled={isDeleting}
          aria-label={`Eliminar orden ${order.id}`}
        >
          {isDeleting ? 'Eliminando...' : 'Eliminar'}
        </button>
      </div>
    </div>
  );
};

// === ARCHIVO: client/src/features/orders/hooks/useOrders.ts ===
import { useState, useCallback, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { OrderEntity, CreateOrderDto, UpdateOrderDto } from '@/types/order';
import { orderService } from '@/services/order.service';
import { handleApiError } from '@/utils/errorHandler';

interface UseOrdersOptions {
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

export const useOrders = (options?: UseOrdersOptions) => {
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<OrderEntity | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const ordersQuery = useQuery({
    queryKey: ['orders'],
    queryFn: () => orderService.getAllOrders(),
    staleTime: 30000,
    retry: 2,
    refetchOnWindowFocus: false
  });

  const createOrderMutation = useMutation({
    mutationFn: (data: CreateOrderDto) => orderService.createOrder(data),
    onSuccess: (newOrder) => {
      queryClient.setQueryData<OrderEntity[]>(['orders'], (old) => {
        if (!old) return [newOrder];
        return [...old, newOrder];
      });
      options?.onSuccess?.('Orden creada exitosamente');
      setIsFormOpen(false);
    },
    onError: (error) => {
      const message = handleApiError(error);
      options?.onError?.(message);
    }
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderDto }) => 
      orderService.updateOrder(id, data),
    onSuccess: (updatedOrder) => {
      queryClient.setQueryData<OrderEntity[]>(['orders'], (old) => {
        if (!old) return old;
        return old.map(order => 
          order.id === updatedOrder.id ? updatedOrder : order
        );
      });
      options?.onSuccess?.('Orden actualizada exitosamente');
      setSelectedOrder(null);
      setIsFormOpen(false);
    },
    onError: (error) => {
      const message = handleApiError(error);
      options?.onError?.(message);
    }
  });

  const deleteOrderMutation = useMutation({
    mutationFn: (id: string) => orderService.deleteOrder(id),
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<OrderEntity[]>(['orders'], (old) => {
        if (!old) return old;
        return old.filter(order => order.id !== deletedId);
      });
      options?.onSuccess?.('Orden eliminada exitosamente');
    },
    onError: (error) => {
      const message = handleApiError(error);
      options?.onError?.(message);
    }
  });

  const handleCreateOrder = useCallback((data: CreateOrderDto) => {
    createOrderMutation.mutate(data);
  }, [createOrderMutation]);

  const handleUpdateOrder = useCallback((id: string, data: UpdateOrderDto) => {
    updateOrderMutation.mutate({ id, data });
  }, [updateOrderMutation]);

  const handleDeleteOrder = useCallback((id: string) => {
    deleteOrderMutation.mutate(id);
  }, [deleteOrderMutation]);

  const handleEditOrder = useCallback((order: OrderEntity) => {
    setSelectedOrder(order);
    setIsFormOpen(true);
  }, []);

  const handleNewOrder = useCallback(() => {
    setSelectedOrder(null);
    setIsFormOpen(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setSelectedOrder(null);
    setIsFormOpen(false);
  }, []);

  const orders = useMemo(() => ordersQuery.data || [], [ordersQuery.data]);
  
  const isLoading = ordersQuery.isLoading || 
    createOrderMutation.isPending || 
    updateOrderMutation.isPending;
  
  const isDeleting = deleteOrderMutation.isPending;
  
  const error = ordersQuery.error || 
    createOrderMutation.error || 
    updateOrderMutation.error || 
    deleteOrderMutation.error;

  return {
    orders,
    isLoading,
    isDeleting,
    error,
    selectedOrder,
    isFormOpen,
    isCreating: createOrderMutation.isPending,
    isUpdating: updateOrderMutation.isPending,
    handleCreateOrder,
    handleUpdateOrder,
    handleDeleteOrder,
    handleEditOrder,
    handleNewOrder,
    handleCloseForm,
    refetch: ordersQuery.refetch
  };
};

// === ARCHIVO: client/src/services/order.service.ts ===
import axios, { AxiosInstance, AxiosError } from 'axios';
import { OrderEntity, CreateOrderDto, UpdateOrderDto } from '@/types/order';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class OrderService {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_BASE_URL}/orders`,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response) {
          const status = error.response.status;
          const data = error.response.data as { message?: string };
          
          switch (status) {
            case 400:
              throw new Error(data.message || 'Solicitud inválida');
            case 404:
              throw new Error(data.message || 'Orden no encontrada');
            case 409:
              throw new Error(data.message || 'Conflicto: la orden ya existe');
            case 500:
              throw new Error(data.message || 'Error interno del servidor');
            default:
              throw new Error(data.message || 'Error al procesar la orden');
          }
        } else if (error.request) {
          throw new Error('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
        } else {
          throw new Error('Error al configurar la solicitud');
        }
      }
    );
  }

  async getAllOrders(): Promise<OrderEntity[]> {
    const response = await this.client.get<OrderEntity[]>('/');
    return response.data;
  }

  async getOrderById(id: string): Promise<OrderEntity> {
    const response = await this.client.get<OrderEntity>(`/${id}`);
    return response.data;
  }

  async createOrder(data: CreateOrderDto): Promise<OrderEntity> {
    this.validateOrderData(data);
    
    const orderData = {
      ...data,
      createdAt: new Date().toISOString(),
      status: data.status || 'pending'
    };
    
    const response = await this.client.post<OrderEntity>('/', orderData);
    return response.data;
  }

  async updateOrder(id: string, data: UpdateOrderDto): Promise<OrderEntity> {
    if (!id || id.trim() === '') {
      throw new Error('El ID de la orden es requerido');
    }
    
    this.validateUpdateData(data);
    
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    const response = await this.client.put<OrderEntity>(`/${id}`, updateData);
    return response.data;
  }

  async deleteOrder(id: string): Promise<void> {
    if (!id || id.trim() === '') {
      throw new Error('El ID de la orden es requerido');
    }
    
    await this.client.delete(`/${id}`);
  }

  private validateOrderData(data: CreateOrderDto): void {
    if (!data.id || data.id.trim() === '') {
      throw new Error('El ID de la orden es requerido');
    }
    
    if (!data.products || !Array.isArray(data.products) || data.products.length === 0) {
      throw new Error('La orden debe contener al menos un producto');
    }
    
    for (const product of data.products) {
      if (!product.id || !product.name || !product.price || !product.quantity) {
        throw new Error('Cada producto debe tener id, nombre, precio y cantidad');
      }
      
      if (product.price < 0) {
        throw new Error('El precio del producto no puede ser negativo');
      }
      
      if (product.quantity <= 0) {
        throw new Error('La cantidad del producto debe ser mayor a cero');
      }
    }
  }

  private validateUpdateData(data: UpdateOrderDto): void {
    if (data.status && !['pending', 'processing', 'completed', 'cancelled'].includes(data.status)) {
      throw new Error('Estado inválido. Estados permitidos: pending, processing, completed, cancelled');
    }
    
    if (data.products && (!Array.isArray(data.products) || data.products.length === 0)) {
      throw new Error('La orden debe contener al menos un producto');
    }
    
    if (data.products) {
      for (const product of data.products) {
        if (product.price !== undefined && product.price < 0) {
          throw new Error('El precio del producto no puede ser negativo');
        }
        
        if (product.quantity !== undefined && product.quantity <= 0) {
          throw new Error('La cantidad del producto debe ser mayor a cero');
        }
      }
    }
  }
}

export const orderService = new OrderService();

// === ARCHIVO: client/src/utils/errorHandler.ts ===
import { AxiosError } from 'axios';

export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: Record<string, unknown>;
}

export function isAxiosError(error: unknown): error is AxiosError {
  return error instanceof AxiosError;
}

export function handleApiError(error: unknown): AppError {
  if (isAxiosError(error)) {
    const response = error.response;
    const statusCode = response?.status;
    
    if (statusCode === 400) {
      return {
        message: 'Los datos enviados no son válidos. Verifica los campos requeridos.',
        code: 'BAD_REQUEST',
        statusCode,
        details: response?.data as Record<string, unknown>,
      };
    }
    
    if (statusCode === 401) {
      return {
        message: 'No tienes autorización para realizar esta acción.',
        code: 'UNAUTHORIZED',
        statusCode,
      };
    }
    
    if (statusCode === 403) {
      return {
        message: 'Acceso prohibido. No tienes permisos suficientes.',
        code: 'FORBIDDEN',
        statusCode,
      };
    }
    
    if (statusCode === 404) {
      return {
        message: 'El recurso solicitado no fue encontrado.',
        code: 'NOT_FOUND',
        statusCode,
      };
    }
    
    if (statusCode === 409) {
      return {
        message: 'Ya existe un recurso con esos datos. Verifica que el identificador no esté duplicado.',
        code: 'CONFLICT',
        statusCode,
        details: response?.data as Record<string, unknown>,
      };
    }
    
    if (statusCode && statusCode >= 500) {
      return {
        message: 'Error del servidor. Intenta más tarde o contacta al administrador.',
        code: 'SERVER_ERROR',
        statusCode,
      };
    }
    
    return {
      message: error.message || 'Ocurrió un error al procesar la solicitud.',
      code: 'UNKNOWN',
      statusCode,
    };
  }
  
  if (error instanceof Error) {
    return {
      message: error.message || 'Ocurrió un error inesperado.',
      code: 'UNKNOWN',
    };
  }
  
  return {
    message: 'Ocurrió un error desconocido.',
    code: 'UNKNOWN',
  };
}

export function getErrorMessage(error: unknown): string {
  const appError = handleApiError(error);
  return appError.message;
}

export function logError(error: unknown, context?: string): void {
  const appError = handleApiError(error);
  const timestamp = new Date().toISOString();
  const contextPrefix = context ? `[${context}] ` : '';
  
  console.error(
    `${timestamp} ${contextPrefix}Error: ${appError.message}`,
    {
      code: appError.code,
      statusCode: appError.statusCode,
      details: appError.details,
      originalError: error,
    }
  );
}

// === ARCHIVO: client/src/types/order.ts ===
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderProduct {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderEntity {
  id: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
  products: OrderProduct[];
  totalAmount: number;
  customerEmail?: string;
  customerName?: string;
}

export interface CreateOrderDto {
  id: string;
  status?: OrderStatus;
  products: Array<{
    productId: string;
    quantity: number;
  }>;
  customerEmail?: string;
  customerName?: string;
}

export interface UpdateOrderDto {
  status?: OrderStatus;
  products?: Array<{
    productId: string;
    quantity: number;
  }>;
  customerEmail?: string;
  customerName?: string;
}

export interface OrdersListResponse {
  orders: OrderEntity[];
  total: number;
}

export interface OrderFilters {
  status?: OrderStatus;
  customerEmail?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export function calculateTotalAmount(products: OrderProduct[]): number {
  return products.reduce((total, product) => {
    return total + product.quantity * product.unitPrice;
  }, 0);
}

export function isValidOrderStatus(status: string): status is OrderStatus {
  const validStatuses: OrderStatus[] = [
    'PENDING',
    'CONFIRMED',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
  ];
  return validStatuses.includes(status as OrderStatus);
}

export function canTransitionStatus(
  currentStatus: OrderStatus,
  newStatus: OrderStatus
): boolean {
  const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
    PENDING: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['SHIPPED', 'CANCELLED'],
    SHIPPED: ['DELIVERED', 'CANCELLED'],
    DELIVERED: [],
    CANCELLED: [],
  };
  
  return allowedTransitions[currentStatus]?.includes(newStatus) ?? false;
}

// === ARCHIVO: client/src/shared/components/ErrorNotification.tsx ===
import { useEffect, useState } from 'react';
import './ErrorNotification.css';

interface ErrorNotificationProps {
  error: Error | null;
  onClose?: () => void;
  autoDismiss?: boolean;
  autoDismissTime?: number;
}

export function ErrorNotification({
  error,
  onClose,
  autoDismiss = true,
  autoDismissTime = 5000,
}: ErrorNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  
  useEffect(() => {
    if (error) {
      setIsVisible(true);
      setIsExiting(false);
      
      if (autoDismiss) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoDismissTime);
        
        return () => clearTimeout(timer);
      }
    }
  }, [error, autoDismiss, autoDismissTime]);
  
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };
  
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleClose();
    }
  };
  
  if (!isVisible || !error) {
    return null;
  }
  
  return (
    <div
      className={`error-notification ${isExiting ? 'exiting' : ''}`}
      role="alert"
      aria-live="assertive"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="error-notification__icon">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="16" r="1" fill="currentColor" />
        </svg>
      </div>
      
      <div className="error-notification__content">
        <p className="error-notification__message">{error.message}</p>
      </div>
      
      <button
        className="error-notification__close"
        onClick={handleClose}
        aria-label="Cerrar notificación de error"
        type="button"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

// === ARCHIVO: client/src/shared/components/ErrorNotification.css ===
.error-notification {
  position: fixed;
  top: 16px;
  right: 16px;
  max-width: 400px;
  padding: 16px;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: flex-start;
  gap: 12px;
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
}

.error-notification.exiting {
  animation: slideOut 0.3s ease-in forwards;
}

.error-notification__icon {
  flex-shrink: 0;
  color: #dc2626;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.error-notification__content {
  flex: 1;
  min-width: 0;
}

.error-notification__message {
  margin: 0;
  color: #991b1b;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
}

.error-notification__close {
  flex-shrink: 0;
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #dc2626;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.error-notification__close:hover {
  background-color: #fee2e2;
}

.error-notification__close:focus {
  outline: 2px solid #fecaca;
  outline-offset: 2px;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideOut {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100%);
  }
}

@media (max-width: 480px) {
  .error-notification {
    top: 8px;
    right: 8px;
    left: 8px;
    max-width: none;
  }
}

// === ARCHIVO: client/src/index.scss ===
/* Estilos pendientes: archivo creado automaticamente porque otro modulo lo importa. */


// === ARCHIVO: client/src/features/orders/components/OrderItem.css ===
/* Estilos pendientes: archivo creado automaticamente porque otro modulo lo importa. */


// === ARCHIVO: client/src/setupTests.ts ===
// Setup de tests generado automaticamente (referenciado por la config del runner).
// Agrega aca matchers globales o mocks compartidos.
export {};


// === ARCHIVO: infra/providers.tf ===
terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.46.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = var.environment
      Project     = var.project_name
      ManagedBy   = "Terraform"
    }
  }
}

provider "aws" {
  alias  = "dynamodb_streams"
  region = var.aws_region

  default_tags {
    tags = {
      Environment = var.environment
      Project     = var.project_name
      ManagedBy   = "Terraform"
    }
  }
}

provider "aws" {
  alias  = "iam"
  region = var.aws_region

  default_tags {
    tags = {
      Environment = var.environment
      Project     = var.project_name
      ManagedBy   = "Terraform"
    }
  }
}

// === ARCHIVO: infra/variables.tf ===
variable "aws_region" {
  description = "Región de AWS donde se desplegarán los recursos"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Entorno de despliegue (dev, staging, prod)"
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "El entorno debe ser uno de: dev, staging, prod."
  }
}

variable "project_name" {
  description = "Nombre del proyecto para etiquetar los recursos"
  type        = string
  default     = "order-management"
}

variable "dynamodb_table_name" {
  description = "Nombre de la tabla DynamoDB para órdenes"
  type        = string
  default     = "orders"
}

variable "dynamodb_billing_mode" {
  description = "Modo de facturación para la tabla DynamoDB"
  type        = string
  default     = "PAY_PER_REQUEST"

  validation {
    condition     = contains(["PROVISIONED", "PAY_PER_REQUEST"], var.dynamodb_billing_mode)
    error_message = "El modo de facturación debe ser PROVISIONED o PAY_PER_REQUEST."
  }
}

variable "dynamodb_hash_key" {
  description = "Clave hash (partition key) para la tabla DynamoDB"
  type        = string
  default     = "order_id"
}

variable "dynamodb_range_key" {
  description = "Clave de rango (sort key) para la tabla DynamoDB"
  type        = string
  default     = "created_at"
}

variable "dynamodb_attributes" {
  description = "Lista de atributos para la tabla DynamoDB"
  type = list(object({
    name = string
    type = string
  }))
  default = [
    {
      name = "order_id"
      type = "S"
    },
    {
      name = "created_at"
      type = "S"
    },
    {
      name = "status"
      type = "S"
    }
  ]
}

variable "dynamodb_global_secondary_indexes" {
  description = "Índices globales secundarios para la tabla DynamoDB"
  type = list(object({
    name            = string
    hash_key        = string
    range_key       = string
    projection_type = string
    read_capacity   = number
    write_capacity  = number
  }))
  default = [
    {
      name            = "status-index"
      hash_key        = "status"
      range_key       = "created_at"
      projection_type = "ALL"
      read_capacity   = 5
      write_capacity  = 5
    }
  ]
}

variable "dynamodb_ttl_attribute" {
  description = "Atributo para Time To Live (TTL) en la tabla DynamoDB"
  type        = string
  default     = "expires_at"
}

variable "iam_policy_name" {
  description = "Nombre de la política IAM para acceso a DynamoDB"
  type        = string
  default     = "dynamodb-order-access"
}

variable "iam_role_name" {
  description = "Nombre del rol IAM que asumirá la política"
  type        = string
  default     = "order-service-role"
}

// === ARCHIVO: infra/modules/dynamodb/variables.tf ===
variable "table_name" {
  description = "Nombre de la tabla DynamoDB"
  type        = string
}

variable "billing_mode" {
  description = "Modo de facturación para la tabla DynamoDB"
  type        = string
  default     = "PAY_PER_REQUEST"
  validation {
    condition     = contains(["PROVISIONED", "PAY_PER_REQUEST"], var.billing_mode)
    error_message = "El modo de facturación debe ser PROVISIONED o PAY_PER_REQUEST."
  }
}

variable "hash_key" {
  description = "Clave hash (partition key) para la tabla DynamoDB"
  type        = string
}

variable "range_key" {
  description = "Clave de rango (sort key) para la tabla DynamoDB"
  type        = string
  default     = null
}

variable "attributes" {
  description = "Lista de atributos para la tabla DynamoDB"
  type = list(object({
    name = string
    type = string
  }))
}

variable "global_secondary_indexes" {
  description = "Índices globales secundarios para la tabla DynamoDB"
  type = list(object({
    name            = string
    hash_key        = string
    range_key       = string
    projection_type = string
    read_capacity   = number
    write_capacity  = number
  }))
  default = []
}

variable "ttl_attribute" {
  description = "Atributo para Time To Live (TTL) en la tabla DynamoDB"
  type        = string
  default     = null
}

variable "stream_enabled" {
  description = "Habilitar DynamoDB Streams en la tabla"
  type        = bool
  default     = false
}

variable "stream_view_type" {
  description = "Tipo de vista para DynamoDB Streams"
  type        = string
  default     = "NEW_AND_OLD_IMAGES"
  validation {
    condition     = var.stream_view_type == null ? true : contains(["KEYS_ONLY", "NEW_IMAGE", "OLD_IMAGE", "NEW_AND_OLD_IMAGES"], var.stream_view_type)
    error_message = "El tipo de vista del stream debe ser uno de: KEYS_ONLY, NEW_IMAGE, OLD_IMAGE, NEW_AND_OLD_IMAGES."
  }
}

variable "tags" {
  description = "Etiquetas adicionales para la tabla DynamoDB"
  type        = map(string)
  default     = {}
}

variable "environment" {
  description = "Entorno de despliegue (dev, staging, prod)"
  type        = string
}

// === ARCHIVO: infra/modules/iam/variables.tf ===
variable "policy_name" {
  description = "Nombre de la política IAM"
  type        = string
}

variable "role_name" {
  description = "Nombre del rol IAM que asumirá la política"
  type        = string
}

variable "dynamodb_table_arn" {
  description = "ARN de la tabla DynamoDB a la que se otorgará acceso"
  type        = string
}

variable "dynamodb_table_name" {
  description = "Nombre de la tabla DynamoDB para construir el ARN si no se proporciona"
  type        = string
  default     = ""
}

variable "dynamodb_stream_arn" {
  description = "ARN del stream de DynamoDB si se requiere acceso"
  type        = string
  default     = ""
}

variable "environment" {
  description = "Entorno de despliegue (dev, staging, prod)"
  type        = string

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "El entorno debe ser uno de: dev, staging, prod."
  }
}

variable "project_name" {
  description = "Nombre del proyecto para etiquetar los recursos"
  type        = string
}

variable "additional_permissions" {
  description = "Permisos adicionales a incluir en la política IAM"
  type = list(object({
    actions   = list(string)
    resources = list(string)
  }))
  default = []
}

// === ARCHIVO: infra/versions.tf ===
terraform {
  required_version = ">= 1.9.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.46.0"
    }
  }
}

# Configuración del provider AWS que será usado por los módulos
# La región se define en las variables del entorno o en terraform.tfvars
# Se configura el perfil de credenciales cuando está disponible para desarrollo local
provider "aws" {
  region = var.aws_region

  # Configuración para desarrollo local usando credenciales de perfil
  # En producción, estas credenciales vienen del rol de IAM asignado
  skip_credentials_validation = false
  skip_requesting_account_id  = false

  # Endpoint personalizado para pruebas locales con LocalStack
  # Descomentar las siguientes líneas para testing local:
  # endpoints {
  #   dynamodb = "http://localhost:8000"
  #   iam     = "http://localhost:4593"
  # }

  # Configuración de alias para recursos en múltiples regiones
  # Útil para réplicas de lectura de DynamoDB
  alias = "primary"

  # Configuración de retries para operaciones que pueden fallar temporalmente
  # El proveedor automáticamente reintenta operaciones idempotentes
  default_tags {
    tags = {
      ManagedBy   = "Terraform"
      Project     = "OrdersPersistence"
      Environment = var.environment
    }
  }
}

# Provider adicional para región secundaria (réplicas de lectura)
# Descomentar si se necesitan réplicas de lectura en otra región
# provider "aws" {
#   alias  = "secondary"
#   region = var.aws_region_secondary
# }

# Configuración de backend para almacenamiento del estado de Terraform
# El estado se almacena en S3 para compartir entre equipos
# Se usa DynamoDB para locking y prevenir estados corruptos
terraform {
  backend "s3" {
    bucket         = "terraform-state-${var.project_name}"
    key            = "infra/terraform.tfstate"
    region         = var.aws_region
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}

// === ARCHIVO: infra/README.md ===
# Módulo de Infraestructura - Persistencia de Órdenes

Este módulo de Terraform provisiona la infraestructura necesaria para persistir órdenes en DynamoDB y configurar los permisos IAM correspondientes.

## Recursos Provisionados

### DynamoDB
- **Tabla de Órdenes**: Almacena las órdenes con los siguientes atributos:
  - `orderId` (PK): Identificador único de la orden
  - `status`: Estado de la orden (PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED)
  - `createdAt`: Fecha de creación de la orden
  - `updatedAt`: Fecha de última actualización
  - `products`: Lista de productos incluidos en la orden
  - `customerId`: Identificador del cliente
  - `totalAmount`: Monto total de la orden

- **Índices secundarios**:
  - `CustomerIdIndex`: Para consultas por cliente
  - `StatusIndex`: Para consultas por estado
  - `CreatedAtIndex`: Para consultas cronológicas

### IAM
- **Rol de Lambda**: Rol con permisos mínimos para leer y escribir en la tabla de órdenes
- **Política de acceso**: Permisos específicos por operación (Put, Get, Update, Delete, Query, Scan)
- **Permisos de CloudWatch**: Para logs y métricas de las funciones Lambda

## Uso del Módulo

```hcl
module "infra" {
  source = "./infra"

  environment      = "dev"
  project_name     = "orders-app"
  aws_region       = "us-east-1"

  # Configuración de DynamoDB
  dynamodb_table_name = "orders"
  dynamodb_billing_mode = "PAY_PER_REQUEST"

  # Habilitar características adicionales
  enable_dynamodb_streams = true
  enable_point_in_time_recovery = true
}
```

## Variables Requeridas

| Variable | Descripción | Tipo |
|----------|-------------|------|
| `environment` | Entorno de despliegue | string |
| `project_name` | Nombre del proyecto | string |
| `aws_region` | Región de AWS | string |

## Variables Opcionales

| Variable | Descripción | Default |
|----------|-------------|---------|
| `dynamodb_table_name` | Nombre de la tabla | "orders" |
| `dynamodb_billing_mode` | Modo de facturación | "PAY_PER_REQUEST" |
| `enable_dynamodb_streams` | Habilitar streams | false |
| `enable_point_in_time_recovery` | Recuperación punto en tiempo | false |

## Validación Local

Para validar la configuración de Terraform localmente:

```bash
# Inicializar Terraform
cd infra
terraform init

# Validar sintaxis
terraform validate

# Planificar cambios
terraform plan -var-file=../environments/dev/terraform.tfvars

# Aplicar cambios (solo en desarrollo)
terraform apply -var-file=../environments/dev/terraform.tfvars
```

## Consideraciones de Seguridad

1. **Cifrado en reposo**: La tabla de DynamoDB usa cifrado por defecto con AWS managed keys
2. **Mínimo privilegio**: La política IAM solo permite operaciones necesarias
3. **Logs de auditoría**: CloudTrail registra todas las operaciones de API
4. **Point-in-time recovery**: Recomendado habilitar en producción

## Notas de Desarrollo Local

Para desarrollo local con LocalStack:

1. Configurar las variables de entorno:
   ```bash
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_DEFAULT_REGION=us-east-1
```

2. Descomentar los endpoints en `versions.tf`

3. Ejecutar Terraform apuntando a LocalStack:
   ```bash
   terraform plan -var-file=../environments/dev/terraform.tfvars
   ```

## Outputs

Este módulo expone los siguientes outputs:

- `dynamodb_table_name`: Nombre de la tabla creada
- `dynamodb_table_arn`: ARN de la tabla
- `dynamodb_stream_arn`: ARN del stream (si está habilitado)
- `lambda_role_arn`: ARN del rol de Lambda
- `lambda_role_name`: Nombre del rol de Lambda

// === ARCHIVO: infra/main.tf ===
# Configuración principal de infraestructura para persistencia de órdenes
# Este archivo orquesta los módulos de DynamoDB e IAM necesarios para el sistema

# Módulo de DynamoDB: Tabla de órdenes con configuración completa
# Provisiona la tabla principal y sus índices secundarios para consultas eficientes
module "dynamodb" {
  source = "./modules/dynamodb"

  # Nombre de la tabla - se usa naming consistente con el proyecto
  table_name = var.dynamodb_table_name

  # Configuración de facturación - PAY_PER_REQUEST para desarrollo,
  # PROVISIONED para producción con tráfico predecible
  billing_mode = var.dynamodb_billing_mode

  # Capacidad de lectura/escritura en modo provisionado
  # Solo aplica cuando billing_mode es PROVISIONED
  read_capacity  = var.dynamodb_read_capacity
  write_capacity = var.dynamodb_write_capacity

  # Configuración de atributos de la tabla
  # DynamoDB requiere definir los atributos que forman parte de la clave primaria
  # y cualquier atributo usado en índices secundarios o proyecciones
  hash_key  = "orderId"
  range_key = "createdAt"

  # Habilitar características avanzadas de DynamoDB
  enable_stream                 = var.enable_dynamodb_streams
  stream_view_type              = "NEW_AND_OLD_IMAGES"
  enable_point_in_time_recovery = var.enable_point_in_time_recovery
  enable_server_side_encryption = true

  # TTL para limpieza automática de datos si es necesario
  # Descomentar para habilitar TTL en la tabla
  # ttl_attribute = "expiresAt"

  # Tags aplicados a todos los recursos del módulo
  tags = merge(
    var.common_tags,
    {
      Component = "DynamoDB"
      Purpose   = "OrdersPersistence"
    }
  )
}

# Módulo de IAM: Roles y políticas para acceso a DynamoDB
# Implementa el principio de mínimo privilegio para las operaciones de órdenes
module "iam" {
  source = "./modules/iam"

  # Nombre del rol de Lambda que accederá a DynamoDB
  role_name = "${var.project_name}-lambda-order-handler"

  # Referencia a la tabla de DynamoDB para construir la política
  dynamodb_table_name = module.dynamodb.table_name
  dynamodb_table_arn  = module.dynamodb.table_arn

  # Habilitar permisos de CloudWatch para logging y métricas
  enable_cloudwatch_logs = true
  log_group_name         = "/aws/lambda/${var.project_name}-order-handler"
  log_retention_days     = var.cloudwatch_log_retention

  # Permisos adicionales opcionales
  # Habilitar si se necesitan acceder a otros recursos desde Lambda
  enable_s3_read_access  = var.enable_s3_read_access
  enable_secrets_manager = var.enable_secrets_manager

  # Tags aplicados al rol de IAM
  tags = merge(
    var.common_tags,
    {
      Component = "IAM"
      Purpose   = "OrdersPersistence"
    }
  )
}

# Data source para obtener información de la cuenta actual de AWS
# Útil para construir ARNs y referencias a recursos
data "aws_caller_identity" "current" {
  provider = aws.primary
}

# Data source para obtener la región actual de AWS
data "aws_region" "current" {
  provider = aws.primary
}

# Data source para obtener información de la cuenta por defecto
# Se usa para logs de auditoría y métricas
data "aws_partition" "current" {
  provider = aws.primary
}

# Recurso de CloudWatch: Grupo de logs para la aplicación
# Centraliza los logs de todas las funciones Lambda relacionadas con órdenes
resource "aws_cloudwatch_log_group" "app_logs" {
  name              = "/aws/orders/${var.environment}"
  retention_in_days = var.cloudwatch_log_retention

  tags = merge(
    var.common_tags,
    {
      Component = "CloudWatch"
      Purpose   = "Logging"
    }
  )
}

# Recurso de SNS: Topic para notificaciones de errores
# Notifica al equipo cuando hay fallos en el procesamiento de órdenes
resource "aws_sns_topic" "order_errors" {
  name = "${var.project_name}-order-errors-${var.environment}"

  tags = merge(
    var.common_tags,
    {
      Component = "SNS"
      Purpose   = "Notifications"
    }
  )
}

# Política de acceso al topic de SNS
resource "aws_sns_topic_policy" "order_errors_policy" {
  arn = aws_sns_topic.order_errors.arn

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Action = [
          "sns:Publish"
        ]
        Resource = aws_sns_topic.order_errors.arn
      }
    ]
  })
}

# Recurso de EventBridge: Regla para capturar eventos de errores
# Envía notificaciones cuando una orden falla al procesarse
resource "aws_cloudwatch_event_rule" "order_processing_errors" {
  name        = "${var.project_name}-order-errors-${var.environment}"
  description = "Captura errores en el procesamiento de órdenes"
  event_pattern = jsonencode({
    "source" : ["aws.lambda"],
    "detail-type" : ["Lambda Function Invocation Result - Failure"],
    "detail" : {
      "function_name" : ["${var.project_name}-order-handler"]
    }
  })

  tags = merge(
    var.common_tags,
    {
      Component = "EventBridge"
      Purpose   = "ErrorNotifications"
    }
  )
}

# Target de EventBridge que publica en SNS
resource "aws_cloudwatch_event_target" "order_errors_target" {
  rule      = aws_cloudwatch_event_rule.order_processing_errors.name
  target_id = "SendToSNSTopic"
  arn       = aws_sns_topic.order_errors.arn
}

# Recurso de KMS: Clave para cifrado de datos sensibles
# Cifra datos sensibles en la tabla de órdenes si es necesario
resource "aws_kms_key" "orders_encryption" {
  description             = "Clave de cifrado para datos de órdenes"
  deletion_window_in_days = 10
  enable_key_rotation     = true

  tags = merge(
    var.common_tags,
    {
      Component = "KMS"
      Purpose   = "Encryption"
    }
  )
}

# Alias de la clave KMS
resource "aws_kms_alias" "orders_encryption" {
  name          = "alias/${var.project_name}-orders"
  target_key_id = aws_kms_key.orders_encryption.key_id
}

# Recurso de CloudWatch Dashboard: Monitorización del sistema
# Dashboard para visualizar métricas de las órdenes en tiempo real
resource "aws_cloudwatch_dashboard" "orders_monitoring" {
  dashboard_name = "${var.project_name}-orders-${var.environment}"

  dashboard_body = jsonencode({
    widgets = [
      {
        type = "metric"
        properties = {
          metrics = [
            ["AWS/DynamoDB", "SuccessfulRequestLatency", "TableName", module.dynamodb.table_name, {
              stat = "Average"
            }],
            [".", "ConsumedWriteCapacityUnits", ".", ".", {
              stat = "Sum"
            }],
            [".", "ConsumedReadCapacityUnits", ".", ".", {
              stat = "Sum"
            }]
          ]
          period = 300
          stat   = "Average"
          region = data.aws_region.current.name
          title  = "DynamoDB Metrics"
        }
      },
      {
        type = "metric"
        properties = {
          metrics = [
            ["AWS/Lambda", "Invocations", "FunctionName", "${var.project_name}-order-handler", {
              stat = "Sum"
            }],
            [".", "Errors", ".", ".", {
              stat = "Sum"
            }],
            [".", "Duration", ".", ".", {
              stat = "Average"
            }]
          ]
          period = 300
          stat   = "Sum"
          region = data.aws_region.current.name
          title  = "Lambda Metrics"
        }
      }
    ]
  })
}

# Configuración de alertas de CloudWatch
# Alerta cuando hay errores en el procesamiento de órdenes
resource "aws_cloudwatch_metric_alarm" "order_errors_alarm" {
  alarm_name          = "${var.project_name}-errors-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = "300"
  statistic           = "Sum"
  threshold           = "5"
  alarm_description   = "Alerta cuando hay errores en el handler de órdenes"
  alarm_actions       = [aws_sns_topic.order_errors.arn]

  dimensions = {
    FunctionName = "${var.project_name}-order-handler"
  }

  tags = merge(
    var.common_tags,
    {
      Component = "CloudWatch"
      Purpose   = "Alerts"
    }
  )
}

# Alerta de throttling de Lambda
resource "aws_cloudwatch_metric_alarm" "lambda_throttle_alarm" {
  alarm_name          = "${var.project_name}-throttles-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "Throttles"
  namespace           = "AWS/Lambda"
  period              = "300"
  statistic           = "Sum"
  threshold           = "3"
  alarm_description   = "Alerta cuando Lambda está siendo throttled"
  alarm_actions       = [aws_sns_topic.order_errors.arn]

  dimensions = {
    FunctionName = "${var.project_name}-order-handler"
  }

  tags = merge(
    var.common_tags,
    {
      Component = "CloudWatch"
      Purpose   = "Alerts"
    }
  )
}

// === ARCHIVO: infra/outputs.tf ===
# Outputs de la infraestructura de Terraform
# Expone la información necesaria para otros componentes del sistema

# Output principal con la configuración completa de la infraestructura
output "infrastructure" {
  description = "Mapa con la configuración completa de la infraestructura desplegada"
  value = {
    region      = var.aws_region
    environment = var.environment
    dynamodb = {
      table_name = module.dynamodb.table_name
      table_arn  = module.dynamodb.table_arn
      endpoint   = "https://dynamodb.${var.aws_region}.amazonaws.com"
    }
    iam = {
      role_name = module.iam.role_name
      role_arn  = module.iam.role_arn
    }
  }
}

# Output con el nombre de la tabla DynamoDB para uso en la aplicación
output "dynamodb_table_name" {
  description = "Nombre de la tabla de DynamoDB para almacenar órdenes"
  value       = module.dynamodb.table_name
}

# Output con el ARN de la tabla DynamoDB
output "dynamodb_table_arn" {
  description = "ARN de la tabla de DynamoDB para políticas IAM y referencias"
  value       = module.dynamodb.table_arn
}

# Output con el endpoint de DynamoDB
output "dynamodb_endpoint" {
  description = "Endpoint de DynamoDB para la región configurada"
  value       = "https://dynamodb.${var.aws_region}.amazonaws.com"
}

# Output con el nombre del rol IAM
output "iam_role_name" {
  description = "Nombre del rol IAM con permisos para operar DynamoDB"
  value       = module.iam.role_name
}

# Output con el ARN del rol IAM
output "iam_role_arn" {
  description = "ARN del rol IAM para configuración en la aplicación"
  value       = module.iam.role_arn
}

# Output con las credenciales asumeidas del rol IAM
output "iam_role_session_name" {
  description = "Nombre de sesión para asumir el rol IAM desde la aplicación"
  value       = "orders-app-${var.environment}"
}

# Output con tags aplicados a los recursos
output "common_tags" {
  description = "Tags comunes aplicados a todos los recursos"
  value       = var.common_tags
}

# Output que indica si el entorno es de producción
output "is_production" {
  description = "Indica si el entorno actual es producción"
  value       = var.environment == "prod"
}

# Output con la configuración de logs para CloudWatch
output "cloudwatch_log_group" {
  description = "Nombre del grupo de logs de CloudWatch para la aplicación"
  value       = "/aws/orders-app/${var.environment}"
}

// === ARCHIVO: infra/environments/dev/terraform.tfvars ===
# Variables de configuración para el entorno de desarrollo
# Estas valores son específicos del ambiente dev y pueden diferir de prod/staging

# Configuración regional de AWS
aws_region = "us-east-1"

# Nombre del entorno para identificación en recursos
environment = "dev"

# Nombre de la tabla DynamoDB donde se persistirán las órdenes
dynamodb_table_name = "orders-dev"

# Habilitar el modo de pago bajo demanda para desarrollo
dynamodb_billing_mode = "PAY_PER_REQUEST"

# Habilitar eliminación continua para desarrollo (cuidado en producción)
dynamodb_enable_delete_protection = false

# Configuración de capacidad read/write para modo aprovisionado
# Solo aplica si billing_mode es PROVISIONED
dynamodb_read_capacity  = 5
dynamodb_write_capacity = 5

# Habilitar Point-in-Time Recovery para la tabla DynamoDB
dynamodb_enable_pitr = false

# TTL para automáticamente eliminar órdenes expiradas (en días)
order_ttl_days = 30

# Configuración del nombre del rol IAM
iam_role_name = "orders-app-dev"

# Lista de políticas gestionadas por AWS que se adjuntarán al rol
iam_managed_policies = [
  "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess",
  "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess"
]

# Política de permisos específica adicional para el rol
# Formato JSON string para inline policy
iam_custom_policy = jsonencode({
  Version = "2012-10-17"
  Statement = [
    {
      Effect = "Allow"
      Action = [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ]
      Resource = "arn:aws:dynamodb:us-east-1:*:table/orders-dev"
    },
    {
      Effect = "Allow"
      Action = [
        "dynamodb:DescribeTable",
        "dynamodb:GetItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ]
      Resource = "arn:aws:dynamodb:us-east-1:*:table/orders-dev/index/*"
    }
  ]
})

# Tags comunes para todos los recursos del entorno
common_tags = {
  Environment = "dev"
  Project     = "orders-management"
  ManagedBy   = "terraform"
  CostCenter  = "engineering"
  Team        = "platform"
}

# Configuración de retención de logs en días
cloudwatch_log_retention_days = 7

# Habilitar logs detallados de API de DynamoDB
enable_dynamodb_cloudwatch = false

# Configuración de stream para la tabla
dynamodb_stream_enabled   = true
dynamodb_stream_view_type = "NEW_AND_OLD_IMAGES"

# Timeout para operaciones de Terraform en minutos
terraform_state_lock_timeout = "10m"

# Habilitar modo de depuración para Terraform
terraform_debug = false

// === ARCHIVO: infra/modules/dynamodb/main.tf ===
# Módulo de Terraform para configurar la tabla DynamoDB de órdenes
# Este módulo crea una tabla de DynamoDB para persistir información de órdenes
# con atributos para estado, fecha de creación y lista de productos

# Recurso principal: tabla de DynamoDB para almacenar órdenes
resource "aws_dynamodb_table" "orders" {
  name         = var.table_name
  billing_mode = var.billing_mode
  hash_key     = "order_id"
  range_key    = "created_at"

  # Configuración de atributos de la tabla
  attribute {
    name = "order_id"
    type = "S"
  }

  attribute {
    name = "created_at"
    type = "S"
  }

  attribute {
    name = "customer_id"
    type = "S"
  }

  attribute {
    name = "status"
    type = "S"
  }

  # Índice secundario global para consultas por customer_id
  global_secondary_index {
    name            = "customer_id_index"
    hash_key        = "customer_id"
    projection_type = "ALL"
    read_capacity   = var.read_capacity
    write_capacity  = var.write_capacity
  }

  # Índice secundario global para consultas por status
  global_secondary_index {
    name            = "status_index"
    hash_key        = "status"
    projection_type = "ALL"
    read_capacity   = var.read_capacity
    write_capacity  = var.write_capacity
  }

  # Habilitar TTL para limpieza automática de órdenes antiguas
  ttl {
    attribute_name = "ttl"
    enabled        = var.enable_ttl
  }

  # Configuración de capacidad para modo aprovisionado
  dynamic "replica" {
    for_each = var.replica_regions
    content {
      region_name = replica.value
    }
  }

  # Etiquetas para identificación y organización
  tags = merge(
    var.common_tags,
    {
      "Name"        = var.table_name
      "Environment" = var.environment
      "Component"   = "orders-persistence"
      "Purpose"     = "Almacenar órdenes de clientes"
    }
  )

  # Habilitar eliminación de recursos dependientes
  depends_on = [
    aws_dynamodb_table_server_side_encryption.kms
  ]
}

# Recurso para cifrado del lado del servidor con KMS
resource "aws_dynamodb_table_server_side_encryption" "kms" {
  table_name = aws_dynamodb_table.orders.name

  # Usar clave KMS administrada por AWS o clave proporcionada
  server_side_encryption_key = var.kms_key_arn != null ? var.kms_key_arn : null

  # Habilitar cifrado en reposo
  enabled = var.enable_encryption
}

# Recurso para configurar el punto de acceso de transmisión
resource "aws_dynamodb_table_stream" "orders_stream" {
  table_name = aws_dynamodb_table.orders.name

  # Habilitar flujo de eventos para captura de cambios
  stream_view_type = var.enable_stream ? "NEW_AND_OLD_IMAGES" : null

  # El flujo se habilita solo si está configurado
  count = var.enable_stream ? 1 : 0
}

# Recurso para configurar el punto de acceso de tiempo de lectura
resource "aws_dynamodb_time_to_live" "orders_ttl" {
  table_name = aws_dynamodb_table.orders.name

  attribute_name = "ttl"
  enabled        = var.enable_ttl
}

# Recurso para políticas de respaldo (solo en producción)
resource "aws_backup_plan" "orders_backup" {
  count = var.enable_backup && var.environment == "prod" ? 1 : 0

  name = "orders-backup-plan"

  rule {
    name               = "daily-backup"
    target_vault_name  = var.backup_vault_name
    schedule           = var.backup_schedule
    start_window       = 60
    completion_window  = 180
    cold_storage_after = 30
    delete_after       = var.backup_retention_days

    lifecycle {
      cold_storage_after = 30
      delete_after       = var.backup_retention_days
    }
  }

  rule {
    name               = "monthly-archive"
    target_vault_name  = var.backup_vault_name
    schedule           = "cron(0 5 1 * ? *)"
    start_window       = 60
    completion_window  = 300
    cold_storage_after = 0
    delete_after       = 365

    lifecycle {
      cold_storage_after = 0
      delete_after       = 365
    }
  }

  tags = merge(
    var.common_tags,
    {
      "Name"        = "orders-backup-plan"
      "Environment" = var.environment
    }
  )
}

# Asignación de respaldo para la tabla de órdenes
resource "aws_backup_selection" "orders_backup_selection" {
  count = var.enable_backup && var.environment == "prod" ? 1 : 0

  name         = "orders-backup-selection"
  plan_id      = aws_backup_plan.orders_backup[0].id
  iam_role_arn = var.backup_iam_role_arn

  resources = [
    aws_dynamodb_table.orders.arn
  ]

  condition {
    string_like {
      key   = "aws:ResourceTag/Component"
      value = "orders-persistence"
    }
  }
}

// === ARCHIVO: infra/modules/dynamodb/outputs.tf ===
# Outputs del módulo de DynamoDB para órdenes
# Estos valores se exponen para ser consumidos por otros componentes del sistema

# Nombre de la tabla DynamoDB
output "table_name" {
  description = "Nombre de la tabla DynamoDB de órdenes"
  value       = aws_dynamodb_table.orders.name
  sensitive   = false
}

# Identificador único de la tabla
output "table_id" {
  description = "Identificador de la tabla DynamoDB"
  value       = aws_dynamodb_table.orders.id
  sensitive   = false
}

# ARN de la tabla DynamoDB
output "table_arn" {
  description = "ARN de la tabla DynamoDB de órdenes"
  value       = aws_dynamodb_table.orders.arn
  sensitive   = false
}

# ARN del stream de la tabla (si está habilitado)
output "stream_arn" {
  description = "ARN del stream de DynamoDB para captura de cambios"
  value       = try(aws_dynamodb_table_stream.orders_stream[0].stream_arn, null)
  sensitive   = false
}

# ARN del índice secundario global por customer_id
output "customer_id_index_arn" {
  description = "ARN del índice secundario global por customer_id"
  value       = aws_dynamodb_table.orders.global_secondary_index[0].arn
  sensitive   = false
}

# ARN del índice secundario global por status
output "status_index_arn" {
  description = "ARN del índice secundario global por status"
  value       = aws_dynamodb_table.orders.global_secondary_index[1].arn
  sensitive   = false
}

# Nombre del índice secundario global por customer_id
output "customer_id_index_name" {
  description = "Nombre del índice secundario global por customer_id"
  value       = aws_dynamodb_table.orders.global_secondary_index[0].name
  sensitive   = false
}

# Nombre del índice secundario global por status
output "status_index_name" {
  description = "Nombre del índice secundario global por status"
  value       = aws_dynamodb_table.orders.global_secondary_index[1].name
  sensitive   = false
}

# Modo de facturación de la tabla
output "billing_mode" {
  description = "Modo de facturación de la tabla (PAY_PER_REQUEST o PROVISIONED)"
  value       = aws_dynamodb_table.orders.billing_mode
  sensitive   = false
}

# Indica si el cifrado está habilitado
output "encryption_enabled" {
  description = "Indica si el cifrado en reposo está habilitado"
  value       = aws_dynamodb_table_server_side_encryption.kms.enabled
  sensitive   = false
}

# ARN de la clave KMS utilizada (si aplica)
output "kms_key_arn" {
  description = "ARN de la clave KMS utilizada para cifrado"
  value       = var.kms_key_arn != null ? var.kms_key_arn : aws_dynamodb_table_server_side_encryption.kms.kms_key_arn
  sensitive   = false
}

// === ARCHIVO: infra/modules/iam/main.tf ===
# Módulo de Terraform para configurar políticas IAM con principio de mínimo privilegio
# Este módulo crea políticas y roles necesarios para acceder a la tabla DynamoDB de órdenes

# Política IAM para acceso completo a la tabla de órdenes (operaciones CRUD)
resource "aws_iam_policy" "dynamodb_full_access_orders" {
  name        = "${var.service_name}-dynamodb-full-access-${var.environment}"
  description = "Política para acceso completo a la tabla de órdenes en DynamoDB"

  # Definición de permisos usando sintaxis JSON de IAM
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Sid" : "AllowFullAccessToOrdersTable",
        "Effect" : "Allow",
        "Action" : [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:BatchGetItem",
          "dynamodb:BatchWriteItem",
          "dynamodb:Scan",
          "dynamodb:Query",
          "dynamodb:DescribeTable",
          "dynamodb:DescribeTimeToLive",
          "dynamodb:DescribeContinuousBackups",
          "dynamodb:DescribeBackup",
          "dynamodb:ListBackups"
        ],
        "Resource" : [
          var.table_arn,
          "${var.table_arn}/index/*"
        ]
      },
      {
        "Sid" : "AllowAccessToStream",
        "Effect" : "Allow",
        "Action" : [
          "dynamodb:GetRecords",
          "dynamodb:GetShardIterator",
          "dynamodb:DescribeStream",
          "dynamodb:ListStreams"
        ],
        "Resource" : "${var.table_arn}/stream/*",
        "Condition" : {
          "Bool" : {
            "aws:SecureTransport" : "true"
          }
        }
      }
    ]
  })

  # Etiquetas para identificación
  tags = merge(
    var.common_tags,
    {
      "Name"        = "${var.service_name}-dynamodb-full-access"
      "Environment" = var.environment
      "Component"   = "orders-persistence"
      "Purpose"     = "Acceso completo a tabla de órdenes"
    }
  )
}

# Política IAM de solo lectura para la tabla de órdenes
resource "aws_iam_policy" "dynamodb_read_only_orders" {
  name        = "${var.service_name}-dynamodb-read-only-${var.environment}"
  description = "Política de solo lectura para la tabla de órdenes en DynamoDB"

  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Sid" : "AllowReadOperations",
        "Effect" : "Allow",
        "Action" : [
          "dynamodb:GetItem",
          "dynamodb:BatchGetItem",
          "dynamodb:Scan",
          "dynamodb:Query",
          "dynamodb:DescribeTable"
        ],
        "Resource" : [
          var.table_arn,
          "${var.table_arn}/index/*"
        ]
      }
    ]
  })

  tags = merge(
    var.common_tags,
    {
      "Name"        = "${var.service_name}-dynamodb-read-only"
      "Environment" = var.environment
      "Component"   = "orders-persistence"
      "Purpose"     = "Lectura de órdenes"
    }
  )
}

# Política para operaciones de escritura específicas (crear y actualizar órdenes)
resource "aws_iam_policy" "dynamodb_write_orders" {
  name        = "${var.service_name}-dynamodb-write-${var.environment}"
  description = "Política para operaciones de escritura en la tabla de órdenes"

  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Sid" : "AllowWriteOperations",
        "Effect" : "Allow",
        "Action" : [
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:BatchWriteItem"
        ],
        "Resource" : var.table_arn,
        "Condition" : {
          "ForAllValues:StringEquals" : {
            "dynamodb:Attributes" : [
              "order_id",
              "customer_id",
              "status",
              "created_at",
              "updated_at",
              "products",
              "total_amount",
              "shipping_address",
              "payment_method",
              "notes",
              "ttl"
            ]
          }
        }
      },
      {
        "Sid" : "AllowDescribeTable",
        "Effect" : "Allow",
        "Action" : [
          "dynamodb:DescribeTable"
        ],
        "Resource" : var.table_arn
      }
    ]
  })

  tags = merge(
    var.common_tags,
    {
      "Name"        = "${var.service_name}-dynamodb-write"
      "Environment" = var.environment
      "Component"   = "orders-persistence"
      "Purpose"     = "Escritura de órdenes"
    }
  )
}

# Rol IAM para el servicio que accede a DynamoDB
resource "aws_iam_role" "orders_service" {
  name = "${var.service_name}-orders-service-role-${var.environment}"

  # Política de confianza que permite al servicio asumir el rol
  assume_role_policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Principal" : {
          "Service" : var.assume_role_service
        },
        "Action" : "sts:AssumeRole",
        "Condition" : {
          "StringEquals" : {
            "aws:RequestTag/${var.environment_tag_key}" : var.environment
          }
        }
      }
    ]
  })

  # Descripción del propósito del rol
  description = "Rol IAM para el servicio de órdenes que accede a DynamoDB"

  # Etiquetas para identificación
  tags = merge(
    var.common_tags,
    {
      "Name"        = "${var.service_name}-orders-service-role"
      "Environment" = var.environment
      "Component"   = "orders-persistence"
      "Purpose"     = "Rol de servicio para acceso a DynamoDB"
    }
  )
}

# Adjuntar política de acceso completo al rol de servicio
resource "aws_iam_role_policy_attachment" "orders_service_full_access" {
  role       = aws_iam_role.orders_service.name
  policy_arn = aws_iam_policy.dynamodb_full_access_orders.arn
}

# Adjuntar política de solo lectura (para componentes que solo leen)
resource "aws_iam_role_policy_attachment" "orders_service_read_only" {
  role       = aws_iam_role.orders_service.name
  policy_arn = aws_iam_policy.dynamodb_read_only_orders.arn
}

# Adjuntar política de escritura específica
resource "aws_iam_role_policy_attachment" "orders_service_write" {
  role       = aws_iam_role.orders_service.name
  policy_arn = aws_iam_policy.dynamodb_write_orders.arn
}

# Política para acceso a CloudWatch Logs (requerido para logging)
resource "aws_iam_policy" "cloudwatch_logs" {
  name        = "${var.service_name}-cloudwatch-logs-${var.environment}"
  description = "Política para escritura de logs en CloudWatch"

  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Action" : [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        "Resource" : "arn:aws:logs:${var.region}:${var.account_id}:log-group:/aws/${var.service_name}/${var.environment}/*"
      }
    ]
  })

  tags = merge(
    var.common_tags,
    {
      "Name"        = "${var.service_name}-cloudwatch-logs"
      "Environment" = var.environment
      "Component"   = "orders-persistence"
      "Purpose"     = "Logging de aplicaciones"
    }
  )
}

# Adjuntar política de CloudWatch al rol de servicio
resource "aws_iam_role_policy_attachment" "orders_service_cloudwatch" {
  role       = aws_iam_role.orders_service.name
  policy_arn = aws_iam_policy.cloudwatch_logs.arn
}

# Generar instancia de secrets manager para credenciales
resource "aws_secretsmanager_secret" "orders_service_credentials" {
  name = "${var.service_name}/orders-service/${var.environment}"

  description = "Secretos para el servicio de órdenes"

  recovery_window_in_days = var.recovery_window_in_days

  # Rotación automática de secretos (opcional)
  rotation_lambda_arn = var.enable_secret_rotation ? var.rotation_lambda_arn : null

  tags = merge(
    var.common_tags,
    {
      "Name"        = "${var.service_name}-credentials"
      "Environment" = var.environment
      "Component"   = "orders-persistence"
      "Purpose"     = "Almacenamiento seguro de credenciales"
    }
  )
}

# Política para acceder a Secrets Manager
resource "aws_iam_policy" "secrets_manager_access" {
  name        = "${var.service_name}-secrets-manager-${var.environment}"
  description = "Política para acceso a Secrets Manager"

  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Action" : [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ],
        "Resource" : aws_secretsmanager_secret.orders_service_credentials.arn
      }
    ]
  })

  tags = merge(
    var.common_tags,
    {
      "Name"        = "${var.service_name}-secrets-manager-access"
      "Environment" = var.environment
      "Component"   = "orders-persistence"
      "Purpose"     = "Acceso a secretos"
    }
  )
}

# Adjuntar política de Secrets Manager al rol
resource "aws_iam_role_policy_attachment" "orders_service_secrets" {
  role       = aws_iam_role.orders_service.name
  policy_arn = aws_iam_policy.secrets_manager_access.arn
}

// === ARCHIVO: infra/modules/iam/outputs.tf ===
output "dynamodb_order_table_access_policy_arn" {
  description = "ARN de la política IAM que permite acceso a la tabla de órdenes de DynamoDB"
  value       = aws_iam_policy.dynamodb_order_access.arn
}

output "dynamodb_order_table_access_policy_id" {
  description = "ID de la política IAM que permite acceso a la tabla de órdenes de DynamoDB"
  value       = aws_iam_policy.dynamodb_order_access.id
}

output "order_service_role_name" {
  description = "Nombre del rol IAM utilizado por el servicio de órdenes"
  value       = aws_iam_role.order_service_role.name
}

output "order_service_role_arn" {
  description = "ARN del rol IAM utilizado por el servicio de órdenes"
  value       = aws_iam_role.order_service_role.arn
}

output "order_service_role_unique_id" {
  description = "ID único del rol IAM utilizado por el servicio de órdenes"
  value       = aws_iam_role.order_service_role.unique_id
}

output "dynamodb_order_table_read_policy_arn" {
  description = "ARN de la política IAM de solo lectura para la tabla de órdenes"
  value       = aws_iam_policy.dynamodb_order_read_only.arn
}

output "dynamodb_order_table_write_policy_arn" {
  description = "ARN de la política IAM de escritura para la tabla de órdenes"
  value       = aws_iam_policy.dynamodb_order_write.arn
}

output "dynamodb_order_table_delete_policy_arn" {
  description = "ARN de la política IAM de eliminación para la tabla de órdenes"
  value       = aws_iam_policy.dynamodb_order_delete.arn
}

output "all_policies_arns" {
  description = "Lista de todos los ARNs de políticas IAM creadas para el servicio de órdenes"
  value       = [aws_iam_policy.dynamodb_order_access.arn, aws_iam_policy.dynamodb_order_read_only.arn, aws_iam_policy.dynamodb_order_write.arn, aws_iam_policy.dynamodb_order_delete.arn]
}

output "role_policy_attachment_name" {
  description = "Nombre del attachment entre el rol y la política de acceso completo"
  value       = aws_iam_role_policy_attachment.order_service_full_access.name
}

// === ARCHIVO: docker-compose.yml ===
# Infraestructura local del reto. SOLO desarrollo: credenciales de ejemplo (local-dev-only), puertos en loopback.
# Levantar: docker compose up -d --wait
name: infra-local
services:
  dynamodb-local:
    image: "amazon/dynamodb-local:2.5.2"
    command: ["-jar","DynamoDBLocal.jar","-sharedDb","-inMemory"]
    ports:
      - "127.0.0.1:8000:8000"
    healthcheck:
      test: ["CMD-SHELL","bash -c ':> /dev/tcp/127.0.0.1/8000' || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 10
      start_period: 5s


// === ARCHIVO: infra-local/README.md ===
# Infraestructura local

Servicios de soporte para el reto, definidos en `docker-compose.yml` (raiz del repo).

```bash
docker compose up -d --wait
```

| Servicio | Imagen | Puertos (host) |
|---|---|---|
| DynamoDB Local | `amazon/dynamodb-local:2.5.2` | 8000 |

Credenciales: solo de desarrollo local (`local-dev-only`, `local`). No son secretos ni deben reutilizarse.
Los scripts de `infra-local/` (tablas, topics) se ejecutan con el compose en estado healthy.


// === ARCHIVO: infra-local/dynamodb/create-tables.sh ===
#!/usr/bin/env bash
# Crea las tablas en DynamoDB Local (idempotente). Credenciales dummy: DynamoDB Local no valida firmas.
set -euo pipefail

export AWS_ACCESS_KEY_ID=local
export AWS_SECRET_ACCESS_KEY=local
export AWS_REGION=us-east-1
ENDPOINT="${DYNAMODB_ENDPOINT:-http://localhost:8000}"

create_table() {
  local name="$1" pk="$2" sk="${3:-}"
  if aws dynamodb describe-table --table-name "$name" --endpoint-url "$ENDPOINT" >/dev/null 2>&1; then
    echo "Tabla $name ya existe"
    return
  fi
  local attrs="AttributeName=$pk,AttributeType=S"
  local keys="AttributeName=$pk,KeyType=HASH"
  if [ -n "$sk" ]; then
    attrs="$attrs AttributeName=$sk,AttributeType=S"
    keys="$keys AttributeName=$sk,KeyType=RANGE"
  fi
  # shellcheck disable=SC2086
  aws dynamodb create-table --table-name "$name" --attribute-definitions $attrs --key-schema $keys \
    --billing-mode PAY_PER_REQUEST --endpoint-url "$ENDPOINT" >/dev/null
  echo "Tabla $name creada"
}

create_table "app-items" "id"

```
