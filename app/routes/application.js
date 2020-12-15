import Route from '@ember/routing/route';
import fetch from 'fetch';

export default class ApplicationRoute extends Route {
  async model() {
    let data = await (await fetch('/data.json')).json();

    let results = {};

    Object.keys(data).forEach((date) => {
      Object.keys(data[date]).forEach((plugin) => {
        Object.keys(data[date][plugin]).forEach((rule) => {
          let compoundKey = `${plugin}:${rule}`;
          if (results[compoundKey]) {
            results[compoundKey][date] = data[date][plugin][rule];
          } else {
            results[compoundKey] = {
              [date]: data[date][plugin][rule],
            };
          }
        })
      })
    });

    return results;
  }
}
