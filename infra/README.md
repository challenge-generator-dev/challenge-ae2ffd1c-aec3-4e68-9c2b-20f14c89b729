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