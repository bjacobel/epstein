select count(*)
from manifest
where to_tsvector(remarks) @@ to_tsquery(:query);
