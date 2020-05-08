# Climatescape Hasura

This folder contains configuration files and tools for working with our backend.

## Overview

We use [Hasura][hasura] as the basis for our backend API.

> Hasura is an open source engine that connects to your databases &
> microservices and auto-generates a production-ready GraphQL backend.

Hasura is built on top of [Postgres][pg], a most excellent database.

>  PostgreSQL is a powerful, open source object-relational database system with
> over 30 years of active development that has earned it a strong reputation for
> reliability, feature robustness, and performance.

The end result is that we're able to maintain a very flexible [GraphQL][graphql]
API with minimal development and operational overhead.

## Setup

1. Install [Docker][docker]
2. Install [Hasura CLI][hasura_cli]

## Running a local instance

You can use docker to spin up a local Hasura + Postgres instance with a single
command:

```bash
$ docker-compose up -d
```

Now try running a console:

```bash
$ hasura console
INFO console running at: http://localhost:9695/
```

If you're running this for the first time, you should a blank slate Hasura
app with no tables or metadata. Try applying our saved configuration to your
instance:

```bash
$ hasura migrate apply
INFO migrations applied
$ hasura metadata apply
INFO Metadata applied
```

Now refresh the console in your browser. If you open the Explorer tab in
GaphiQL, you should see all our queries appear. 🎉

## Making Changes

If you're making any changes to the schema, make sure you do them through this
local console. Hasura will automatically update the relevant metadata and create
new migrations to propagate your changes to other environments.

**Note:** In order for this to work, you *must* use the web interface through
the local console (i.e. `hasura console`), *not* the docker image directly
(i.e. the interface on port 8080).

## Managing Production

First, set up an env file with the necessary variables for connecting to
production:

```bash
$ cp production.example.env production.env
```

You'll need to provide a few missing values there. Ask someone in #development
if you don't already have them.

Test your settings by running a console against production:

```bash
$ hasura console --envfile production.env
```

**Beware: This will open a new window with a Hasura console running against our
production database**

[hasura]: https://hasura.io/
[pg]: https://www.postgresql.org/
[graphql]: https://graphql.org/
[docker]: https://www.docker.com/
[hasura_cli]: https://hasura.io/docs/1.0/graphql/manual/hasura-cli/install-hasura-cli.html


npm install
