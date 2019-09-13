Records pertaining to Jeffery Epstein, digitized, cleaned and made available in several useful formats.

## manifests
Flight logs from Epstein's personal plane (the "Lolita Express").

### `Epstein-v-Edwards.pdf`
The "original" logs as presented in Epstein v. Edwards, obtained by [Gawker.com](https://gawker.com/flight-logs-put-clinton-dershowitz-on-pedophile-billio-1681039971) in 2015 and downloaded from [DocumentCloud](https://www.documentcloud.org/documents/1507315-epstein-flight-manifests.html).

### `Giuffre-v-Maxwell.pdf`
A subset of the trove of documents (Exhibit BB) unsealed as part of the defamation suit against Ghislaine Maxwell in 2019. Downloaded from [DocumentCloud](https://www.documentcloud.org/documents/6250471-Epstein-Docs.html). Some overlap with above.

### `parsed.csv`
The result of performing OCR on the above PDFs, then parsing the rows into a CSV and eliminating duplication. A manual pass was done for error correction and translation of obvious initializations (JE, GM, JLB, etc) into searchable text. This work builds off previous digitization efforts by some lovely Anonymous, Pizzagate and QAnon people.
  - https://archive.org/details/EpsteinFlightLogsLolitaExpress
  - https://www.scribd.com/doc/261421275/Jeffrey-Epstein-flight-logs-CSV-format#

Disclaimer: I make no representation as to the correctness of this data. It may be incomplete or inaccurate. Many names and fields in the original PDFs were illegible. Please don't sue me or stage my suicide.

### `parsed.db`
SQLite version of above, generated using `csvs-to-sqlite`:

```
csvs-to-sqlite --replace-tables --table manifest -d "Date" -df 'd-b-Y' manifests/parsed.csv manifests/parsed.db
```

