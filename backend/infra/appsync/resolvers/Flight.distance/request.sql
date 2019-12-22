select
  ST_Distance(
    ST_MakePoint(source_airport.longitude_deg, source_airport.latitude_deg)::geography,
    ST_MakePoint(dest_airport.longitude_deg, dest_airport.latitude_deg)::geography,
    false
  ) as distance
from manifest

left join airports source_airport
on manifest.source = source_airport.ident
or manifest.source = source_airport.iata_code
or manifest.source = source_airport.gps_code

left join airports dest_airport
on manifest.destination = dest_airport.ident
or manifest.destination = dest_airport.iata_code
or manifest.destination = dest_airport.gps_code

where manifest.id = $ctx.source.id
