#!/usr/bin/env node

const { join } = require('path');
const { writeFileSync, readFileSync } = require('fs');
const { copy } = require('fs-extra');
const importCwd = require('import-cwd');
const minimist = require('minimist');
const fetch = require('node-fetch');

const argv = minimist(process.argv.slice(2));

async function list(lttfPlugins) {
  let pluginResults = {};

  for (let plugin of lttfPlugins) {
    pluginResults[plugin.name] = await plugin.import.list();
  }

  let previousResults = {}

  if (argv['previous-results']) {
    const response = await fetch(argv['previous-results']);

    if(response.ok) {
      previousResults = await response.json();
    } else {
      console.warn(`Error ${response.status} when downloading previous results. Previous results ignored`);
    }
  }

  console.log(previousResults);

  let today = new Date();
  let isoDate = today.toISOString().split('T')[0];

  previousResults[isoDate] = pluginResults;

  return previousResults;
}

async function output(lttfPlugins) {
  if (!argv.o) {
    console.error('You must provide an output directory to `output` with -o');
  }

  const ouputResult = await list(lttfPlugins);

  await copy(join(__dirname, 'dist'), argv.o);

  if(argv.rootUrl) {
    let index = readFileSync(join(argv.o, 'index.html'), 'utf8');
    let regex = /<meta name="lint-to-the-future\/config\/environment" content="(.*)" \/>/;
    let envContentString = index.match(regex)[1];
    let envContent =  JSON.parse(decodeURIComponent(envContentString));
    envContent.rootURL = `/${argv.rootUrl}/`;
    console.log(envContent);
    writeFileSync(
      join(argv.o, 'index.html'),
      index
        .replace(regex, `<meta name="lint-to-the-future/config/environment" content="${encodeURIComponent(JSON.stringify(envContent))}" />`)
        .replace(/"\/assets\//g, `"/${argv.rootUrl}/assets/`),
    );
  }

  writeFileSync(join(argv.o, 'data.json'), JSON.stringify(ouputResult));
}

async function main() {
  let currentPackageJSON = require(join(process.cwd(), 'package.json'));

  let lttfPluginsNames = [
    ...Object.keys(currentPackageJSON.devDependencies || {}),
    ...Object.keys(currentPackageJSON.dependencies || {})
  ].filter(dep => dep.startsWith('lint-to-the-future-'));

  let lttfPlugins = [];

  for (const name of lttfPluginsNames) {
    let mod;

    try {
      // eslint-disable-next-line node/no-unsupported-features/es-syntax
      mod = await import(join(process.cwd(), 'node_modules', name, 'main.mjs'));
    } catch (err) {
      // fallback to trying importCwd
      mod = importCwd(name);
    }

    lttfPlugins.push({
      import: mod,
      name,
    })
  }

  switch (argv._[0]) {
    case 'output':
      await output(lttfPlugins);

      break;

    case 'list':
      if (!argv.o && !argv.stdout) {
        console.error('You must provide an output path to `list` with -o or pass --stdout');
      }

      // eslint-disable-next-line
      const listResult = await list(lttfPlugins);

      if (argv.stdout) {
        console.log(listResult);
      }

      if (argv.o) {
        writeFileSync(argv.o, JSON.stringify(listResult));
      }

      break;
    case 'ignore':
    default:
      for (let plugin of lttfPlugins) {
        await plugin.import.ignoreAll();
      }
  }
}

main().catch((error) => {
  process.exitCode = 1;
  console.error(error);
});
