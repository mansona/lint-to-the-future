/* eslint-disable prettier/prettier */
export default function timeSeries(data) {
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
