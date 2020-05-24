#set($String = "")
#set($singleQuoteArray = "")
#foreach($lit in $ctx.args.literals)
  #set($singleQuoteArray = $singleQuoteArray.concat($String.format("'%s', ", $lit)))
#end
#set($singleQuoteArray = $singleQuoteArray.replaceAll(",\ $", ""))

with currentLiterals as (
  select literal, passenger as id from canonical
  where canonical.passenger = (
    select id from passengers
    where passengers.slug = :slug
  )
),
literalUnion as (
  select literal, id from currentLiterals
  union
  select *, (
    select id from passengers
    where passengers.slug = :slug
  ) as id from unnest(ARRAY[$singleQuoteArray]::text[])
)
insert into canonical(literal, passenger)
(select * from literalUnion)
on conflict do nothing;

with currentLiterals as (
  select literal, passenger as id from canonical
  where canonical.passenger = (
    select id from passengers
    where passengers.slug = :slug
  )
),
toDelete as (
  select literal, id from currentLiterals
  except
  select *, (
    select id from passengers
    where passengers.slug = :slug
  ) as id from unnest(ARRAY[$singleQuoteArray]::text[])
)
delete from canonical where literal in (select literal from toDelete);

-- statementbreak

select * from passengers where slug = :slug
