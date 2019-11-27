output "service_url" {
  value = module.cloudfront.distribution_endpoint
}

output "api_id" {
  value = module.appsync.api_id
}

output "region" {
  value = data.aws_region.current
}
