# Lint to the Future 🚀

Lint to the Future (LTTF) is a useful tool that helps you to progressivly turn on or update lint rules in your codebase without making your test runner sad. LTTF allows you to move forward with linting without slowing your development down for even a second 🚀💪

## How it works

LTTF provides you with a few helpful tools but the two main ones that most people use regularly are the **ignore command** and the **Lint to the Future Dashboard**. 

When you add a new lint rule to your codebase you will likely have many files that are reporting errors for this new rule. This is when you run the following command with Lint To The Future: 

```
npx lint-to-the-future ignore
```

and it will automatically add **file-based ignore directives** to each of the files that were previously failing your lint command. These file-based ignore directives are intended to be temporary and you can come back to fix the files later, while making sure that any new file you create has to abide by the new lint rule you added 🎉

When you are done adding file-based ignore directives to each of your files you can put together a dashboard that keeps track of which files you still need to come back and fix. The dashboard looks like this

![ember-learn github io_ember-styleguide_](https://user-images.githubusercontent.com/594890/193256435-0355d6be-c39f-4901-89a1-58dd6b871129.png)


Keep reading to find out how to set it up 📚

## Installation

You should install Lint to the Future as a dev-dependency of your project

```
npm i --save-dev lint-to-the-future
```

on its own LTTF doesn't do anything by itself, so you should also install some plugins. If you're using eslint on your project you can install the plugin for it using the following:

```
npm i --save-dev lint-to-the-future-eslint
```

### Plugins

LTTF will automatically load each plugin (any package you have installed locally starting with `lint-to-the-future-`) and run them in one after another.

You can write your own plugin, or use one from the existing list:

- For Ember apps: [`lint-to-the-future-ember-template`](https://github.com/mansona/lint-to-the-future-ember-template)
- For all JavaScript apps: [`lint-to-the-future-eslint`](https://github.com/mansona/lint-to-the-future-eslint)
- For styles [`lint-to-the-future-stylelint`](https://github.com/mansona/lint-to-the-future-stylelint)

To find out some more information about how to write your own plugin, check out the [plugin docs](/docs/plugin-development.md).

## Usage

I've already given a quick overview on how to use Lint to the Future above but let's go into a bit more detail.

### Adding file-based lint ignores to your project

Let's use the `eslint` plugin as an example. The first thing you need to do is to make sure that running `eslint` on your project actually shows some linting errors. Lint to the Future is intended to be used to fix linting situations that are **currently erroring** so make sure you configure your eslint to throw some errors if you want to test it out. Running the ignore command will automatically run `eslint` on your codebase and add file-based ignores to any file that is currently erroring:

```
npx lint-to-the-future ignore
```

After running this process you should be able to run `eslint` again on your project again and it will show no more errors 💪

**Note:** we don't currently add file-based ignores for warnings as they don't generally break CI in the most common configurations.

## Lint to the Future Dashboard

The **file-based ignore directives** that Lint to the Future adds are supposed to be temporary, so Lint to the Future can generate a dashboard that helps you keep track of files that still have ignore directives in them and also keeps track how you are progressing with removals over time.

To see it in action, check out [ember-styleguide's dashboard](https://ember-learn.github.io/ember-styleguide/)

The easiest way to set up the Lint to the Future Dashboard is to use the [lint-to-the-future-dashboard-action](https://github.com/mansona/lint-to-the-future-dashboard-action) if you are hosting your code on GitHub and don't mind your dashboard being public on GitHub Pages. You can read the README of the that project to find out more about it but the easist way to get started is to create a file called `.github/lint-to-the-future.yml` and add the following to that file: 

```yml
name: Lint to the Future Dashboard

on:
  push:
    branches:
      - master
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: mansona/lttf-dashboard@v1
        with:
          token: ${{secrets.GITHUB_TOKEN}}
```

And that will start updating your dashboard when you push something to your master or main branch 🎉 Just remember to enable GitHub pages for your repo on the `gh-pages` branch 👍

If you want to deploy your dashboard in any other way then you should check out the [dashboard deployment](/docs/dashboard-deployment.md) documentation.

**Note:** if you're thinking that you need to use the manual deployment documentation because you want to deploy your dashboard privately then be aware that there is no real data form your codebase that is exposed via the Lint to the Future Dashboard. The most identifiable information that could be exposed is the **file names** of any file that has an igore directive in it, which in the vast majority of cases should provide no security risk 👍

## Frequently Asked Questions

### Why do you use file based ignores instead of line-based or projected-wide

The point of Lint to the Future is to allow you to **progressively** update your codebase using new lint rules without overwhelming you with the task. You can easily ignore lint rules using project-based ignores in your config files but that doesn't prevent you from making the same errors in new files.

We chose to do the ignores on a file basis as it is a perfect balance and it means that the tracking/graphing aspects of Lint to the Future provide you with achievable goals, especially in large codebases.

### Why would you run this instead of just running `lint fix` to fix as many problems as possible

This tool is designed to make it as easy as possible to add a new lint rule to your project and having a massive PR that changes the code in hundreds of files is not very easy to review. I talk about this in a blog post about [keeping a clean git history](https://simplabs.com/blog/2021/05/26/keeping-a-clean-git-history/), but if you want to add a new lint rule to a project you should consider running lint-to-the-future to add your ignores and then either remove each type of ignore while fixing all files in a follow up PR or remove them one file at a time (depending on how big your project is)

This is especially important if you're in the middle of a big upgrade PR where you are upgrading dependencies (and sometimes code if you're using something like [ember-cli-update](https://github.com/ember-cli/ember-cli-update)) because you don't want to make an already big PR even bigger.
