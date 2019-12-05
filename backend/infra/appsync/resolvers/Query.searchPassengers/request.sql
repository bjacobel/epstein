select *
from manifest
left join meta
using(id)
where to_tsvector(remarks)
@@ '$ctx.args.query'
order by date asc
