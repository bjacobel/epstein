CREATE OR REPLACE FUNCTION countFlightSearchResults(query_param varchar(100))
RETURNS bigint
LANGUAGE SQL
AS $BODY$
  select count(*) from manifest where to_tsvector(remarks) @@ to_tsquery(query_param);
$BODY$;

-- statementbreak

SELECT countFlightSearchResults(:query);
