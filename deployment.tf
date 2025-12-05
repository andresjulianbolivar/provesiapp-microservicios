# ***************** Universidad de los Andes ***********************
# ****** Departamento de Ingeniería de Sistemas y Computación ******
# ********** Arquitectura y diseño de Software - ISIS2503 **********
#
# Infraestructura para microservicios Provesi (Aduanas + Pedidos + Kong)
#
# Elementos a desplegar en AWS:
# 1. Grupos de seguridad:
#    - msd-traffic-api   (puerto 8000, Kong API Gateway)
#    - msd-traffic-apps  (puerto 8080, microservicios Django)
#    - msd-traffic-db    (puerto 5432, PostgreSQL)
#    - msd-traffic-ssh   (puerto 22)
#
# 2. Instancias EC2:
#    - msd-aduanas-db      (PostgreSQL para aduanas)
#    - msd-pedidos-db      (PostgreSQL para pedidos)
#    - msd-aduanas-ms      (Microservicio Aduanas – repo provesiapp)
#    - msd-pedidos-ms      (Microservicio Pedidos – repo provesiapp-microservicios/pedidos)
#    - msd-kong            (Kong API Gateway configurado con kong.yml)
#
# NOTA:
# - Se asume que:
#   * En el repo de aduanas (provesiapp) existe un Dockerfile en la carpeta de servicio
#     (por ejemplo cotizaciones) con un placeholder <ADUANAS_DB_HOST>.
#   * En el repo de pedidos (provesiapp-microservicios/pedidos) existe un Dockerfile
#     con un placeholder <PEDIDOS_DB_HOST>.
#   * En kong.yml (en el repo provesiapp) hay placeholders <ADUANAS_HOST> y <PEDIDOS_HOST>
#     que serán reemplazados por las IPs privadas de los microservicios.
#
# - El frontend (carpeta frontend del repo provesiapp-microservicios) debe configurarse
#   para consumir la API desde: http://<KONG_PUBLIC_IP>:8000
# ******************************************************************

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "6.18.0"
    }
  }
}

variable "region" {
  description = "AWS region for deployment"
  type        = string
  default     = "us-east-1"
}

variable "project_prefix" {
  description = "Prefix used for naming AWS resources"
  type        = string
  default     = "msd"
}

variable "instance_type" {
  description = "EC2 instance type for application hosts"
  type        = string
  default     = "t3.micro"
}

provider "aws" {
  region = var.region
}

locals {
  project_name        = "${var.project_prefix}-microservices-provesi"
  aduanas_repository  = "https://github.com/andresjulianbolivar/provesiapp.git"
  pedidos_repository  = "https://github.com/andresjulianbolivar/provesiapp-microservicios.git"

  common_tags = {
    Project   = local.project_name
    ManagedBy = "Terraform"
  }
}

# AMI Ubuntu 24.04 para microservicios / Kong
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# ---------- SECURITY GROUPS ----------

