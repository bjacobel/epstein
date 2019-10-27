Records pertaining to Jeffery Epstein, digitized, cleaned and made available in several useful formats.

## manifests
Flight logs from Epstein's personal plane (the "Lolita Express").

### `Epstein-v-Edwards.pdf`
The "original" logs as presented in Epstein v. Edwards, obtained by [Gawker.com](https://gawker.com/flight-logs-put-clinton-dershowitz-on-pedophile-billio-1681039971) in 2015 and downloaded from [DocumentCloud](https://www.documentcloud.org/documents/1507315-epstein-flight-manifests.html).

### `Giuffre-v-Maxwell-bw.pdf`
A subset of the trove of documents (Exhibit BB) unsealed as part of the defamation suit against Ghislaine Maxwell in 2019. Downloaded from [DocumentCloud](https://www.documentcloud.org/documents/6250471-Epstein-Docs.html). Some overlap with above. Converted from original color to B/W because the big color one was too large for GitHub, but the original is [available on S3](https://files.bjacobel.com/Giuffre-v-Maxwell.pdf).

### `parsed.csv`
The result of performing OCR on the above PDFs, then parsing the rows into a CSV and eliminating duplication. A manual pass was done for error correction. This work builds off previous digitization efforts by some lovely Anonymous, Pizzagate and QAnon people.
  - https://archive.org/details/EpsteinFlightLogsLolitaExpress
  - https://www.scribd.com/doc/261421275/Jeffrey-Epstein-flight-logs-CSV-format#

Disclaimer: I make no representation as to the correctness of this data. It may be incomplete or inaccurate. Many names and fields in the original PDFs were illegible. Please don't sue me or stage my suicide.

### `parsed.db`
SQLite table with data from above. 

Contains a table `manifest`, generated using `csvs-to-sqlite`:

```
csvs-to-sqlite --replace-tables --table manifest -d "Date" -df 'd-b-Y' manifests/parsed.csv manifests/parsed.db
```

Contains a table `logistical`, which notes IDs of flight entries I suspect (based on description or aircraft identifier) to be maintenance, training or reposition flights (and thus not interesting to the manifest analysis, as the only passengers are usually pilots).

Contains a table `canonical`, which contains a mapping of initializations, misspellings (in original document) and familiar names to canonical names. Note that this is in some instances informed speculation. An entry containing "JS" several rows after the first flight of "John Smith" likely indicates John Smith's second flight, but obviously cannot be confirmed.

