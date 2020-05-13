select count(*)
from manifest
where to_tsvector(remarks)
@@ '$ctx.args.query'
