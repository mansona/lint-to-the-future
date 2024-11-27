import { $ } from 'execa';

import { load } from 'cheerio';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { expect } from 'chai';
import { Project } from 'fixturify-project';

describe('output command', function () {
  this.beforeAll(function () {
    expect(
      existsSync('dist'),
      "you need to run 'npm run prepublishOnly' at least once before running this test",
    ).to.be.ok;
  });

  let project;
  let outputDir;

  beforeEach(async function () {
    project = new Project('test-app', '1.1.0', {
      files: {
        'index.js': `/* eslint-disable debugger */`,
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

    outputDir = join(project.baseDir, 'lttf-output');
  });

  it("should have no rootUrl if one wasn't provided", async function () {
    await $({
      cwd: project.baseDir,
    })`lttf output -o ${outputDir}`;

    const indexFile = readFileSync(join(outputDir, 'index.html'));

    const parsedFile = load(indexFile);

    expect(
      JSON.parse(
        decodeURIComponent(
          parsedFile('meta[name="lint-to-the-future/config/environment"]').attr(
            'content',
          ),
        ),
      ).rootURL,
    ).to.eql('/');
  });

  it('should use the provided rootUrl', async function () {
    await $({
      cwd: project.baseDir,
    })`lttf output -o ${outputDir} --rootUrl face`;

    const indexFile = readFileSync(join(outputDir, 'index.html'));

    const parsedFile = load(indexFile);

    expect(
      JSON.parse(
        decodeURIComponent(
          parsedFile('meta[name="lint-to-the-future/config/environment"]').attr(
            'content',
          ),
        ),
      ).rootURL,
    ).to.eql('/face/');
  });
});
