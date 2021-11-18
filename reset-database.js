#!/usr/bin/env node

const { createPool, sql } = require('slonik');
const { raw } = require('slonik-sql-tag-raw');

const DB_URL = process.env.AGROX_DB_URL;

if (!DB_URL) {
	console.error(`Unable to obtain DB URL. Environment variable AGROX_DB_URL is not set.`);
	process.exit(1);
}

///
/// ATTENTION !!!!! NEVER , NEVER, NEVER RUN THIS IN PRODUCTION IT WILL DESTROY YOUR DATA, LIFE AND DREAMS...
///

async function run() {
	await createPool(DB_URL).connect(async (connection) => {
		console.log('Droping database tables...');
		// This statements will drop all tables and sequences by dropping the schema, then recreates it.
		const dropTables = `DROP SCHEMA public CASCADE;
							CREATE SCHEMA public;
							GRANT ALL ON SCHEMA public TO postgres;
							GRANT ALL ON SCHEMA public TO public;`;
		const query = sql`${raw(dropTables)}`;
		try {
			await connection.query(query);
		} catch (error) {
			console.log(`\n\nFailed when running drop tables:`, error);
			process.exit(1);
		}

		process.stdout.write(` Done!\n`);
		console.log('Database is clean!');
	});
}

(async () => {
	try {
		await run();
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
})();
