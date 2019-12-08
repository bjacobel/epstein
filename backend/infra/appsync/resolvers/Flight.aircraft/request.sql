with aircraft_combos as (
  select distinct
    aircraft_model as model,
    aircraft_tailsign as tailsign,
    concat(aircraft_model, aircraft_tailsign) as uid
  from manifest
  where aircraft_tailsign = '$ctx.source.aircraft_tailsign'
  and aircraft_model = '$ctx.source.aircraft_model'
  group by aircraft_model, aircraft_tailsign
)
select uuid_generate_v5(uuid_ns_oid(), uid) as id
from aircraft_combos
