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