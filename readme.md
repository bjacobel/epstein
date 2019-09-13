Records pertaining to Jeffery Epstein, digitized, cleaned and made available in several useful formats.

## manifests
the flight logs from Epstein's personal plane (the "Lolita Express") originally published by [Gawker.com](https://gawker.com/flight-logs-put-clinton-dershowitz-on-pedophile-billio-1681039971) 

### `original.pdf`
The original logs as presented in Epstein v. Edwards, downloaded from [DocumentCloud](https://www.documentcloud.org/documents/1507315-epstein-flight-manifests.html)

### `parsed.csv`
The result of performing OCR on the above PDF, then parsing the rows into a CSV. A manual pass was done for error correction and date sorting. This work is based on previous digitization efforts by some lovely Anonymous, Pizzagate and QAnon people.
  - https://archive.org/details/EpsteinFlightLogsLolitaExpress
  - https://www.scribd.com/doc/261421275/Jeffrey-Epstein-flight-logs-CSV-format#

### `parsed.db`
SQLite version of above, generated using `csvs-to-sqlite`:

```
csvs-to-sqlite --replace-tables --table manifest -d "Date" -df 'd-b-Y' manifests/parsed.csv manifests/parsed.db
```

