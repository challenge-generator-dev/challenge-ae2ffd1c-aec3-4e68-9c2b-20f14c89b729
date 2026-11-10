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