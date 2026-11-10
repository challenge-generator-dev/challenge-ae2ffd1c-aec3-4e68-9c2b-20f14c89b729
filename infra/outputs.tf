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