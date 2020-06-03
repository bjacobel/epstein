select *
from passengers
where to_tsvector(name)
@@ plainto_tsquery(:query)
limit $util.defaultIfNull($ctx.args.limit, 100) + 1
offset $util.defaultIfNull($ctx.args.offset, 0)
