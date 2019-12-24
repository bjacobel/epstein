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
}
