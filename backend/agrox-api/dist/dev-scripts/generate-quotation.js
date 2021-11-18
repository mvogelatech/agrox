#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meow = require("meow");
const run_cli_1 = require("./helpers/run-cli");
const jetpack = require("fs-jetpack");
const execa = require("execa");
const make_quotation_json_1 = require("./make-quotation-json");
run_cli_1.runCLI(async () => {
    const cli = meow(`
			Usage
				$ yarn quotation quotationPackageId userId

			Examples
				$ yarn quotation 1 1
				$ yarn quotation 8000 2
		`);
    if (cli.input.length !== 2 || !/^\d+$/.test(cli.input[0]) || !/^\d+$/.test(cli.input[1])) {
        throw new Error('Expected two integer arguments.');
    }
    const quotationPackageID = Number.parseInt(cli.input[0], 10);
    const userInputTable = Number.parseInt(cli.input[1], 10);
    const jsonOutputFileName = `quotation${quotationPackageID}.json`;
    const excelOutputFilePrefix = `${quotationPackageID}`;
    await make_quotation_json_1.getQuotationData(quotationPackageID, jsonOutputFileName);
    const pythonProcess = execa('poetry', [
        'run',
        'python',
        jetpack.path('src/dev-scripts/python-area/2-quotation.py'),
        jetpack.path(`src/dev-scripts/temp/${jsonOutputFileName}`),
        jetpack.path(`src/dev-scripts/temp/${excelOutputFilePrefix}`),
        jetpack.path(`src/dev-scripts/temp/prescription_${userInputTable}.xlsx`),
    ], {
        cwd: jetpack.path('src/dev-scripts/python-area/'),
    });
    pythonProcess.stdout.pipe(process.stdout);
    await pythonProcess;
    console.log('Done!');
});
//# sourceMappingURL=generate-quotation.js.map