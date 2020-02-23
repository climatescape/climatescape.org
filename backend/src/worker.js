const { pgBossQueue } = require('./pg');
const setupScraping = require('./setupScraping');

async function startWorker() {
    await pgBossQueue.start();
    const scrapingPool = await setupScraping();
    await pgBossQueue.subscribe('twitterFollowers', async job => {
        const data = job.data;
        console.log('Scraping Twitter followers: ' + JSON.stringify(data));
        const numTwitterFollowers = await twitterFollowers(data);
        console.log(`Twitter followers of ${data.orgId}: ${numTwitterFollowers}`);
        const client = await scrapingPool.connect();
        try {
            const result = await client.query(
                'INSERT INTO scraping_results (org_id, request_type, result) VALUES ($1, $2, $3) ' +
                'ON CONFLICT (org_id, request_type, scraping_time) DO UPDATE ' +
                'SET result = $3;',
                [data.orgId, 'twitterFollowers', numTwitterFollowers]
            );
            if (result.rowCount !== 1) {
                console.error('ERROR! Expected one updated row, got ' + result.rowCount);
            }
            console.log(`Twitter followers for ${data.orgId} were successfully stored in the database`);
        } catch (e) {
            console.error(`Error while storing twitter followers for ${data.orgId} in the database`, e);
        } finally {
            client.release();
        }
    });
}

(async () => {
    try {
        await startWorker();
    } catch (e) {
        console.error('Error starting worker', e);
    }
})();

async function twitterFollowers(data) {
    return 100;
}

