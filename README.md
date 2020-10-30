# lint-to-the-future

LintToTheFuture is a modern way to progressively update your entire codebase to the latest best practices. It has a number of tools that work together to manage linting rules and provides a sustainable way to add new rules to existing codebases without slowing down your development

## Installation

You should install this as a dev-dependency of your project

```
npm i --save-dev lint-to-the-furture
```

## Usage

This project is still in alpha phase, so we will add new sub-sections to Usage as they have been implemented. If you are interested in this project feel free to reach out to me on Twitter at [@real_ate](https://twitter.com/real_ate).

### Adding file-based lint ignores to your project

Running the cli application will automatically run `eslint` on your codebase and add file-based ignores to that file.

```
npx lint-to-the-future
```

After running this process you should be able to run `eslint` on your project again and it will show no more errors.

**Note:** we don't currently add file-based ignores for warnings as they don't generally break CI in the most common configurations.

## Frequently Asked Questions

### Why do you use file based ignores instead of line-based or projected-wide

The point of LintToTheFuture is to allow you to **progressively** update your codebase using new lint rules without overwhelming you with the task. You can easily ignore lint rules using project-based ignores in your config files but that doesn't prevent you from making the same errors in new files.

We chose to do the ignores on a file basis as it is a perfect balance and it means that the tracking/graphing aspects of LintToTheFuture provide you with achievable goals, especially in large codebases.
