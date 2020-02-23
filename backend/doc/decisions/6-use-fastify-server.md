Chosen [Fastify](https://www.fastify.io/) as a Node web server over [Express](https://expressjs.com/) because the latter
doesn't support async/await handlers out of the box as of version 4.x. Fastify also comes with JSON Schema verification
and logging, which is useful.