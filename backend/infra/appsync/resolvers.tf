resource "aws_appsync_resolver" "query_resolver" {
  for_each    = fileset(path.module, "../../resolvers/*.sql")
  api_id      = aws_appsync_graphql_api.appsync.id
  type        = regex("(\\w+)\\.(\\w+)\\.sql", basename(each.value))[0]
  field       = regex("(\\w+)\\.(\\w+)\\.sql", basename(each.value))[1]
  data_source = aws_appsync_datasource.datasource.name

  request_template = <<EOF
{
    "version": "2018-05-29",
    "statements":[
        "${replace(file("${path.module}/${each.value}"), "\n", "\\n")}"
    ]
}
EOF

  response_template = file("${path.module}/../../resolvers/mappings/${basename(each.value)}.vtl")
}
