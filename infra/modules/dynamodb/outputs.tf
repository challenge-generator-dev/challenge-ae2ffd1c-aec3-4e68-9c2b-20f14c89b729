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