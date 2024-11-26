import Controller from '@ember/controller';

export default class IndexController extends Controller {
  get rules() {
    let rulesToComplete = {};
    let completedRules = {};
    for (let key in this.model.data) {
      let rule = this.model.data[key];
      if (rule[this.model.highestDate]) {
        rulesToComplete[key] = rule;
      } else {
        completedRules[key] = rule;
      }
    }
    return { rulesToComplete, completedRules };
  }
}
