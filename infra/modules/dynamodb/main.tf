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