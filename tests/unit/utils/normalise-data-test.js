/* eslint-disable prettier/prettier */
import normaliseData from 'lint-to-the-future/utils/normalise-data';
import timeSeries from 'lint-to-the-future/utils/time-series';
import {
  module,
  test
} from 'qunit';

import {
  zero as zeroFixture
} from '../../fixtures/data';

module('Unit | Utility | normalise-data', function() {

  test('it normalises the data', function(assert) {
    let timeSeriesData = timeSeries(zeroFixture);

    let result = normaliseData(timeSeriesData['lint-to-the-future-eslint:ember/no-empty-glimmer-component-classes'], '2021-04-10');

    assert.deepEqual(result, {
      "2021-03-18": 4,
      "2021-03-19": 4,
      "2021-03-20": 4,
      "2021-03-21": 4,
      "2021-03-22": 4,
      "2021-03-23": 4,
      "2021-03-24": 4,
      "2021-03-25": 4,
      "2021-03-26": 4,
      "2021-03-27": 4,
      "2021-03-28": 4,
      "2021-03-29": 4,
      "2021-03-30": 4,
      "2021-03-31": 4,
      "2021-04-01": 3,
      "2021-04-02": 2,
      "2021-04-03": 1,
      "2021-04-04": 0,
    });
  });
});
