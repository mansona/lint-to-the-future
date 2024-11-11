import { execa } from 'execa';
import { join, dirname } from 'path';
import { expect } from 'chai';

import { Project } from 'fixturify-project';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const cliPath = join(__dirname, '../cli.js');

describe('remove command', function () {
  let project;

  beforeEach(async function () {
    project = new Project('rsvp', '3.1.4', {
      files: {
        'index.js': '/* eslint-disable monkey-lint, face-lint */',
      },
    });

    project.addDependency('lint-to-the-future-fake-plugin', {
      files: {
        'index.js': `function ignoreAll() {
          // we need to communicate via stdout since we're calling this via a different process
          console.log('ignoredAll from fake-plugin');
        }

        module.exports = {
          ignoreAll,
        }`,
      },
    });

    project.addDependency('lint-to-the-future-old-plugin', {
      files: {
        'index.js': `function ignoreAll() {
          // we need to communicate via stdout since we're calling this via a different process
          console.log('ignoredAll from old-plugin');
        }
        module.exports = {
          ignoreAll,
        }`,
      },
    });

    await project.write();
  });

  it('should call ignore on all plugins by default', async function () {
    let result;

    result = await execa(cliPath, ['ignore'], { cwd: project.baseDir });

    expect(result.stdout).to.equal(
      `ignoredAll from fake-plugin
ignoredAll from old-plugin`,
    );

    expect(result.exitCode).to.equal(0);
  });

  it('should only call ignore on one plugin if you pass -p', async function () {
    let result;

    result = await execa(
      cliPath,
      ['ignore', '-p', 'lint-to-the-future-fake-plugin'],
      { cwd: project.baseDir },
    );

    expect(result.stdout).to.equal(`ignoredAll from fake-plugin`);

    expect(result.exitCode).to.equal(0);
  });

  it('should complain if you pass a plugin that is not installed', async function () {
    let result;

    try {
      result = await execa(cliPath, ['ignore', '-p', 'fancy-plugin'], {
        cwd: project.baseDir,
      });
    } catch (error) {
      expect(error.message).to.equal(
        `Command failed with exit code 1: ${cliPath} ignore -p fancy-plugin
Could not find plugin with specified name fancy-plugin. Available plugins are: lint-to-the-future-fake-plugin, lint-to-the-future-old-plugin`,
      );
    }

    // make sure the test actually went into the catch block above
    expect(result).to.be.undefined;
  });
});
