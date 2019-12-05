select * from airports where iata_code = '$ctx.source.destination' or gps_code = '$ctx.source.destination'
