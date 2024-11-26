import Route from '@ember/routing/route';

export default class RuleRoute extends Route {
  model(params) {
    let application = this.modelFor('application');
    // this seems like a bug in Ember 🙈 but it works so I'm going with it
    let ruleId = params[''];
    let ruleValue = application.data[ruleId];
    let keys = Object.keys(ruleValue);

    // the keys are ISO dates, so sorting them alphabetically always sorts them
    // in date order too :tada:
    let max = keys.sort((a, b) => a > b)[keys.length - 1];

    const pluginName = ruleId.split(':')[0];
    const ruleName = ruleId.split(':').slice(1).join(':');

    // this just returns the most recent list of files
    return {
      fileList: ruleValue[max],
      rule: ruleId,
      pluginName,
      ruleName,
      ruleData: ruleValue,
      highestDate: application.highestDate,
    };
  }
}
