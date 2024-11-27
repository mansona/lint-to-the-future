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
        // only used in one test
        'previousResults.json': `{
  "2024-09-27": { "lint-to-the-future-eslint": { "debugger": ["some-file.js"] } }
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

  it('should only have one day of rules in the json if no --previous-results was passed', async function () {
    await $({
      cwd: project.baseDir,
    })`lttf output -o ${outputDir}`;

    const dataFile = JSON.parse(readFileSync(join(outputDir, 'data.json')));
    const dates = Object.keys(dataFile);

    expect(dates).to.have.lengthOf(1);
  });

  it('should combine previous results if --previous-results was passed', async () => {
    await $({
      cwd: project.baseDir,
    })`lttf output -o ${outputDir} --previous-results ./previousResults.json`;

    const dataFile = JSON.parse(readFileSync(join(outputDir, 'data.json')));
    const dates = Object.keys(dataFile);

    expect(dates).to.have.lengthOf(2);
    expect(dataFile[dates[0]]).to.deep.equal({
      'lint-to-the-future-eslint': {
        debugger: 1,
      },
    });
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
