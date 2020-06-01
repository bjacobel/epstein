select *
from manifest
left join meta
using(id)
where to_tsvector(remarks)
@@ plainto_tsquery(:query)
order by date asc
limit $util.defaultIfNull($ctx.args.limit, 100) + 1
offset $util.defaultIfNull($ctx.args.offset, 0)
