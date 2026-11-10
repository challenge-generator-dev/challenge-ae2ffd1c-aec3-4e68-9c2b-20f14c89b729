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