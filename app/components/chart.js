import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked, cached } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';

import { Chart } from 'frappe-charts/dist/frappe-charts.min.esm';

import normaliseData from '../utils/normalise-data';

function weeklyData(data) {
  let newData = {};

  let keys = Object.keys(data);

  for (let x = 0; x < keys.length; x += 7) {
    newData[keys[x]] = data[keys[x]];
  }

  newData[keys[keys.length - 1]] = data[keys[keys.length - 1]];

  return newData;
}

function monthlyData(data) {
  let newData = {};

  let keys = Object.keys(data);

  for (let x = 0; x < keys.length; x += 30) {
    newData[keys[x]] = data[keys[x]];
  }

  newData[keys[keys.length - 1]] = data[keys[keys.length - 1]];

  return newData;
}

function getData(processedData, ruleName) {
  return {
    labels: Object.keys(processedData),
    datasets: [
      {
        name: ruleName,
        type: 'line',
        values: Object.values(processedData),
      },
    ],
    // This is a hack to remove the y-markers that are designed to remove fractional numbers from the axis.
    // Now every chart will have a minimum height of 5. Not great but 🤷‍♂️
    yMarkers: [
      {
        label: '',
        value: 0,
        type: 'solid',
      },
      {
        label: '',
        value: 5,
        type: 'solid',
      },
    ],
  };
}

export default class ChartComponent extends Component {
  @tracked
  timeSeries = 'daily';

  get plugin() {
    return this.args.rule.split(':')[0];
  }

  get ruleName() {
    return this.args.rule.split(':').slice(1).join(':');
  }

  get guid() {
    return guidFor(this);
  }

  get shouldShowLink() {
    return this.args.showLink ?? true;
  }

  @action
  selectTimeSeries(series) {
    this.timeSeries = series;
    let processedData = this.processedData;

    if (series === 'weekly') {
      processedData = weeklyData(processedData);
    }

    if (series === 'monthly') {
      processedData = monthlyData(processedData);
    }

    this.chart.update(getData(processedData, this.ruleName));
  }

  @cached
  get processedData() {
    return normaliseData(this.args.data, this.args.highestDate);
  }

  constructor() {
    super(...arguments);

    let processedData = this.processedData;

    if (Object.keys(processedData).length > 100) {
      this.timeSeries = 'monthly';
    } else if (Object.keys(processedData).length > 40) {
      this.timeSeries = 'weekly';
    }
  }

  @action
  renderChart(element) {
    let processedData = this.processedData;

    // set the default to weekly data if too many datapoints
    if (this.timeSeries === 'monthly') {
      processedData = monthlyData(processedData);
    } else if (this.timeSeries === 'weekly') {
      processedData = weeklyData(processedData);
    }

    const data = getData(processedData, this.ruleName);

    this.chart = new Chart(element, {
      data: data,
      type: 'axis-mixed', // or 'bar', 'line', 'scatter', 'pie', 'percentage'
      height: 250,
      colors: ['#7cd6fd', '#743ee2'],
      axisOptions: {
        xIsSeries: true,
      },
    });
  }
}
