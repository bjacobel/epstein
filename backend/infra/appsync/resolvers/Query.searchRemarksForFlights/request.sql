select *
from manifest
left join meta
using(id)
where to_tsvector(remarks)
@@ '$ctx.args.query'
order by date asc
limit $util.defaultIfNull($ctx.args.limit, 100) + 1
offset $util.defaultIfNull($ctx.args.offset, 0)

-- statementbreak

select count(*)
from manifest
where to_tsvector(remarks)
@@ '$ctx.args.query'
