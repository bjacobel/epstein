select * from manifest
left join meta using(id)
where meta.logistical = $ctx.args.includeLogistical
or meta.logistical = false
order by date asc
limit $util.defaultIfNull($ctx.args.limit, 100) + 1
offset $util.defaultIfNull($ctx.args.offset, 0)
