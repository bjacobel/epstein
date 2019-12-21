select * from airports where
  iata_code = '$ctx.source.source'
  or gps_code = '$ctx.source.source'
  or ident = '$ctx.source.source'
