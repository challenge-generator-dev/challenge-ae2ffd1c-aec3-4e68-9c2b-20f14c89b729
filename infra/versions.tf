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