resource "aws_security_group" "traffic_api" {
  name        = "${var.project_prefix}-traffic-api"
  description = "Allow HTTP traffic to API Gateway (Kong) on port 8000"

  ingress {
    description = "HTTP access for API gateway"
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(local.common_tags, {
    Name = "${var.project_prefix}-traffic-api"
  })
}

resource "aws_security_group" "traffic_apps" {
  name        = "${var.project_prefix}-traffic-apps"
  description = "Allow application traffic on port 8080"

  ingress {
    description = "HTTP access for service layer"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(local.common_tags, {
    Name = "${var.project_prefix}-traffic-apps"
  })
}

resource "aws_security_group" "traffic_db" {
  name        = "${var.project_prefix}-traffic-db"
  description = "Allow PostgreSQL access on 5432"

  ingress {
    description = "Traffic from anywhere to DB (lab)"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(local.common_tags, {
    Name = "${var.project_prefix}-traffic-db"
  })
}

resource "aws_security_group" "traffic_ssh" {
  name        = "${var.project_prefix}-traffic-ssh"
  description = "Allow SSH access"

  ingress {
    description = "SSH access from anywhere (lab)"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(local.common_tags, {
    Name = "${var.project_prefix}-traffic-ssh"
  })
}

# ---------- INSTANCIAS DE BASES DE DATOS (PostgreSQL en Docker) ----------

resource "aws_instance" "aduanas_db" {
  ami                         = "ami-051685736c7b35f95"
  instance_type               = var.instance_type
  associate_public_ip_address = true
  vpc_security_group_ids      = [
    aws_security_group.traffic_db.id,
    aws_security_group.traffic_ssh.id
  ]

  user_data = <<-EOT
              #!/bin/bash
              docker run --restart=always -d \
                -e POSTGRES_USER=aduanas_user \
                -e POSTGRES_DB=aduanas_db \
                -e POSTGRES_PASSWORD=isis2503 \
                -p 5432:5432 \
                --name aduanas-db postgres
              EOT

  tags = merge(local.common_tags, {
    Name = "${var.project_prefix}-aduanas-db"
    Role = "aduanas-db"
  })
}

resource "aws_instance" "pedidos_db" {
  ami                         = "ami-051685736c7b35f95"
  instance_type               = var.instance_type
  associate_public_ip_address = true
  vpc_security_group_ids      = [
    aws_security_group.traffic_db.id,
    aws_security_group.traffic_ssh.id
  ]

  user_data = <<-EOT
              #!/bin/bash
              docker run --restart=always -d \
                -e POSTGRES_USER=pedidos_user \
                -e POSTGRES_DB=pedidos_db \
                -e POSTGRES_PASSWORD=isis2503 \
                -p 5432:5432 \
                --name pedidos-db postgres
              EOT

  tags = merge(local.common_tags, {
    Name = "${var.project_prefix}-pedidos-db"
    Role = "pedidos-db"
  })
}

# ---------- INSTANCIA MICROSERVICIO ADUANAS (Django, repo provesiapp) ----------

resource "aws_instance" "aduanas_ms" {
  ami                         = "ami-051685736c7b35f95"
  instance_type               = var.instance_type
  associate_public_ip_address = true
  vpc_security_group_ids      = [
    aws_security_group.traffic_apps.id,
    aws_security_group.traffic_ssh.id
  ]

  user_data = <<-EOT
              #!/bin/bash

              # Instalar herramientas básicas
              sudo dnf install -y nano git

              mkdir -p /labs
              cd /labs

              # Clonar repositorio monolito (aduanas)
              if [ ! -d provesiapp ]; then
                git clone ${local.aduanas_repository}
              fi

              cd provesiapp

              # Guardar la IP privada de la base de datos de aduanas
              echo "ADUANAS_DB_HOST=${aws_instance.aduanas_db.private_ip}" | sudo tee -a /etc/environment

              # URL base del microservicio de pedidos
              echo "PEDIDOS_MS_BASE_URL=http://${aws_instance.pedidos_ms.private_ip}:8080" | sudo tee -a /etc/environment

              # (Opcional) Ajustar Dockerfile o configuración del servicio de aduanas/cotizaciones
              # Se asume un placeholder <ADUANAS_DB_HOST> en el Dockerfile del servicio
              if [ -f "./cotizaciones/Dockerfile" ]; then
                cd cotizaciones
                sudo sed -i "s/<ADUANAS_DB_HOST>/${aws_instance.aduanas_db.private_ip}/g" Dockerfile
              fi

              EOT

  tags = merge(local.common_tags, {
    Name = "${var.project_prefix}-aduanas-ms"
    Role = "aduanas-ms"
  })

  depends_on = [
    aws_instance.aduanas_db,
    aws_instance.pedidos_ms
  ]
}

# ---------- INSTANCIA MICROSERVICIO PEDIDOS (Django, repo provesiapp-microservicios/pedidos) ----------

resource "aws_instance" "pedidos_ms" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = var.instance_type
  associate_public_ip_address = true
  vpc_security_group_ids      = [
    aws_security_group.traffic_apps.id,
    aws_security_group.traffic_ssh.id
  ]

  user_data = <<-EOT
              #!/bin/bash

              # Exportar hosts de dependencias
              export PEDIDOS_DB_HOST=${aws_instance.pedidos_db.private_ip}
              echo "PEDIDOS_DB_HOST=${aws_instance.pedidos_db.private_ip}" | sudo tee -a /etc/environment

              sudo apt-get update -y
              sudo apt-get install -y python3-pip git build-essential libpq-dev python3-dev

              mkdir -p /labs
              cd /labs

              # Clonar repo de microservicios (pedidos + frontend)
              if [ ! -d provesiapp-microservicios ]; then
                git clone ${local.pedidos_repository} provesiapp-microservicios
              fi

              cd provesiapp-microservicios/manejador_pedidos

              # (Opcional) ajustar Dockerfile del microservicio de pedidos
              # Se asume un placeholder <PEDIDOS_DB_HOST> en el Dockerfile
              if [ -f "Dockerfile" ]; then
                sudo sed -i "s/<PEDIDOS_DB_HOST>/${aws_instance.pedidos_db.private_ip}/g" Dockerfile
              fi

              # Instalar el módulo de venv para Python 3.12
              sudo apt-get install -y python3.12-venv

              # Crear el entorno virtual (.venv) en la carpeta actual
              python3 -m venv .venv

              # Activar el entorno virtual
              source .venv/bin/activate

              # Instalar dependencias del microservicio
              pip install --upgrade pip
              pip install -r requirements.txt

              # Ejecutar migraciones
              python manage.py makemigrations
              python manage.py migrate

              # Ejecutar el servidor Django en segundo plano
              nohup python manage.py runserver 0.0.0.0:8080 > /var/log/pedidos_ms.log 2>&1 &

              EOT

  tags = merge(local.common_tags, {
    Name = "${var.project_prefix}-pedidos-ms"
    Role = "pedidos-ms"
  })

  depends_on = [aws_instance.pedidos_db]
}

# ---------- INSTANCIA KONG (API GATEWAY) ----------

resource "aws_instance" "kong" {
  ami                         = "ami-051685736c7b35f95"
  instance_type               = var.instance_type
  associate_public_ip_address = true
  vpc_security_group_ids      = [
    aws_security_group.traffic_api.id,
    aws_security_group.traffic_ssh.id
  ]

  user_data = <<-EOT
              #!/bin/bash

              # Exportar IPs de microservicios para referencia
              echo "ADUANAS_HOST=${aws_instance.aduanas_ms.private_ip}" | sudo tee -a /etc/environment
              echo "PEDIDOS_HOST=${aws_instance.pedidos_ms.private_ip}" | sudo tee -a /etc/environment

              sudo dnf install -y nano git docker
              sudo systemctl enable docker
              sudo systemctl start docker

              mkdir -p /labs
              cd /labs

              # Clonar repo donde está kong.yml (monolito de aduanas)
              if [ ! -d provesiapp ]; then
                git clone ${local.aduanas_repository}
              fi
              cd provesiapp

              # Sustituir placeholders en kong.yml
              if [ -f "kong.yml" ]; then
                sudo sed -i "s/<ADUANAS_HOST>/${aws_instance.aduanas_ms.private_ip}/g" kong.yml
                sudo sed -i "s/<PEDIDOS_HOST>/${aws_instance.pedidos_ms.private_ip}/g" kong.yml
              fi

              # Crear red para Kong (opcional, por si luego se añaden contenedores)
              docker network create kong-net || true

              # Levantar Kong en modo declarativo leyendo kong.yml
              docker run -d --name kong --network=kong-net --restart=always \
                -v "$(pwd):/kong/declarative/" \
                -e "KONG_DATABASE=off" \
                -e "KONG_DECLARATIVE_CONFIG=/kong/declarative/kong.yml" \
                -p 8000:8000 \
                kong/kong-gateway
              EOT

  tags = merge(local.common_tags, {
    Name = "${var.project_prefix}-kong"
    Role = "api-gateway"
  })

  depends_on = [
    aws_instance.aduanas_ms,
    aws_instance.pedidos_ms
  ]
}

# ---------- OUTPUTS ----------

output "kong_public_ip" {
  description = "Public IP address for the Kong API Gateway instance (usar en el frontend)"
  value       = aws_instance.kong.public_ip
}

output "aduanas_ms_public_ip" {
  description = "Public IP address for the Aduanas Microservice instance"
  value       = aws_instance.aduanas_ms.public_ip
}

output "pedidos_ms_public_ip" {
  description = "Public IP address for the Pedidos Microservice instance"
  value       = aws_instance.pedidos_ms.public_ip
}

output "aduanas_db_private_ip" {
  description = "Private IP address for the Aduanas Database instance"
  value       = aws_instance.aduanas_db.private_ip
}

output "pedidos_db_private_ip" {
  description = "Private IP address for the Pedidos Database instance"
  value       = aws_instance.pedidos_db.private_ip
}
