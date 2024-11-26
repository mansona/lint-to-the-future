import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class RuleRoute extends Route {
  @service router;

  redirect(args) {
    return this.router.transitionTo('rule', args.id);
  }
}
