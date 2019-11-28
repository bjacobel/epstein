locals {
  vars = {
    id = "$ctx.args.id"
  }
}

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
        "${replace(templatefile("${path.module}/${each.value}", local.vars), "\n", "\\n")}"
    ]
}
EOF

  response_template = <<EOF
#if($ctx.error)
    $utils.error($ctx.error.message, $ctx.error.type)
#end

$utils.toJson($utils.rds.toJsonObject($ctx.result)[0])
EOF
}
