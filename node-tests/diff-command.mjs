import { $ } from 'execa';

import { existsSync, readFileSync } from 'fs';
import { expect } from 'chai';
import { Project } from 'fixturify-project';
import { join } from 'path';

describe('diff command', function () {
  this.beforeAll(function () {
    expect(
      existsSync('dist'),
      "you need to run 'npm run prepublishOnly' at least once before running this test",
    ).to.be.ok;
  });

  let project;

  beforeEach(async function () {
    project = new Project('test-app', '1.1.0', {
      files: {
        'one.js': '/* eslint-disable a, b */',
        'two.js': '/* eslint-disable b, c */',
        'previousResults.json': `{
  "2026-04-02": { "lint-to-the-future-eslint": { "b": ["one.js", "two.js"], "c": ["one.js", "two.js"] } }
}`,
      },
    });

    project.linkDevDependency('lint-to-the-future', {
      baseDir: process.cwd(),
      resolveName: '.',
    });

    project.linkDevDependency('lint-to-the-future-eslint', {
      baseDir: process.cwd(),
    });

    await project.write();
  });

  it('should output diff to a file', async function () {
    await $({
      cwd: project.baseDir,
    })`lttf diff --output diff.json --previous-results previousResults.json`;

    const output = readFileSync(join(project.baseDir, 'diff.json'));
    const diff = JSON.parse(output);

    expect(diff).to.deep.equal({
      added: {
        'lint-to-the-future-eslint': {
          a: ['one.js'],
        },
      },
      removed: {
        'lint-to-the-future-eslint': {
          c: ['one.js'],
        },
      },
    });
  });

  it('should output diff to stdout', async function () {
    const result = await $({
      cwd: project.baseDir,
    })`lttf diff --stdout --previous-results previousResults.json`;

    const output = result.stdout;
    const diff = JSON.parse(output);

    expect(diff).to.deep.equal({
      added: {
        'lint-to-the-future-eslint': {
          a: ['one.js'],
        },
      },
      removed: {
        'lint-to-the-future-eslint': {
          c: ['one.js'],
        },
      },
    });
  });

  it('should complain if you do not pass previous results', async function () {
    let result;
    try {
      result = await $({
        cwd: project.baseDir,
      })`lttf diff --stdout`;
    } catch (error) {
      expect(error.message).to.contain('Command failed with exit code 1');
      expect(error.message).to.contain(
        'You must provide previous results to `diff` using `--previous-results <path|url>`',
      );
    }

    expect(result).to.be.undefined;
  });

  it('should complain if previous results cannot be read', async function () {
    let result;
    try {
      result = await $({
        cwd: project.baseDir,
      })`lttf diff --stdout --previous-results nonExisting.json`;
    } catch (error) {
      expect(error.message).to.contain('Command failed with exit code 1');
      expect(error.message).to.contain(
        'No previous results found, cannot generate diff',
      );
    }

    expect(result).to.be.undefined;
  });

  it('should complain if you do not pass an output option', async function () {
    let result;
    try {
      result = await $({
        cwd: project.baseDir,
      })`lttf diff --previous-results previousResults.json`;
    } catch (error) {
      expect(error.message).to.contain('Command failed with exit code 1');
      expect(error.message).to.contain(
        'You must provide an output path to `diff` with -o or pass --stdout',
      );
    }

    expect(result).to.be.undefined;
  });
});
