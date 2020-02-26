const fastify = require('fastify')({ logger: true });

const { pgBossQueue } = require('./pg');

fastify.route({
    method: 'POST',
    url: '/twitterFollowers',
    schema: {
        body: {
            type: 'object',
            required: ['orgId', 'twitterUrl'],
            properties: {
                orgId: { type: 'string' },
                twitterUrl: { type: 'string' }
            }
        }
    },
    handler: function (req, res) {
        fastify.log.info('Received request to scrape Twitter followers: ', req.body);
        return pgBossQueue.publish('twitterFollowers', req.body);
    }
});

async function buildFastify() {
    await pgBossQueue.start();
    await fastify.listen(process.env.PORT || 3000, '0.0.0.0');
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
    return fastify;
}

module.exports = buildFastify;