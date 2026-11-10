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