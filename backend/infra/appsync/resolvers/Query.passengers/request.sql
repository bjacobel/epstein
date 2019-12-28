#set($includeUnverified = $util.defaultIfNull($ctx.args.includeUnverified, true))
with recursive split (
  passenger,
  str
) as (
  select '', remarks || ', '
  from manifest
  left join meta using(id)
  where meta.logistical = false
  union all
  select
    substr(str, 0, strpos(str, ', ')),
    substr(str, strpos(str, ', ') + 2)
  from split
  where str <> ''
)
select
  count(*),
  coalesce(passengers.name, split.passenger) as literal,
  passengers.*
from split
left join canonical on split.passenger = canonical.literal
full join passengers on canonical.passenger = passengers.id
where (split.passenger <> '' or not $includeUnverified) and (passengers.id is not null or $includeUnverified)
group by coalesce(passengers.name, split.passenger), passengers.id
order by count(*) desc
limit 100
