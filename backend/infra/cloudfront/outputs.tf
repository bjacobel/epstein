output "distribution_arn" {
  value = aws_cloudfront_distribution.appsync_distro.arn
}

output "distribution_id" {
  value = aws_cloudfront_distribution.appsync_distro.id
}

output "distribution_endpoint" {
  value = "https://api.${var.domain}"
}
