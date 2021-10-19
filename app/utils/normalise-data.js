export default function normaliseData(data) {
  let keys = Object.keys(data);

  let output = {};

  let dates = keys.map(key => new Date(key));

  let min = Math.min(...dates);
  let minDate = new Date(min);
  let minDateUTC = Date.UTC(minDate.getUTCFullYear(), minDate.getUTCMonth(), minDate.getUTCDate());

  let max = Math.max(...dates);
  let maxDate = new Date(max);
  let maxDateUTC = Date.UTC(maxDate.getUTCFullYear(), maxDate.getUTCMonth(), maxDate.getUTCDate());

  let normalisedKeys = [];

  let currentDate = new Date(minDateUTC);

  while (Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate()) <= maxDateUTC) {
    normalisedKeys.push(new Date(currentDate).toISOString().split('T')[0]);

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
