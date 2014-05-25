// Generated by CoffeeScript 1.7.1
var Tracker, TrackerAmount, moment, normalizer, slugify, trackerUtils;

moment = require('moment');

slugify = require('cozy-slug');

Tracker = require('../models/tracker');

TrackerAmount = require('../models/trackeramount');

normalizer = require('../lib/normalizer');

trackerUtils = require('../lib/trackers');

module.exports = {
  loadDay: function(req, res, next, day) {
    req.day = moment(req.params.day);
    req.day.hours(0, 0, 0, 0);
    return next();
  },
  loadTracker: function(req, res, next, trackerId) {
    return Tracker.request('all', {
      key: trackerId
    }, function(err, trackers) {
      if (err) {
        return next(err);
      } else if (trackers.length === 0) {
        console.log('Tracker not found');
        return res.send({
          error: 'not found'
        }, 404);
      } else {
        req.tracker = trackers[0];
        return next();
      }
    });
  },
  allBasicTrackers: function(req, res, next) {
    var tracker, trackers, _i, _len;
    trackers = trackerUtils.getTrackers();
    for (_i = 0, _len = trackers.length; _i < _len; _i++) {
      tracker = trackers[_i];
      tracker.slug = slugify(tracker.name);
      tracker.path = "basic-trackers/" + tracker.slug;
      delete tracker.request;
    }
    return res.send(trackers);
  },
  all: function(req, res, next) {
    return Tracker.request('byName', function(err, trackers) {
      if (err) {
        return next(err);
      } else {
        return res.send(trackers);
      }
    });
  },
  create: function(req, res, next) {
    return Tracker.create(req.body, function(err, tracker) {
      if (err) {
        return next(err);
      } else {
        return res.send(tracker);
      }
    });
  },
  update: function(req, res, next) {
    return req.tracker.updateAttributes(req.body, function(err) {
      if (err) {
        return next(err);
      } else {
        return res.send({
          success: true
        });
      }
    });
  },
  destroy: function(req, res, next) {
    return TrackerAmount.destroyAll(req.tracker, function(err) {
      if (err) {
        return next(err);
      } else {
        return req.tracker.destroy(function(err) {
          if (err) {
            return next(err);
          } else {
            return res.send({
              success: true
            });
          }
        });
      }
    });
  },
  day: function(req, res, next) {
    return req.tracker.getAmount(req.day, function(err, trackerAmount) {
      if (err) {
        return next(err);
      } else if (trackerAmount != null) {
        return res.send(trackerAmount);
      } else {
        return res.send({});
      }
    });
  },
  updateDayValue: function(req, res, next) {
    return req.tracker.getAmount(req.day, function(err, trackerAmount) {
      var data;
      if (err) {
        return next(err);
      } else if (trackerAmount != null) {
        trackerAmount.amount = req.body.amount;
        return trackerAmount.save(function(err) {
          if (err) {
            return next(err);
          } else {
            return res.send(trackerAmount);
          }
        });
      } else {
        data = {
          amount: req.body.amount,
          date: req.day,
          tracker: req.tracker.id
        };
        return TrackerAmount.create(data, function(err, trackerAmount) {
          if (err) {
            return next(err);
          } else {
            return res.send(trackerAmount);
          }
        });
      }
    });
  },
  amounts: function(req, res, next) {
    var day, id, params;
    id = req.tracker.id;
    day = moment(req.day);
    params = {
      startkey: [id],
      endkey: [id + "0"],
      descending: false
    };
    return TrackerAmount.rawRequest('nbByDay', params, function(err, rows) {
      var data, row, tmpRows, _i, _len;
      if (err) {
        return next(err);
      } else {
        tmpRows = [];
        for (_i = 0, _len = rows.length; _i < _len; _i++) {
          row = rows[_i];
          tmpRows.push({
            key: row['key'][1],
            value: row['value']
          });
        }
        data = normalizer.normalize(tmpRows, day);
        return res.send(normalizer.toClientFormat(data));
      }
    });
  }
};
