# Lint to the Future - Plugin Development Guide

Lint to the Future is built on a plugin architecture. The main package (the one that contains this documentation) coordinates commands to each of the plugins. For example, when you run

```
npx lint-to-the-future ignore
```

that will delegate the `ignore` command to each of the plugins that are installed.

**Note:** Lint to the Future looks for installed plugins by checking your package.json and searches for all dependencies or devDependencies that start with `lint-to-the-future-`. If you're developing a plugin you will need to make sure to add something to your package.json as well as doing `npm link` (or whatever method you use to link packages). e.g.:

```json
  "lint-to-the-future-my-plugin": "*"
```

## Plugin Interface

At the time of writing a plugin needs to provide 2 functions, `ignoreAll()` and `list()` which will need to be exported from the main/index file of your package.

### ignoreAll()

When this function is called the expected result is that any files that show linter errors should have file-based ignores added to the top of the file.

We will use the eslint plugin as an example to illustrate what `ignoreAll()` is expected to do. [lint-to-the-future-eslint](https://github.com/mansona/lint-to-the-future-eslint) is the `eslint` plugin for lint-to-the-future. If you run `npx eslint .` in your repo and there are no lint errors reported, then `ignoreAll()` should do **absolutely nothing** to any file.

If `npx eslint .` shows some errors in some files for the `no-unused-vars` rule, then the `ignoreAll()` function should **write** the file-based ignore comments to the top of all files that were reported to have the `no-unused-vars` error:

```js
/* eslint-disable no-unused-vars */
const unused = 'blah';
```

After running `ignoreAll()`, running `npx eslint .` should return **no errors**.

**Note**: You need to make sure that you account for files that already have ignore rules set for that file. If your file started like:

```js
/* eslint-disable quotes */
const unused = "blah";
```

then after running `ignoreAll()` the resulting file should look like:

```js
/* eslint-disable quotes, no-unused-vars */
const unused = "blah";
```

### list()

The `list()` function is used to populate the data for the Lint to the Future Dashboard. It needs to return an object that has keys for the particular rule and values that are the file paths for **all the files that have the file-based ignore for that rule**.

```json
{
  "quotes": ["addon/components/es-card-content.js", "addon/components/es-header-navbar-link.js"],
  "no-unused-vars": ["addon/components/es-header-navbar-link.js"]
}
```
