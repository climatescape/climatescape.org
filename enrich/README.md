# Climatescape Enrichment

This package contains scripts which query external data sources in order to
enrich our core community-generated content. In order to run the scripts, the
following environment variables must be set:

* All: `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`
* Crunchbase: `CRUNCHBASE_API_KEY`
* Geo: *no additional variables needed*

See [`.env.sample`](../.env.sample) for more information

## Running

First, make sure you are in the `enrich` folder (not the repo root).

```bash
$ cd enrich
```

Install the necessary dependencies.

```bash
$ npm install
```

If all the ENV variables are provided, you can run all the enrichment scripts
in one fell swoop.

```bash
$ npm run enrich
```

Otherwise, you can run each individually

```bash
$ npm run enrich-crunchbase
$ npm run enrich-geo
```

## Developing

There are tests associated with each of the enrichment scripts, which can be
run like so.

```bash
$ npm test
```

Before pushing your work, it's a good idea to run the linter, which will fail
the CI if anything is out of spec.

```bash
$ npm run lintfix
```
