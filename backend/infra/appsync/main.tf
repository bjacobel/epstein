resource "aws_appsync_graphql_api" "appsync" {
  authentication_type = "API_KEY"
  name                = "tf-${var.name}-appsync-api"

  log_config {
    cloudwatch_logs_role_arn = aws_iam_role.assumerole_logs.arn
    field_log_level          = "ERROR"
  }

  tags = {
    Project = var.name
  }
}

resource "aws_appsync_api_key" "default" {
  api_id  = aws_appsync_graphql_api.appsync.id
  expires = "2020-11-25T00:00:00Z"
}

// -----------------------------------
// RDS ACCESS

resource "aws_appsync_datasource" "datasource" {
  api_id           = aws_appsync_graphql_api.appsync.id
  name             = "rds"
  service_role_arn = aws_iam_role.assumerole_rds.arn
  type             = "RELATIONAL_DATABASE"

  # Blocked on https://github.com/terraform-providers/terraform-provider-aws/pull/9337
  relational_database_config {
    http_endpoint_config {
      cluster_identifier = var.rds_cluster_arn
      secret_store_arn   = var.rds_cluster_secret_store_arn
      database_name      = var.rds_cluster_db_name
    }
    source_type = "RDS_HTTP_ENDPOINT"
  }
}

resource "aws_iam_role" "assumerole_rds" {
  name = "tf-${var.name}-role-sts-rds"

  assume_role_policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
          "Service": "appsync.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
POLICY

  tags = {
    Project = var.name
  }
}

resource "aws_iam_role_policy" "allow_aurora" {
  name = "tf-${var.name}-role-policy-aurora"
  role = aws_iam_role.assumerole_rds.id

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "rds-data:*"
      ],
      "Effect": "Allow",
      "Resource": [
        "${var.rds_cluster_arn}"
      ]
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "allow_secretsmanager" {
  name = "tf-${var.name}-role-policy-secrets"
  role = aws_iam_role.assumerole_rds.id

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Effect": "Allow",
      "Resource": [
        "${var.rds_cluster_secret_store_arn}"
      ]
    }
  ]
}
EOF
}

// ------------------------------------------
// LOGGING 

resource "aws_iam_role_policy_attachment" "log_policy" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSAppSyncPushToCloudWatchLogs"
  role       = aws_iam_role.assumerole_logs.name
}

resource "aws_iam_role" "assumerole_logs" {
  name = "tf-${var.name}-role-sts-logs"

  assume_role_policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
          "Service": "appsync.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
POLICY

  tags = {
    Project = var.name
  }
}

// invalidate the CF distro when any text in the VTL directory changes (this is a sledgehammer)
resource "null_resource" "distro_invalidation" {
  triggers = {
    vtl = join(" ", values({ for f in fileset("${path.module}/resolvers", "**/*") : f => file("${path.module}/resolvers/${f}") }))
  }

  provisioner "local-exec" {
    working_dir = "../"
    command     = "aws cloudfront create-invalidation --distribution-id ${var.cache_distro_id} --paths \"/?query*\""
  }
}
