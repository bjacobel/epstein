resource "aws_db_subnet_group" "rds_db" {
  name        = "tf-${var.name}-db-subnet"
  description = "subnet for ${var.name} database in aurora"
  subnet_ids  = var.subnet_ids

  tags = {
    Project = var.name
  }
}

resource "aws_security_group" "rds_db" {
  vpc_id      = var.vpc_id
  name        = "tf-${var.name}-db-sg"
  description = "security group locking down ingress to db"

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Project = var.name
  }
}

resource "aws_rds_cluster" "rds_db" {
  cluster_identifier      = "tf-${var.name}-rds-cluster"
  vpc_security_group_ids  = [aws_security_group.rds_db.id]
  db_subnet_group_name    = aws_db_subnet_group.rds_db.name
  engine                  = "aurora-postgresql"
  engine_mode             = "serverless"
  engine_version          = "10.7"
  master_username         = var.username
  master_password         = var.password
  database_name           = var.name
  backup_retention_period = 7
  skip_final_snapshot     = true

  # Blocked on https://github.com/terraform-providers/terraform-provider-aws/pull/9657
  enable_data_api = true

  scaling_configuration {
    auto_pause               = true
    max_capacity             = 8
    min_capacity             = 8
    seconds_until_auto_pause = 300
  }

  lifecycle {
    ignore_changes = [
      engine_version,
    ]
  }

  tags = {
    Project = var.name
  }
}
