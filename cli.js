#!/usr/bin/env node

const eslint = require("eslint");
const { readFileSync, writeFileSync } = require('fs');

const { CLIEngine } = eslint;

function ignoreError(error) {
  const ruleIds = error.messages.map(message => message.ruleId);
  const uniqueIds = [...new Set(ruleIds)];

  const file = readFileSync(error.filePath, 'utf8');

  let firstLine = file.split('\n')[0];

  if (firstLine.includes('eslint-disable')) {
    console.warn('appending existing disables not supported yet');
  } else {
    writeFileSync(error.filePath, `/* eslint-disable ${uniqueIds.join(', ')} */\n${file}`)
  }
}

async function main() {
  const cli = new CLIEngine();

  const report = cli.executeOnFiles(["."]);

  const errors = report.results.filter(result => result.errorCount > 0);

  errors.forEach(ignoreError);
}

main().catch((error) => {
  process.exitCode = 1;
  console.error(error);
});
