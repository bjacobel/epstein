WITH RECURSIVE split (
	passenger,
	str
) AS (
	SELECT
		'',
		remarks || ', '
	FROM
		manifest
  WHERE id = $ctx.source.id
  UNION ALL
  SELECT
    substr(str, 0, strpos(str, ', ')),
    substr(str, strpos(str, ', ') + 2)
  FROM split
  WHERE str <> ''
)
SELECT passengers.*, split.passenger as literal
FROM split
LEFT JOIN canonical ON split.passenger = canonical.literal
left join passengers on canonical.passenger = passengers.id
WHERE split.passenger <> ''
