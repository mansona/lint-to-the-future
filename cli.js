#!/usr/bin/env node

const { join } = require('path');
const importCwd = require('import-cwd');

// var resolve = require('resolve').sync;

async function main() {
  let currentPackageJSON = require(join(process.cwd(), 'package.json'));

  let lttfPlugins = [
    ...Object.keys(currentPackageJSON.devDependencies),
    ...Object.keys(currentPackageJSON.dependencies)
  ].filter(dep => dep.startsWith('lint-to-the-future-'));

  for (let pluginName of lttfPlugins) {
    let plugin = importCwd(pluginName);

    await plugin.ignoreAll();
  }
}

main().catch((error) => {
  process.exitCode = 1;
  console.error(error);
});
