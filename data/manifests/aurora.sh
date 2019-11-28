#!/bin/bash

set -e

# uploads the data from parsed.csv to my Aurora database (configured in /backend/infra/rds)

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
INFRADIR="$DIR/../../backend/infra"
TFOUT="$(terraform output --state $INFRADIR/terraform.tfstate -json)"

docker stop tempdb 2>/dev/null || true
docker rm tempdb 2>/dev/null || true
docker network create tempnet 2>/dev/null || true

rm -rf /tmp/chunk*
split -l 200 -a 1 <(tail -n +2 $DIR/parsed.csv) /tmp/chunk-

cat << EOF > /tmp/load.cmd
LOAD CSV
  FROM '/root/chunk.csv'
  INTO postgresql://rds:password@tempdb:5432/epsteinbrain
  TARGET TABLE manifest
  WITH
    fields optionally enclosed by '"',
    fields escaped by double-quote,
    fields terminated by ','
  BEFORE LOAD DO
    \$$ create table if not exists manifest (
        id int,
        date date,
        aircraft_model varchar(15),
        aircraft_tailsign varchar(15),
        source varchar(25),
        destination varchar(25),
        miles int,
        flight_num varchar(5),
        remarks text,
        endorsement text,
        landings_num varchar(9),
        airplane_category int,
        airplane_class int,
        glider_category int,
        glider_class int,
        helicopter_category int,
        helicopter_class int
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
    postgres:10.7-alpine

  # no idea why this is needed but things started working when I added it!
  docker run --rm --network tempnet dimitri/pgloader sh -c "cat /etc/hosts" 1 > /dev/null

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
    -t manifest \
    -d epsteinbrain \
    -U rds \
    | sed -e '/^--/d' \
    | sed 's/\?/\?\?/g' \
    > /tmp/current.dump

  # this works because there's an AWS cred on my laptop with uber-admin privs
  aws rds-data execute-statement \
    --database epsteinbrain \
    --region $(echo $TFOUT | jq -er '.region.value') \
    --resource-arn $(echo $TFOUT | jq -er '.database_arn.value') \
    --secret-arn $(echo $TFOUT | jq -er '.secretsmanager_arn.value') \
    --sql "$(cat /tmp/current.dump)"

  # delete the throwaway DB
  docker stop tempdb
done

docker network rm tempnet
