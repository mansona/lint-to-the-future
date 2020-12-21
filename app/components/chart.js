import Component from '@glimmer/component';
import { action } from '@ember/object';

import { Chart } from "frappe-charts/dist/frappe-charts.min.esm";

function normaliseData(data) {
  console.log(data);
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

export default class ChartComponent extends Component {
  get plugin() {
    return this.args.rule.split(':')[0];
  }

  get ruleName() {
    return this.args.rule.split(':')[1];
  }

  @action
  renderChart(element) {
    let processedData = normaliseData(this.args.data);

    console.log({processedData});

    const data = {
        labels: Object.keys(processedData),
        datasets: [
            {
                name: this.ruleName,
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
    }

    this.chart = new Chart(element, {
        data: data,
        type: 'axis-mixed', // or 'bar', 'line', 'scatter', 'pie', 'percentage'
        height: 250,
        colors: ['#7cd6fd', '#743ee2']
    })
  }
}
