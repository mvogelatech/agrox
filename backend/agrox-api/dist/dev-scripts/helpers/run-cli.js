"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCLI = void 0;
const ensureError = require("ensure-error");
const chalk = require("chalk");
function die(message) {
    console.error(chalk.red(message) + '\n');
    process.exit(1);
}
function runCLI(runner) {
    (async () => {
        try {
            await runner();
            process.exit(0);
        }
        catch (error) {
            die(ensureError(error).message);
        }
    })();
}
exports.runCLI = runCLI;
//# sourceMappingURL=run-cli.js.map