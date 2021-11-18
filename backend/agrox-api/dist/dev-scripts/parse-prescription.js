#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meow = require("meow");
const run_cli_1 = require("./helpers/run-cli");
const jetpack = require("fs-jetpack");
const execa = require("execa");
const parseJson = require("parse-json");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
run_cli_1.runCLI(async () => {
    const cli = meow(`
			Usage
				$ yarn parse-prescription fileName

			Note
				fileName file must be placed under temp folder

			Examples
				$ yarn parse-prescription Prescrição_Fazenda_Meia_Rev1.xlsx
				$ yarn parse-prescription Prescrição_Fazenda_Gironda_Rev1.xlsx
		`);
    if (cli.input.length === 0 || !/.xlsx$/.test(cli.input[0])) {
        throw new Error('Expected .xlsx fileName.');
    }
    const tableInput = cli.input[0];
    const pythonProcess = execa('poetry', [
        'run',
        'python',
        jetpack.path('src/dev-scripts/python-area/3-prescription-parser.py'),
        jetpack.path(`src/dev-scripts/temp/${tableInput}`),
        jetpack.path(`src/dev-scripts/temp`),
    ], {
        cwd: jetpack.path('src/dev-scripts/python-area/'),
    });
    pythonProcess.stdout.pipe(process.stdout);
    await pythonProcess;
    jetpack.dir('src/dev-scripts/temp');
    const files = jetpack.list('src/dev-scripts/temp').filter((file) => /^field_.+\.json$/.test(file));
    for (const file of files) {
        try {
            const prescription = parseJson(jetpack.read(`src/dev-scripts/temp/${file}`));
            const phone_number = prescription.whatsapp;
            if (!phone_number.startsWith('55')) {
                prescription.whatsapp = '55' + phone_number;
            }
            await savePrescription(prescription);
        }
        catch (error) {
            console.log(error);
        }
    }
});
async function savePrescription(prescription) {
    const diag = await prisma.diagnosis.findUnique({
        where: { id: prescription.diagnosis_id },
    });
    try {
        if (diag) {
            await prisma.prescription.create({
                data: {
                    date: new Date(),
                    content: prescription,
                    pulverization_method: prescription.recommended_method,
                    author: prescription.author,
                    phone_number: prescription.whatsapp,
                    diagnosis: { connect: { id: prescription.diagnosis_id } },
                },
            });
        }
        else {
            console.log(`no diagnosis for id: ${prescription.diagnosis_id}`);
        }
    }
    catch (error) {
        console.log(error);
    }
}
//# sourceMappingURL=parse-prescription.js.map