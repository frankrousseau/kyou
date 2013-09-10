// Generated by CoffeeScript 1.6.2
var date_helpers;

date_helpers = require('./date');

module.exports = function(rows) {
  var data, date, dateString, normalizedRows, now, row, _i, _len;

  normalizedRows = {};
  data = {};
  for (_i = 0, _len = rows.length; _i < _len; _i++) {
    row = rows[_i];
    data[row.key] = row.value;
  }
  now = new Date;
  now.setHours(0, 0, 0, 0);
  date = new Date;
  date.setDate(date.getDate() - 133);
  while (date < now) {
    date.setDate(date.getDate() + 1);
    dateString = date_helpers.getDateString(date);
    if (data[dateString] != null) {
      normalizedRows[dateString] = data[dateString];
    } else {
      normalizedRows[dateString] = 0;
    }
  }
  return normalizedRows;
};
