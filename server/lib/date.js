// Generated by CoffeeScript 1.6.2
var getDateString;

module.exports.getDateString = getDateString = function(date) {
  var dateString, dd, mm, yyyy;

  yyyy = date.getFullYear().toString();
  mm = (date.getMonth() + 1).toString();
  if (mm.length === 1) {
    mm = "0" + mm;
  }
  dd = date.getDate().toString();
  if (dd.length === 1) {
    dd = "0" + dd;
  }
  dateString = yyyy + '-' + mm + '-' + dd;
  return dateString;
};

module.exports.getTodayModel = function(err, models, callback) {
  var date, model, now;

  if (err) {
    return callback(err);
  } else if (models.length !== 0) {
    model = models[0];
    now = getDateString(new Date);
    date = getDateString(model.date);
    if (now === date) {
      model.id = model._id;
      return callback(null, model);
    } else {
      return callback();
    }
  } else {
    return callback();
  }
};
