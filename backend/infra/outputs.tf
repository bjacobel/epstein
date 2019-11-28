output "service_url" {
  value = module.cloudfront.distribution_endpoint
}

output "api_id" {
  value = module.appsync.api_id
}

output "region" {
  value = data.aws_region.current.name
}

output "database_arn" {
  value = module.rds.rds_cluster_arn
}

output "secretsmanager_arn" {
  value = module.rds.rds_cluster_secret_store_arn
}
