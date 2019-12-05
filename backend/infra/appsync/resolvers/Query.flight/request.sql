select *
from manifest
left join meta
on manifest.id = meta.id
where manifest.id = '$ctx.args.id' 
