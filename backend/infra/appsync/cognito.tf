locals {
  base_uris = [
    "http://localhost:8080",
    "https://${var.domain}"
  ]
}

resource "aws_cognito_user_pool" "admins" {
  name = "${var.name}-admin-pool"

  admin_create_user_config {
    allow_admin_create_user_only = true
  }

  password_policy {
    minimum_length  = 8
    require_numbers = true
    require_symbols = true
  }

  tags = {
    Project = var.name
  }
}

resource "aws_cognito_user_pool_client" "client" {
  name = "${var.name}-admin-pool-client"

  user_pool_id    = aws_cognito_user_pool.admins.id
  generate_secret = false
  explicit_auth_flows = [
    "USER_PASSWORD_AUTH"
  ]
  allowed_oauth_flows                  = ["implicit"]
  allowed_oauth_flows_user_pool_client = true
  callback_urls                        = [for u in local.base_uris : "${u}/login"]
  logout_urls                          = local.base_uris
  supported_identity_providers         = ["COGNITO"]
  allowed_oauth_scopes = [
    "aws.cognito.signin.user.admin"
  ]
}

resource "aws_cognito_user_pool_domain" "main" {
  domain       = var.name
  user_pool_id = aws_cognito_user_pool.admins.id
}
