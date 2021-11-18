#!/usr/bin/env node

const { createPool, sql } = require('slonik');
const { raw } = require('slonik-sql-tag-raw');
const jetpack = require('fs-jetpack');
const { readdirSync } = require('fs');

const DB_URL = process.env.AGROX_DB_URL;

if (!DB_URL) {
	console.error(`Unable to obtain DB URL. Environment variable AGROX_DB_URL is not set.`);
	process.exit(1);
}

async function run() {
	try {
		const pool = createPool(DB_URL);
		pool.transaction(async (transactionConnection) => {
			console.log('Querying database for the last seeding revision.');
			const seedRevisionQuery = sql`SELECT * FROM seed_revision ORDER BY revision DESC LIMIT 1`;
			const beforeSeedingRevision = await transactionConnection.query(seedRevisionQuery);

			let beforeSeedingRevisionNumber = 0;
			// database is fresh, run all default seeders
			if (beforeSeedingRevision.rowCount === 0) {
				console.log(`Database is fresh, running all default seeders!`);
			} else {
				// only apply revisions greater than the available in db
				beforeSeedingRevisionNumber = beforeSeedingRevision.rows[0].revision;
				console.log(`Current seeded revision on db: ${beforeSeedingRevisionNumber}`);
			}

			const defaultSeeders = jetpack.cwd('backend/database/seeders/default');
			const defaultSeedersDirs = readdirSync('backend/database/seeders/default', { withFileTypes: true });
			const defaultSeedersPaths = defaultSeedersDirs.filter((dirent) => dirent.isDirectory()).map((dirent) => dirent.name);
			// search for folders with latest revisions
			const revisionPathsForUpdate = defaultSeedersPaths.filter((name) => Number.parseFloat(name, 10) > beforeSeedingRevisionNumber);
			console.log(`Revisions to be applied on db: ${revisionPathsForUpdate.length > 0 ? revisionPathsForUpdate : 'None'}`);
			for (const path of revisionPathsForUpdate) {
				console.log(`Seeding scripts from path: ${path}`);
				const seederPath = defaultSeeders.cwd(defaultSeeders.path(path));
				for (const fileName of seederPath.list().sort()) {
					process.stdout.write(`> Running: '${fileName}'...`);
					const fileContents = seederPath.read(fileName);
					const query = sql`${raw(fileContents)}`;
					await transactionConnection.query(query);
					process.stdout.write(`Done!\n`);
				}
			}

			const afterSeedingRevision = await transactionConnection.query(seedRevisionQuery);
			const afterSeedingRevisionNumber = Number.parseInt(afterSeedingRevision.rows[0].revision, 10);
			const defaultSeedingLastRevisionNumber = Number.parseInt(
				defaultSeedersPaths.find((name) => Number.parseFloat(name, 10) === afterSeedingRevisionNumber),
				10,
			);
			console.log(
				`The updated DB revision is: ${afterSeedingRevisionNumber} and the default scripts path latest revision is: ${
					defaultSeedersPaths[defaultSeedersPaths.length - 1]
				}`,
			);

			if (afterSeedingRevisionNumber !== Number.parseInt(defaultSeedingLastRevisionNumber, 10))
				throw new Error(
					`There is a mismatch between database seed revision ${afterSeedingRevisionNumber} and the available dafault seed scripts ${defaultSeedersPaths}.`,
				);

			if (afterSeedingRevisionNumber === beforeSeedingRevisionNumber) {
				console.log('No update was necessary, database already contains default data.');
			} else {
				console.log('Database is seeded with default data!');
			}
		});
	} catch (error) {
		console.log(`\n\nFailed when running seeding script`, error.message);
		process.exit(1);
	}
}

(async () => {
	try {
		await run();
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
})();
