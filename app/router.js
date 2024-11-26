/* eslint-disable prettier/prettier */
import EmberRouter from '@ember/routing/router';
import config from 'lint-to-the-future/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {
  this.route('files', { path: 'files/:id'});
  this.route('rule', { path: 'rule/*'});
});
