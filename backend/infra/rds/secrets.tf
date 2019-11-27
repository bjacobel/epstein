resource "aws_secretsmanager_secret" "rds_creds" {
  name        = "tf-${var.name}-secret-rds-creds"
  description = "Secrets that allow ${var.name} AppSync to hit RDS via the data API"
}

resource "aws_secretsmanager_secret_version" "rds_creds" {
  secret_id = aws_secretsmanager_secret.rds_creds.id
  secret_string = templatefile("${path.module}/creds.json", {
    username = var.username
    password = var.password
  })
}
