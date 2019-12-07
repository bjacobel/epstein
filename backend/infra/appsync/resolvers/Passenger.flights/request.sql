select * from manifest
left join meta using(id)
where to_tsvector(remarks) @@ to_tsquery((
  select string_agg(quote_literal(literal), ' | ')
  from passengers
  left join canonical
  on canonical.passenger = passengers.id
  where id = $utils.defaultIfNull($ctx.source.id, 0)
))
order by date asc
limit $util.defaultIfNull($ctx.args.limit, 100)
offset $util.defaultIfNull($ctx.args.offset, 0)
