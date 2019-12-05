select *
from manifest
left join meta
using(id)
where manifest.id = $ctx.args.id
