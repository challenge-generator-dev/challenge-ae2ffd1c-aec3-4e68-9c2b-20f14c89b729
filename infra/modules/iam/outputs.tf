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