#!/usr/bin/env node

const { createPool, sql } = require('slonik');
const { raw } = require('slonik-sql-tag-raw');
const jetpack = require('fs-jetpack');

const DB_URL = process.env.AGROX_DB_URL;

if (!DB_URL) {
	console.error(`Unable to obtain DB URL. Environment variable AGROX_DB_URL is not set.`);
	process.exit(1);
}

async function run() {
	const args = process.argv; // i.e.: 'backend/database/seeders/sample/dummy'
	console.log('Load sample data into database...');
	const sampleSeeders = jetpack.cwd(args[2]); // fake data to mock operation
	console.log(`Seeding scripts from path: ${sampleSeeders.path()}`);
	await createPool(DB_URL).connect(async (connection) => {
		for (const fileName of sampleSeeders.list().sort()) {
			process.stdout.write(`> Running: '${fileName}'...`);
			const fileContents = sampleSeeders.read(fileName);
			const query = sql`${raw(fileContents)}`;
			try {
				await connection.query(query);
			} catch (error) {
				console.log(`\n\nFailed when running '${fileName}':`, error);
				process.exit(1);
			}

			process.stdout.write(` Done!\n`);
		}
	});

	console.log('Database successfully loaded with sample data!');
}

(async () => {
	try {
		await run();
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
})();
