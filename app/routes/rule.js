import Route from '@ember/routing/route';

export default class RuleRoute extends Route {
  model(params) {
    let application = this.modelFor('application');
    let ruleValue = application.data[params.id];
    let keys = Object.keys(ruleValue);

    // the keys are ISO dates, so sorting them alphabetically always sorts them
    // in date order too :tada:
    let max = keys.sort((a, b) => a > b)[keys.length - 1];

    const pluginName = params.id.split(':')[0];
    const ruleName = params.id.split(':').slice(1).join(':');

    // this just returns the most recent list of files
    return {
      fileList: ruleValue[max],
      rule: params.id,
      pluginName,
      ruleName,
      ruleData: ruleValue,
      highestDate: application.highestDate,
    };
  }
}
