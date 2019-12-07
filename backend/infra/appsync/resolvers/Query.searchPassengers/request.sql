select *
from manifest
left join meta
using(id)
where to_tsvector(remarks)
@@ '$ctx.args.query'
order by date asc
limit $util.defaultIfNull($ctx.args.limit, 100)
offset $util.defaultIfNull($ctx.args.offset, 0)
