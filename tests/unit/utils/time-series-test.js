/* eslint-disable prettier/prettier */
import timeSeries from 'lint-to-the-future/utils/time-series';
import {
  module,
  test
} from 'qunit';

import {
  zero as zeroFixture
} from '../../fixtures/data';

module('Unit | Utility | time-series', function() {
  test('it correctly creates a time-series json', function(assert) {
    let result = timeSeries(zeroFixture);
    assert.deepEqual(result, {
      "lint-to-the-future-ember-template:require-valid-alt-text": {
        "2021-03-18": ["addon/templates/components/es-card-content.hbs"],
        "2021-04-01": ["addon/templates/components/es-card-content.hbs"],
        "2021-04-02": ["addon/templates/components/es-card-content.hbs"],
        "2021-04-03": ["addon/templates/components/es-card-content.hbs"],
        "2021-04-10": ["addon/templates/components/es-card-content.hbs"]
      },
      "lint-to-the-future-eslint:ember/no-empty-glimmer-component-classes": {
        "2021-03-18": ["addon/components/es-card.js", "addon/components/es-footer-contributions.js", "addon/components/es-footer-info.js", "addon/components/es-link-card.js"],
        "2021-04-01": ["addon/components/es-card.js", "addon/components/es-footer-contributions.js", "addon/components/es-link-card.js"],
        "2021-04-02": ["addon/components/es-footer-contributions.js", "addon/components/es-link-card.js"],
        "2021-04-03": ["addon/components/es-link-card.js"]
      },
      "lint-to-the-future-eslint:ember/no-classic-components": {
        "2021-04-03": ["addon/components/es-header-navbar-link.js"],
        "2021-04-10": ["addon/components/es-header-navbar-link.js"]
      }
    });
  });
});
