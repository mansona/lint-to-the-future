import { execaNode } from 'execa';
import temp from 'temp';
import { load } from 'cheerio';
import { readFileSync } from 'fs';
import { join } from 'path';
import { expect } from 'chai';

describe("program commands", function() {
  describe("output", function() {
    let tempDir;

    beforeEach(async function() {
      tempDir = await temp.mkdir('super-app');
    });

    it("should have no rootUrl if one wasn't provided", async function() {
      await execaNode('./cli.js', ['output', '-o', tempDir]);
      const indexFile = readFileSync(join(tempDir, 'index.html'));

      const parsedFile = load(indexFile);

      expect(JSON.parse(decodeURIComponent(parsedFile('meta[name="lint-to-the-future/config/environment"]').attr('content'))).rootURL).to.eql('/');
    });

    it("should use the provided rootUrl", async function() {
      await execaNode('./cli.js', ['output', '-o', tempDir, '--rootUrl', 'face']);
      const indexFile = readFileSync(join(tempDir, 'index.html'));

      const parsedFile = load(indexFile);

      expect(JSON.parse(decodeURIComponent(parsedFile('meta[name="lint-to-the-future/config/environment"]').attr('content'))).rootURL).to.eql('/face/');
    })
  })
})
