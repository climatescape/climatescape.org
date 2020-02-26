const Url = require("url")
const Pool = require("pg-pool")

// WITHIN_CONTAINER is set in docker-compose.yml
// We are *not* running within a local container when we run jest tests, e. g. via `yarn test`
const isRunningWithinLocalContainer = process.env.WITHIN_CONTAINER === "true"
const host = isRunningWithinLocalContainer ? "db" : "localhost"
// user, password, and the database name correspond to those set in docker-compose.yml
const pgLocalConnectionString = `postgres://postgres:postgres@${host}:5432/postgres`

const PgBoss = require("pg-boss")
const isProduction = require("./isProduction")

const pgConnectionString = isProduction
  ? process.env.DATABASE_URL
  : pgLocalConnectionString

const params = Url.parse(pgConnectionString)
const auth = params.auth.split(":")

const pgConfig = {
  user: auth[0],
  password: auth[1],
  host: params.hostname,
  port: params.port,
  database: params.pathname.split("/")[1],
  // If some problems with different SSL config for local dev and Heroku ever arise, they could be matched:
  // 1. Run the following commands (copied from https://gist.github.com/mrw34/c97bb03ea1054afb551886ffc8b63c3b):
  // openssl req -new -text -passout pass:abcd -subj /CN=localhost -out server.req -keyout privkey.pem
  // openssl rsa -in privkey.pem -passin pass:abcd -out server.key
  // openssl req -x509 -in server.req -text -key server.key -out server.crt
  // 2. Add the following lines to Dockerfile.postgres (copied from https://stackoverflow.com/a/55072885)
  // COPY server.key /var/lib/postgresql/server.key
  // COPY server.crt /var/lib/postgresql/server.crt
  //
  // RUN chmod 600 /var/lib/postgresql/server.key
  // RUN chown postgres:postgres /var/lib/postgresql/server.key
  // 3. Add to db service in docker-compose.yml:
  //     command:
  //       -c ssl=on -c ssl_cert_file=/var/lib/postgresql/server.crt -c ssl_key_file=/var/lib/postgresql/server.key
  ssl: isProduction,
}

const pgPool = new Pool(pgConfig)
pgPool.on("error", (err, client) => console.error(err))

// Should be removed when https://github.com/brianc/node-postgres/issues/1789 is fixed
const connectWrapper = async function() {
  /* eslint-disable no-await-in-loop */
  for (let nRetry = 1; ; nRetry += 1) {
    try {
      const client = await pgPool.connect()
      if (nRetry > 1) {
        console.info("Now successfully connected to Postgres")
      }
      return client
    } catch (e) {
      if (e.toString().includes("ECONNREFUSED") && nRetry < 5) {
        console.info(
          `${"ECONNREFUSED connecting to Postgres, " +
            "maybe container is not ready yet, will retry "}${nRetry}`
        )
        // Wait 1 second
        await new Promise(resolve => setTimeout(resolve, 1000))
      } else {
        throw e
      }
    }
  }
}
const pgPoolWrapper = {
  connect: connectWrapper,
  async query(text, values) {
    const client = await connectWrapper()
    try {
      return client.query(text, values)
    } finally {
      client.release()
    }
  },
}

const pgBossQueue = new PgBoss({ db: { executeSql: pgPoolWrapper.query } })

pgBossQueue.on("error", err => console.error(err))

module.exports = { pgConfig, pgBossQueue, pgPool: pgPoolWrapper }
