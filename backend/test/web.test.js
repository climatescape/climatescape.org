const supertest = require('supertest');
const { sleep } = require("../src/utils")

describe('web server', () => {
    const buildFastify = require('../src/app');
    const { pgPool } = require('../src/pg');

    let fastify, request;
    beforeAll(async () => {
        fastify = await buildFastify();
        request = supertest(fastify.server);
        await pgPool.query('TRUNCATE TABLE scraping_results;');
    });
    afterAll(async () => await fastify.close());
    afterAll(async () => await pgPool.end());

    test('should reject request request without body', async () => {
        await request.post('/twitterFollowers').expect(400); // BAD REQUEST
    });

    test('happy path', async () => {
        await request
            .post('/twitterFollowers')
            .send({orgId: 'climatescape', twitterUrl: 'https://twitter.com/climatescape'})
            .expect(200);
        // The job should be picked up by the worker and an entry written into the database
        await sleep(2000);
        const results = await pgPool.query('SELECT * FROM scraping_results;');
        expect(results.rows.length).toBe(1);
        expect(results.rows[0].result).toBe(100);
    });
});


