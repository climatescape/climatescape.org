We decided to use [Knex.js](http://knexjs.org/) as the lightweight query builder to access Postgres database, because
writing raw queries against [pg client for Node](https://github.com/brianc/node-postgres) is very cumbersome.

We first tried Sequelize ORM, but encountered many problems with it: see [this message](
https://github.com/climatescape/climatescape.org/pull/87#issuecomment-592920857). In addition, Sequelize has more
non-trivial concepts than Knex.js that people who are new to the codebase would have to learn, which is not a good
because we want to enable people to contribute something to the backend even with very little, one-off time investment.