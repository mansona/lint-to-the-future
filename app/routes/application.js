/* eslint-disable prettier/prettier */
import Route from '@ember/routing/route';
import fetch from 'fetch';
import { Temporal } from 'temporal-polyfill'

import env from 'lint-to-the-future/config/environment';

import timeSeries from 'lint-to-the-future/utils/time-series';

function lengthOrValuOrZero(data) {
  if(!data) {
    return 0;
  }
  return data.length ?? data;
}

function compareData(data, today, past) {
  const timeSeriesData = timeSeries(data);

  let changed = {}
  let removed = [];
  let added = [];

  for(let rule in timeSeriesData) {
    let diff = lengthOrValuOrZero(timeSeriesData[rule][today]) - lengthOrValuOrZero(timeSeriesData[rule][past]);

    if (diff !== 0 ) {
      changed[rule] = diff;
    }

    if (!timeSeriesData[rule][today] && timeSeriesData[rule][past]) {
      removed.push(rule);
    }

    if (timeSeriesData[rule][today] && !timeSeriesData[rule][past]) {
      added.push(rule);
    }
  }
  return {
    changed,
    removed,
    added,
  }
}

export default class ApplicationRoute extends Route {
  async model() {
    let data = await (await fetch(`${env.rootURL}data.json`)).json();

    let allDates = Object.keys(data).sort((a, b) => b.localeCompare(a))

    let timeSeriesData =  timeSeries(data);

    const globalHighestDate = allDates[0];
    const stats = {}

    const today = Temporal.PlainDate.from(globalHighestDate);

    // there is at least another date in the data
    if (allDates[1]) {
      const yesterday = Temporal.PlainDate.from(allDates[1]);
      if (yesterday.until(today).days === 1) {
        // there was a yesterday
        stats.today = compareData({
          [globalHighestDate]: data[globalHighestDate],
          [allDates[1]]: data[allDates[1]]
        }, globalHighestDate, allDates[1])
      }

      let lastWeek = yesterday;

      for (let i = 2; i < allDates.length; i++) {
        const currentDate = Temporal.PlainDate.from(allDates[i]);
        if (currentDate.until(today).days > 7) {
          break;
        }

        if (currentDate.until(lastWeek).days > 0) {
          lastWeek = Temporal.PlainDate.from(currentDate)
        }
      }

      // if we have a date that is bigger than yesterday but not bigger than 7 days ago
      if (lastWeek !== yesterday) {
        stats.thisWeek = compareData({
          [globalHighestDate]: data[globalHighestDate],
          [lastWeek.toString()]: data[lastWeek.toString()]
        }, globalHighestDate, lastWeek.toString())
      }
    }

    return {
      data: timeSeriesData,
      highestDate: globalHighestDate,
      stats,
    }
  }
}
