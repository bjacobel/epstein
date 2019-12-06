#!/bin/bash

set -e

# uploads the data from airports.csv to my Aurora database (configured in /backend/infra/rds)

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
INFRADIR="$DIR/../../../backend/infra"
TFOUT="$(terraform output --state $INFRADIR/terraform.tfstate -json)"

function execute-statement {
  # this works because there's an AWS cred on my laptop with uber-admin privs
  aws rds-data execute-statement \
    --database epsteinbrain \
    --region $(echo $TFOUT | jq -er '.region.value') \
    --resource-arn $(echo $TFOUT | jq -er '.database_arn.value') \
    --secret-arn $(echo $TFOUT | jq -er '.secretsmanager_arn.value') \
    --sql "$1"
}

docker stop tempdb 2>/dev/null || true
docker rm tempdb 2>/dev/null || true
docker network create tempnet 1>/dev/null 2>/dev/null || true

rm -rf /tmp/chunk*
split -l 200 -a 2 <(tail -n +2 $DIR/airports.csv) /tmp/chunk-

# start with aairports table
execute-statement "
  drop table if exists airports;
  create table airports (
    id int,
    ident varchar(7),
    type varchar(14),
    name text,
    latitude_deg double precision,
    longitude_deg double precision,
    elevation_ft int,
    continent varchar(2),
    iso_country varchar(3),
    iso_region varchar(7),
    municipality text,
    scheduled_service boolean,
    gps_code varchar(4),
    iata_code varchar(4),
    local_code varchar(7),
    home_link text,
    wikipedia_link text,
    keywords text
  );
"

cat << EOF > /tmp/load.cmd
LOAD CSV
  FROM '/root/chunk.csv'
  INTO postgresql://rds:password@tempdb:5432/epsteinbrain
  TARGET TABLE airports
  WITH
    fields optionally enclosed by '"',
    fields escaped by double-quote,
    fields terminated by ','
  BEFORE LOAD DO
    \$$ create table if not exists airports (
      id int,
      ident varchar(7),
      type varchar(14),
      name text,
      latitude_deg double precision,
      longitude_deg double precision,
      elevation_ft int,
      continent varchar(2),
      iso_country varchar(3),
      iso_region varchar(7),
      municipality text,
      scheduled_service boolean,
      gps_code varchar(4),
      iata_code varchar(4),
      local_code varchar(7),
      home_link text,
      wikipedia_link text,
      keywords text
    );
  \$$;
EOF

for chunk in /tmp/chunk-*; do
  base=`basename $chunk`

  # create a throwaway pg DB
  docker run --rm -d \
    --name tempdb \
    -p 5432:5432 \
    -e POSTGRES_USER=rds \
    -e POSTGRES_PASSWORD=password \
    -e POSTGRES_DB=epsteinbrain \
    --network tempnet \
    postgres:10.7-alpine 1>/dev/null

  # no idea why this is needed but things started working when I added it!
  docker run --rm --network tempnet dimitri/pgloader sh -c "cat /etc/hosts" 1>/dev/null

  # use pgloader to fill the throwaway DB
  docker run --rm \
    --security-opt seccomp=unconfined \
    -v $chunk:/root/chunk.csv \
    -v /tmp/load.cmd:/root/load.cmd \
    --network tempnet \
    dimitri/pgloader \
    pgloader /root/load.cmd

  # generate a dump from the DB
  docker exec \
    -e PGPASS=password \
    tempdb \
    pg_dump \
    -Fp \
    --inserts \
    --data-only \
    -t airports \
    -d epsteinbrain \
    -U rds \
    | sed -e '/^--/d' \
    | sed 's/\?/\?\?/g' \
    > /tmp/current.dump

  execute-statement "$(cat /tmp/current.dump)" 1>/dev/null

  # delete the throwaway DB
  docker stop tempdb 1>/dev/null
done

AIRPORTS=$(execute-statement "select count(*) from airports" | jq -er ".records[0][0].longValue")
echo "added $AIRPORTS rows to airports"

docker network rm tempnet 1>/dev/null
