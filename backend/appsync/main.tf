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

resource "aws_iam_role" "assumerole_aurora" {
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

resource "aws_iam_role_policy" "allow_aurora" {
  name = "tf-${var.name}-role-policy-aurora"
  role = aws_iam_role.assumerole_aurora.id

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "dynamodb:*"
      ],
      "Effect": "Allow",
      "Resource": [
        "${var.rds_cluster_arn}"
      ]
    }
  ]
}
EOF

  tags = {
    Project = var.name
  }
}

resource "aws_appsync_datasource" "datasource" {
  api_id           = aws_appsync_graphql_api.appsync.id
  name             = "tf-${var.name}-appsync-datasource"
  service_role_arn = aws_iam_role.assumerole_aurora.arn
  type             = "RELATIONAL_DATABASE"

  # Blocked on https://github.com/terraform-providers/terraform-provider-aws/pull/9337
  relational_database_config {
    http_endpoint_config = {
      cluster_identifier = var.rds_cluster_id
      secret_store_arn   = var.rds_cluster_secret_store_arn
      database_name      = var.rds_cluster_db_name
    }
    source_type = "RDS_HTTP_ENDPOINT"
  }
}
