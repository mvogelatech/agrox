#!/usr/bin/env node

const { createPool, sql } = require('slonik');
const { raw } = require('slonik-sql-tag-raw');

const DB_URL = process.env.AGROX_DB_URL_LOCAL;
const DB_DEV_URL = process.env.AGROX_DB_DEV_URL_LOCAL;

// take care only for production environment
if (!DB_URL) {
	console.error(`Unable to obtain DB URL. Environment variable AGROX_DB_URL is not set.`);
	process.exit(1);
}

async function executeQueryForDB(dburl, date, id) {
	await createPool(DB_URL).connect(async (connection) => {
		const insertImaging = `INSERT INTO public.imaging (directory,processing_timestamp,imaging_date, farm_id) VALUES ('${date}', NOW(), TO_DATE('${date}', 'YYYY-MM-DD'), ${id});`;
		const query = sql`${raw(insertImaging)}`;
		try {
			await connection.query(query);
		} catch (error) {
			process.stdout.write(`\n\nFailed when running insert query:${error}`);
			console.log(`\n\nFailed when running insert query:${error}`);
			process.exit(1);
		}
	});
}

async function run() {
	const args = process.argv; // i.e.: 'backend/database/seeders/sample/dummy'
	console.log('Register tiles data into imaging table...');
	// const sampleSeeders = jetpack.cwd(args[2]); // fake data to mock operation
	const farmId = Number.parseInt(args[2], 10);
	const date = args[3];
	console.log(`Farm id: ${farmId}, Date/Path: ${date}`);

	// execute for production env
	if (DB_URL) {
		console.log('Insert data into production.');
		await executeQueryForDB(DB_URL, date, farmId);
	} else {
		console.log('No DB_URL environment variable defined');
		process.stdout.write(`\n\nNo DB_URL environment variable defined`);
	}

	// execute for production dev env
	if (DB_DEV_URL) {
		console.log('Insert data into development.');
		await executeQueryForDB(DB_DEV_URL, date, farmId);
	} else {
		console.log('No DB_DEV_URL environment variable defined');
		process.stdout.write(`\n\nNo DB_DEV_URL environment variable defined`);
	}

	process.stdout.write(`End of tile process database script.\n`);
}

(async () => {
	try {
		await run();
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
})();
