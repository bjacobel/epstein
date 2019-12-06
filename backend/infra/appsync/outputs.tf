output "endpoint" {
  value = aws_appsync_graphql_api.appsync.uris["GRAPHQL"]
}

output "api_id" {
  value = aws_appsync_graphql_api.appsync.id
}

output "api_key" {
  value = aws_appsync_api_key.default.key
}
