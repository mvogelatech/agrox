#!/usr/bin/env node

import meow = require('meow');
import { runCLI } from './helpers/run-cli';
import jetpack = require('fs-jetpack');
import execa = require('execa');
import { getQuotationData } from './make-quotation-json';

runCLI(async () => {
	const cli = meow(
		`
			Usage
				$ yarn quotation quotationPackageId userId

			Examples
				$ yarn quotation 1 1
				$ yarn quotation 8000 2
		`,
	);

	if (cli.input.length !== 2 || !/^\d+$/.test(cli.input[0]) || !/^\d+$/.test(cli.input[1])) {
		throw new Error('Expected two integer arguments.');
	}

	const quotationPackageID = Number.parseInt(cli.input[0], 10);
	const userInputTable = Number.parseInt(cli.input[1], 10);
	const jsonOutputFileName = `quotation${quotationPackageID}.json`;
	const excelOutputFilePrefix = `${quotationPackageID}`;

	await getQuotationData(quotationPackageID, jsonOutputFileName);

	const pythonProcess = execa(
		'poetry',
		[
			'run',
			'python',
			jetpack.path('src/dev-scripts/python-area/2-quotation.py'),
			jetpack.path(`src/dev-scripts/temp/${jsonOutputFileName}`),
			jetpack.path(`src/dev-scripts/temp/${excelOutputFilePrefix}`),
			jetpack.path(`src/dev-scripts/temp/prescription_${userInputTable}.xlsx`),
		],
		{
			cwd: jetpack.path('src/dev-scripts/python-area/'),
		},
	);
	pythonProcess.stdout!.pipe(process.stdout);
	await pythonProcess;

	console.log('Done!');
});
