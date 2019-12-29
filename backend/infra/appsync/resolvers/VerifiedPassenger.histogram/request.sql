select date_trunc('month', date)::date as month, count(*) from manifest
left join meta using(id)
where to_tsvector(remarks) @@ to_tsquery((
  select string_agg(quote_literal(literal), ' | ')
  from passengers
  left join canonical
  on canonical.passenger = passengers.id
  where id = $utils.defaultIfNull($ctx.source.id, 0)
))
group by month
order by month asc
