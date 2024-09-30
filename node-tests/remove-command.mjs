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
        'index.js': `function remove() {
          // we need to communicate via stdout since we're calling this via a different process
          console.log(JSON.stringify(arguments));
        }
        function list() {
          return {
            'face-lint': ['file-name']
          };
        }
        module.exports = {
          remove,
          list,
        }`,
      },
    });

    await project.write();
  });

  it('should complain if you dont provide a rule', async function () {
    try {
      await execa({ cwd: project.baseDir })`${cliPath} remove`;
    } catch (error) {
      expect(error.stderr).to.equal(
        `error: missing required argument 'rule-name'`
      );
    }
  });

  it('should pass the name to the plugins', async function () {
    const result = await execa({
      cwd: project.baseDir,
    })`${cliPath} remove face-lint`;

    expect(JSON.parse(result.stdout)[0]).to.deep.equal({
      name: 'face-lint',
    });
  });

  it('should pass the filter to plugins if passed', async function () {
    const result = await execa({
      cwd: project.baseDir,
    })`${cliPath} remove face-lint --filter folder/**/*.js`;

    expect(JSON.parse(result.stdout)[0]).to.deep.equal({
      filter: 'folder/**/*.js',
      name: 'face-lint',
    });
  });
});
