#!/usr/bin/env node

const eslint = require("eslint");
const { readFileSync, writeFileSync } = require('fs');

const { CLIEngine } = eslint;

if (!CLIEngine || !CLIEngine.version.startsWith(6)) {
  throw new Error('This tool currently only supports the ESLint 6.x node api.');
}

console.log(CLIEngine.version);

function ignoreError(error) {
  const ruleIds = error.messages.map(message => message.ruleId);
  const uniqueIds = [...new Set(ruleIds)];

  const file = readFileSync(error.filePath, 'utf8');

  let firstLine = file.split('\n')[0];

  console.log(firstLine);

  if (firstLine.includes('eslint-disable')) {
    console.warn('appending existing disables not supported yet');
  } else {
    writeFileSync(error.filePath, `/* eslint-disable ${uniqueIds.join(', ')} */\n${file}`)
  }
}

async function main() {
  // 1. Create an instance.
  const cli = new CLIEngine();

  // 2. Lint files.
  const report = cli.executeOnFiles(["."]);

  const errors = report.results.filter(result => result.errorCount > 0);

  errors.forEach(ignoreError);
}

main().catch((error) => {
  process.exitCode = 1;
  console.error(error);
});
