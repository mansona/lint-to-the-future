/* eslint-disable prettier/prettier */
import { module, test } from 'qunit';
import { visit, currentURL, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | basic', function(hooks) {
  setupApplicationTest(hooks);

  test('basic functionality', async function(assert) {
    await visit('/');

    assert.equal(currentURL(), '/');
    assert.dom('[data-test-chart]').exists({count: 10})
    // await this.pauseTest();

    assert.dom('[data-test-chart="lint-to-the-future-ember-template:require-valid-alt-text"] [data-test-time-button="monthly"]').isChecked();
    assert.dom('[data-test-chart="lint-to-the-future-eslint:ember/no-empty-glimmer-component-classes"] [data-test-time-button="daily"]').isChecked();
    assert.dom('[data-test-chart="lint-to-the-future-eslint:prettier/prettier"] [data-test-time-button="weekly"]').isChecked();

    await click('[data-test-view-files="lint-to-the-future-eslint:prettier/prettier"]');
    assert.equal(currentURL(), '/rule/lint-to-the-future-eslint:prettier/prettier');
    assert.dom('[data-test-file]').exists({count: 32})
  });

  test('completed rules are filtered into collapsed window', async function (assert) {
    await visit('/');

    assert.equal(currentURL(), '/');
    // top level charts
    assert.dom('.ember-application > div > [data-test-chart]').exists({count: 9})

    assert.dom('[data-test-completed-rules] [data-test-chart]').exists({count: 1});
  })
});
