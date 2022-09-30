# Lint to the Future - Dashboard Deployment

This documentation is for **manual deployment** of the Lint to the Future dashboard. The **vast** majority of people do not need to know how to deploy things in this level of detail and should just follow the basic instructions in the [main README file](/README.md)

**Note:** this is work-in-progress document and if you have any improvements to it please feel free to open a PR 👍

## Setting up the dashboard for manual deployment

The following command can run within your application directory and will generate the dashboard web application and take a data snapshot of your current lint disables. If you have previous results, it will collate them to create a graph over time.

```
npx lint-to-the-future output -o <output-dir> --rootUrl <root-url> --previous-results <path-to-previous-results>
```

```
-o <required>
  This argument specifies the output directory of dashboard application.

--rootUrl <optional>
  This argument is required if the dashboard is not hosted on your servers rootUrl.
  e.g. the ember-styleguide dashboard URL is https://ember-learn.github.io/ember-styleguide/ so --rootUrl ember-styleguide is required

--previous-results <optional>
  This argument can accept either a local path or a URL.
  As the name suggests this should be a path or URL to the previous data.json file that was generated when this command was last run.
  This argument is only required if you want historical data.
```

After sucessfully running the command you will have the dashboard application generated in your chosen directory ready to be deployed to your chosen environment.
