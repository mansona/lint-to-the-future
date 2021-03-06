import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';

import { Chart } from "frappe-charts/dist/frappe-charts.min.esm";

function normaliseData(data) {
  let keys = Object.keys(data);

  let output = {};

  let dates = keys.map(key => new Date(key));

  let min = Math.min(...dates);
  let max = Math.max(...dates);

  let normalisedKeys = [];
  let currentDate = new Date(min);

  while (currentDate <= max) {
    normalisedKeys.push(currentDate.toISOString().split('T')[0]);

    currentDate.setDate(currentDate.getDate() + 1);
  }

  let lastValue;
  normalisedKeys.forEach(key => {
    if(data[key]) {
      lastValue = data[key].length
    }
    output[key] = lastValue;
  })

  return output;
}

function weeklyData(data) {

  let newData = {};

  let keys = Object.keys(data);

  for(let x = 0; x < keys.length; x += 7) {
    newData[keys[x]] = data[keys[x]];
  }

  newData[keys[keys.length -1]] = data[keys[keys.length -1]];

  console.log({newData, data, newDataLength: Object.keys(newData).length, dataLength: Object.keys(data).length})
  return newData;
}

function getData(processedData, ruleName) {
  return {
    labels: Object.keys(processedData),
    datasets: [
        {
            name: ruleName,
            type: "line",
            values: Object.values(processedData)
        }
    ],
    yMarkers: [
        {
            label: '',
            value: 0,
            type: 'solid'
        }
    ]
  };
}

export default class ChartComponent extends Component {
  @tracked
  timeSeries = 'daily';

  get plugin() {
    return this.args.rule.split(':')[0];
  }

  get ruleName() {
    return this.args.rule.split(':')[1];
  }

  get guid() {
    return guidFor(this);
  }

  @action
  selectTimeSeries(series) {
    this.timeSeries = series;
    let processedData = normaliseData(this.args.data);

    if (series === 'weekly') {
      processedData = weeklyData(processedData);
    }

    this.chart.update(getData(processedData, this.ruleName));
  }

  @action
  renderChart(element) {
    let processedData = normaliseData(this.args.data);

    // set the default to weekly data if too many datapoints
    if (Object.keys(processedData).length > 40) {
      processedData = weeklyData(processedData);
      this.timeSeries = 'weekly';
    }

    const data = getData(processedData, this.ruleName);

    this.chart = new Chart(element, {
        data: data,
        type: 'axis-mixed', // or 'bar', 'line', 'scatter', 'pie', 'percentage'
        height: 250,
        colors: ['#7cd6fd', '#743ee2'],
        axisOptions: {
          xIsSeries: true
        }
    })
  }
}
