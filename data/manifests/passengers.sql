-- split the passenger manifest field along commas
-- return separate persons grouped and ordered by frequency

WITH split (
	ID,
	passenger,
	str,
	logistical
) AS (
	SELECT
		manifest.ID,
		'',
		"Remarks, Procedures, Maneuvers, Endorsements" || ', ',
		meta.logistical
	FROM
		manifest
	LEFT JOIN meta ON manifest.ID = meta.id
WHERE
	meta.logistical == 0
UNION ALL
SELECT
	ID,
	substr(str,
		0,
		instr(str,
			', ')),
	substr(str,
		instr(str,
			', ') + 2),
	logistical
FROM
	split
WHERE
	str <> ''
)
SELECT
	count(*), IFNULL(canonical.canonical, split.passenger) AS cname
FROM
	split
	LEFT JOIN canonical ON split.passenger = upper(canonical.literal)
WHERE
	passenger <> ''
GROUP BY
	cname
ORDER BY
	count(cname)
	DESC