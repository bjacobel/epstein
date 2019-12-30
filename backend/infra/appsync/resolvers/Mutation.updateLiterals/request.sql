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
    where passengers.slug = '$ctx.args.slug'
  )
),
literalUnion as (
  select literal, id from currentLiterals
  union
  select *, (
    select id from currentLiterals limit 1
  ) as id from unnest(ARRAY[$singleQuoteArray]::text[])
)
insert into canonical(literal, passenger)
(select * from literalUnion)
on conflict do nothing

-- statementbreak

select * from passengers where slug = '$ctx.args.slug'
