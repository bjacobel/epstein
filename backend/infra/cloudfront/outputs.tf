output "distribution_arn" {
  value = aws_cloudfront_distribution.appsync_distro.arn
}

output "distribution_endpoint" {
  value = "https://${aws_cloudfront_distribution.appsync_distro.domain_name}"
}
