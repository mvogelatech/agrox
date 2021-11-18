#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meow = require("meow");
const run_cli_1 = require("./helpers/run-cli");
const jetpack = require("fs-jetpack");
const execa = require("execa");
const make_prescription_json_1 = require("./make-prescription-json");
run_cli_1.runCLI(async () => {
    const cli = meow(`
			Usage
				$ yarn prescription userID mapDatePath

			Examples
				$ yarn prescription 1 2021-2-19
				$ yarn prescription 8000 2021-3-22
		`);
    if (cli.input.length < 2 || !/^\d+$/.test(cli.input[0]) || !/^\d\d\d\d-\d\d?-\d\d?$/.test(cli.input[1])) {
        throw new Error('Expected two arguments: an interger and a date in the format YYYY-MM-DD.');
    }
    const userID = Number.parseInt(cli.input[0], 10);
    const datePath = cli.input[1];
    const jsonOutputFileName = `prescription_${userID}.json`;
    const excelOutputFileName = `prescription_${userID}.xlsx`;
    await make_prescription_json_1.getFieldsData(userID, jsonOutputFileName, datePath);
    const pythonProcess = execa('poetry', [
        'run',
        'python',
        jetpack.path('src/dev-scripts/python-area/1-prescription.py'),
        jetpack.path(`src/dev-scripts/temp/${jsonOutputFileName}`),
        jetpack.path(`src/dev-scripts/temp/${excelOutputFileName}`),
    ], {
        cwd: jetpack.path('src/dev-scripts/python-area/'),
    });
    pythonProcess.stdout.pipe(process.stdout);
    await pythonProcess;
    console.log('Done!');
});
//# sourceMappingURL=generate-prescription.js.map