locals {
  resolver_dir = "${path.module}/resolvers"
  replacements = merge(
    {
      "filesDistro" = var.files_distro
    },
    { for f in fileset("${local.resolver_dir}/snippets", "*.vtl") :
      regex("(\\w+)\\.vtl", f)[0] => file("${local.resolver_dir}/snippets/${f}")
    }
  )
}

resource "aws_appsync_resolver" "query_resolver" {
  for_each = fileset(local.resolver_dir, "**/request.sql")

  type  = regex("(\\w+)\\.(\\w+)\\/", each.value)[0]
  field = regex("(\\w+)\\.(\\w+)\\/", each.value)[1]

  data_source = aws_appsync_datasource.datasource.name
  api_id      = aws_appsync_graphql_api.appsync.id

  request_template = <<EOF
{
    "version": "2018-05-29",
    "statements":[
        "${join("\",\"", split("-- statementbreak", replace(file("${local.resolver_dir}/${each.value}"), "/[\\n\\t]/", " ")))}"
    ],
    "variableMap": {
        ":query": $util.toJson($ctx.args.query.replace("'", "''"))
    }
}
EOF

  response_template = templatefile(
    replace(
      "${local.resolver_dir}/${each.value}",
      basename(each.value), "response.vtl"
    ),
    local.replacements
  )
}
