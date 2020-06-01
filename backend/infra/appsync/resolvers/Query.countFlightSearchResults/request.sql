select count(*)
from manifest
where to_tsvector(remarks) @@ plainto_tsquery(:query);
