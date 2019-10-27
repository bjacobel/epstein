-- split the passenger manifest field along commas
-- return separate persons grouped and ordered by frequency

WITH split(ID, passenger, str) AS (
  SELECT ID, '', "Remarks, Procedures, Maneuvers, Endorsements"||', ' FROM manifest
  WHERE ID not in logistical
  UNION ALL SELECT ID,
  substr(str, 0, instr(str, ', ')),
  substr(str, instr(str, ', ') + 2)
  FROM split WHERE str <> ''
)

SELECT count(*), IFNULL(canonical.canonical, split.passenger) as cname
FROM split
LEFT JOIN canonical on split.passenger=upper(canonical.literal)
WHERE passenger <> ''
GROUP BY cname ORDER BY count(cname)
