(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("application", function(exports, require, module) {
var initSpinner;

initSpinner = function() {
  return $.fn.spin = function(opts, color) {
    var presets;
    presets = {
      tiny: {
        lines: 8,
        length: 2,
        width: 2,
        radius: 3
      },
      small: {
        lines: 8,
        length: 1,
        width: 2,
        radius: 5
      },
      large: {
        lines: 10,
        length: 8,
        width: 4,
        radius: 8
      }
    };
    if (Spinner) {
      return this.each(function() {
        var $this, spinner;
        $this = $(this);
        spinner = $this.data("spinner");
        if (spinner != null) {
          spinner.stop();
          return $this.data("spinner", null);
        } else if (opts !== false) {
          if (typeof opts === "string") {
            if (opts in presets) {
              opts = presets[opts];
            } else {
              opts = {};
            }
            if (color) {
              opts.color = color;
            }
          }
          spinner = new Spinner($.extend({
            color: $this.css("color")
          }, opts));
          spinner.spin(this);
          return $this.data("spinner", spinner);
        }
      });
    } else {
      return console.log('Spinner class is not available');
    }
  };
};

module.exports = {
  initialize: function() {
    var Router;
    initSpinner();
    Router = require('router');
    this.router = new Router();
    Backbone.history.start();
    if (typeof Object.freeze === 'function') {
      return Object.freeze(this);
    }
  }
};

});

;require.register("collections/basic_trackers", function(exports, require, module) {
var TrackersCollection, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = TrackersCollection = (function(_super) {
  __extends(TrackersCollection, _super);

  function TrackersCollection() {
    _ref = TrackersCollection.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  TrackersCollection.prototype.model = require('../models/basic_tracker');

  TrackersCollection.prototype.url = 'basic-trackers';

  return TrackersCollection;

})(Backbone.Collection);

});

;require.register("collections/dailynotes", function(exports, require, module) {
var DailyNotes, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = DailyNotes = (function(_super) {
  __extends(DailyNotes, _super);

  function DailyNotes() {
    _ref = DailyNotes.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  DailyNotes.prototype.model = require('../models/dailynote');

  DailyNotes.prototype.url = 'dailynotes/';

  return DailyNotes;

})(Backbone.Collection);

});

;require.register("collections/moods", function(exports, require, module) {
var Moods, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = Moods = (function(_super) {
  __extends(Moods, _super);

  function Moods() {
    _ref = Moods.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Moods.prototype.model = require('../models/mood');

  Moods.prototype.url = 'moods/';

  return Moods;

})(Backbone.Collection);

});

;require.register("collections/tracker_amounts", function(exports, require, module) {
var TrackersCollection, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = TrackersCollection = (function(_super) {
  __extends(TrackersCollection, _super);

  function TrackersCollection() {
    _ref = TrackersCollection.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  TrackersCollection.prototype.model = require('../models/tracker_amount');

  return TrackersCollection;

})(Backbone.Collection);

});

;require.register("collections/trackers", function(exports, require, module) {
var TrackersCollection, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = TrackersCollection = (function(_super) {
  __extends(TrackersCollection, _super);

  function TrackersCollection() {
    _ref = TrackersCollection.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  TrackersCollection.prototype.model = require('../models/tracker');

  TrackersCollection.prototype.url = 'trackers';

  return TrackersCollection;

})(Backbone.Collection);

});

;require.register("initialize", function(exports, require, module) {
var app;

app = require('application');

$(function() {
  require('lib/app_helpers');
  return app.initialize();
});

});

;require.register("lib/app_helpers", function(exports, require, module) {
(function() {
  return (function() {
    var console, dummy, method, methods, _results;
    console = window.console = window.console || {};
    method = void 0;
    dummy = function() {};
    methods = 'assert,count,debug,dir,dirxml,error,exception,\
                   group,groupCollapsed,groupEnd,info,log,markTimeline,\
                   profile,profileEnd,time,timeEnd,trace,warn'.split(',');
    _results = [];
    while (method = methods.pop()) {
      _results.push(console[method] = console[method] || dummy);
    }
    return _results;
  })();
})();

});

;require.register("lib/base_view", function(exports, require, module) {
var BaseView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = BaseView = (function(_super) {
  __extends(BaseView, _super);

  function BaseView() {
    _ref = BaseView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  BaseView.prototype.template = function() {};

  BaseView.prototype.initialize = function() {};

  BaseView.prototype.getRenderData = function() {
    var _ref1;
    return {
      model: (_ref1 = this.model) != null ? _ref1.toJSON() : void 0
    };
  };

  BaseView.prototype.render = function() {
    this.beforeRender();
    this.$el.html(this.template(this.getRenderData()));
    this.afterRender();
    return this;
  };

  BaseView.prototype.beforeRender = function() {};

  BaseView.prototype.afterRender = function() {};

  BaseView.prototype.destroy = function() {
    this.undelegateEvents();
    this.$el.removeData().unbind();
    this.remove();
    return Backbone.View.prototype.remove.call(this);
  };

  return BaseView;

})(Backbone.View);

});

;require.register("lib/graph", function(exports, require, module) {
module.exports = {
  draw: function(el, yEl, width, color, data, graphStyle, comparisonData, time) {
    var graph, hoverDetail, renderer, series, x_axis, y_axis;
    if (graphStyle == null) {
      graphStyle = "bar";
    }
    if (comparisonData != null) {
      series = [
        {
          color: color,
          data: data
        }, {
          color: 'red',
          data: comparisonData
        }
      ];
      renderer = graphStyle;
    } else {
      series = [
        {
          color: color,
          data: data
        }
      ];
      renderer = graphStyle;
    }
    graph = new Rickshaw.Graph({
      element: el,
      width: width,
      height: 300,
      renderer: renderer,
      series: series,
      interpolation: 'linear',
      min: 'auto'
    });
    if ((time == null) || time) {
      x_axis = new Rickshaw.Graph.Axis.Time({
        graph: graph
      });
    } else {
      x_axis = new Rickshaw.Graph.Axis.X({
        graph: graph
      });
    }
    y_axis = new Rickshaw.Graph.Axis.Y({
      graph: graph,
      orientation: 'left',
      tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
      element: yEl
    });
    graph.render();
    hoverDetail = new Rickshaw.Graph.HoverDetail({
      graph: graph,
      xFormatter: function(x) {
        return moment(x * 1000).format('MM/DD/YY');
      },
      formatter: function(series, x, y) {
        return Math.floor(y);
      }
    });
    return graph;
  },
  clear: function(el, yEl) {
    $(el).html(null);
    return $(yEl).html(null);
  },
  getWeekData: function(data) {
    var date, entry, epoch, graphData, graphDataArray, value, _i, _len;
    graphData = {};
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      entry = data[_i];
      date = moment(new Date(entry.x * 1000));
      date = date.day(1);
      epoch = date.unix();
      if (graphData[epoch] != null) {
        graphData[epoch] += entry.y;
      } else {
        graphData[epoch] = entry.y;
      }
    }
    graphDataArray = [];
    for (epoch in graphData) {
      value = graphData[epoch];
      graphDataArray.push({
        x: parseInt(epoch),
        y: value
      });
    }
    return graphDataArray;
  },
  getMonthData: function(data) {
    var date, entry, epoch, graphData, graphDataArray, value, _i, _len;
    graphData = {};
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      entry = data[_i];
      date = moment(new Date(entry.x * 1000));
      date = date.date(1);
      epoch = date.unix();
      if (graphData[epoch] != null) {
        graphData[epoch] += entry.y;
      } else {
        graphData[epoch] = entry.y;
      }
    }
    graphDataArray = [];
    for (epoch in graphData) {
      value = graphData[epoch];
      graphDataArray.push({
        x: parseInt(epoch),
        y: value
      });
    }
    graphDataArray = _.sortBy(graphDataArray, function(entry) {
      return entry.x;
    });
    return graphDataArray;
  },
  normalizeComparisonData: function(data, comparisonData) {
    var entry, factor, max, maxComparisonData, maxData, newComparisonData, _i, _j, _k, _len, _len1, _len2;
    maxData = 0;
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      entry = data[_i];
      if (entry.y > maxData) {
        maxData = entry.y;
      }
    }
    maxComparisonData = 0;
    for (_j = 0, _len1 = comparisonData.length; _j < _len1; _j++) {
      entry = comparisonData[_j];
      if (entry.y > maxComparisonData) {
        maxComparisonData = entry.y;
      }
    }
    factor = maxData / maxComparisonData;
    newComparisonData = [];
    for (_k = 0, _len2 = comparisonData.length; _k < _len2; _k++) {
      entry = comparisonData[_k];
      if (entry.y > max) {
        max = entry.y;
      }
      newComparisonData.push({
        x: entry.x,
        y: entry.y * factor
      });
    }
    return newComparisonData;
  },
  mixData: function(data, comparisonData) {
    var dataHash, entry, newData, _i, _j, _len, _len1;
    dataHash = {};
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      entry = data[_i];
      dataHash[entry.x] = entry.y;
    }
    newData = [];
    for (_j = 0, _len1 = comparisonData.length; _j < _len1; _j++) {
      entry = comparisonData[_j];
      newData.push({
        x: entry.y,
        y: dataHash[entry.x]
      });
    }
    newData = _.sortBy(newData, function(entry) {
      return entry.x;
    });
    return newData;
  }
};

});

;require.register("lib/model", function(exports, require, module) {
var Model, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = Model = (function(_super) {
  __extends(Model, _super);

  function Model() {
    _ref = Model.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Model.prototype.idAttribute = '_id';

  Model.prototype.bindField = function(attribute, field) {
    var _this = this;
    if (field == null) {
      return console.log("try to bind a non existing field with " + attribute);
    } else {
      field.keyup(function() {
        _this.set(attribute, field.val(), {
          silent: true
        });
        return true;
      });
      return this.on("change:" + attribute, function() {
        return field.val(_this.get("attribute"));
      });
    }
  };

  return Model;

})(Backbone.Model);

});

;require.register("lib/request", function(exports, require, module) {
exports.request = function(type, url, data, callback) {
  return $.ajax({
    type: type,
    url: url,
    data: data != null ? JSON.stringify(data) : null,
    contentType: "application/json",
    dataType: "json",
    success: function(data) {
      if (callback != null) {
        return callback(null, data);
      }
    },
    error: function(data) {
      if ((data != null) && (data.msg != null) && (callback != null)) {
        return callback(new Error(data.msg));
      } else if (callback != null) {
        return callback(new Error("Server error occured"));
      }
    }
  });
};

exports.get = function(url, callback) {
  return exports.request("GET", url, null, callback);
};

exports.post = function(url, data, callback) {
  return exports.request("POST", url, data, callback);
};

exports.put = function(url, data, callback) {
  return exports.request("PUT", url, data, callback);
};

exports.del = function(url, callback) {
  return exports.request("DELETE", url, null, callback);
};

});

;require.register("lib/view_collection", function(exports, require, module) {
var BaseView, ViewCollection, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

module.exports = ViewCollection = (function(_super) {
  __extends(ViewCollection, _super);

  function ViewCollection() {
    this.removeItem = __bind(this.removeItem, this);
    this.addItem = __bind(this.addItem, this);
    _ref = ViewCollection.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  ViewCollection.prototype.itemview = null;

  ViewCollection.prototype.views = {};

  ViewCollection.prototype.template = function() {
    return '';
  };

  ViewCollection.prototype.itemViewOptions = function() {};

  ViewCollection.prototype.collectionEl = null;

  ViewCollection.prototype.onChange = function() {
    return this.$el.toggleClass('empty', _.size(this.views) === 0);
  };

  ViewCollection.prototype.appendView = function(view) {
    return this.$collectionEl.append(view.el);
  };

  ViewCollection.prototype.initialize = function() {
    ViewCollection.__super__.initialize.apply(this, arguments);
    this.views = {};
    this.listenTo(this.collection, "reset", this.onReset);
    this.listenTo(this.collection, "add", this.addItem);
    return this.listenTo(this.collection, "remove", this.removeItem);
  };

  ViewCollection.prototype.render = function() {
    var id, view, _ref1;
    _ref1 = this.views;
    for (id in _ref1) {
      view = _ref1[id];
      view.$el.detach();
    }
    return ViewCollection.__super__.render.apply(this, arguments);
  };

  ViewCollection.prototype.afterRender = function() {
    var id, view, _ref1;
    if (this.colllectionEl != null) {
      this.$collectionEl = $(this.collectionEl);
    } else {
      this.$collectionEl = this.$el;
    }
    _ref1 = this.views;
    for (id in _ref1) {
      view = _ref1[id];
      this.appendView(view.$el);
    }
    this.onReset(this.collection);
    return this.onChange(this.views);
  };

  ViewCollection.prototype.remove = function() {
    this.onReset([]);
    return ViewCollection.__super__.remove.apply(this, arguments);
  };

  ViewCollection.prototype.onReset = function(newcollection) {
    var id, view, _ref1;
    _ref1 = this.views;
    for (id in _ref1) {
      view = _ref1[id];
      view.remove();
    }
    return newcollection.forEach(this.addItem);
  };

  ViewCollection.prototype.addItem = function(model) {
    var options, view;
    options = _.extend({}, {
      model: model
    }, this.itemViewOptions(model));
    view = new this.itemView(options);
    this.views[model.cid] = view.render();
    this.appendView(view);
    return this.onChange(this.views);
  };

  ViewCollection.prototype.removeItem = function(model) {
    this.views[model.cid].remove();
    delete this.views[model.cid];
    return this.onChange(this.views);
  };

  return ViewCollection;

})(BaseView);

});

;require.register("models/basic_tracker", function(exports, require, module) {
var TrackerModel, request, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

request = require('lib/request');

module.exports = TrackerModel = (function(_super) {
  __extends(TrackerModel, _super);

  function TrackerModel() {
    _ref = TrackerModel.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  TrackerModel.prototype.rootUrl = "basic-trackers";

  return TrackerModel;

})(Backbone.Model);

});

;require.register("models/dailynote", function(exports, require, module) {
var DailyNote, Model, request, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Model = require('lib/model');

request = require('lib/request');

module.exports = DailyNote = (function(_super) {
  __extends(DailyNote, _super);

  function DailyNote() {
    _ref = DailyNote.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  DailyNote.prototype.urlRoot = 'dailynotes/';

  DailyNote.getDay = function(day, callback) {
    return request.get("dailynotes/" + (day.format('YYYY-MM-DD')), function(err, dailynote) {
      if (err) {
        return callback(err);
      } else {
        if (dailynote.text != null) {
          return callback(null, new DailyNote(dailynote));
        } else {
          return callback(null, null);
        }
      }
    });
  };

  DailyNote.updateDay = function(day, text, callback) {
    var path;
    path = "dailynotes/" + (day.format('YYYY-MM-DD'));
    return request.put(path, {
      text: text
    }, callback);
  };

  return DailyNote;

})(Model);

});

;require.register("models/mood", function(exports, require, module) {
var Model, Mood, request, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Model = require('lib/model');

request = require('lib/request');

module.exports = Mood = (function(_super) {
  __extends(Mood, _super);

  function Mood() {
    _ref = Mood.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Mood.prototype.urlRoot = 'moods/';

  Mood.getDay = function(day, callback) {
    return request.get("moods/mood/" + (day.format('YYYY-MM-DD')), function(err, mood) {
      if (err) {
        return callback(err);
      } else {
        if (mood.status != null) {
          return callback(null, new Mood(mood));
        } else {
          return callback(null, null);
        }
      }
    });
  };

  Mood.updateDay = function(day, status, callback) {
    var path;
    path = "moods/mood/" + (day.format('YYYY-MM-DD'));
    return request.put(path, {
      status: status
    }, callback);
  };

  return Mood;

})(Model);

});

;require.register("models/tracker", function(exports, require, module) {
var TrackerModel, request, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

request = require('lib/request');

module.exports = TrackerModel = (function(_super) {
  __extends(TrackerModel, _super);

  function TrackerModel() {
    _ref = TrackerModel.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  TrackerModel.prototype.rootUrl = "trackers";

  TrackerModel.prototype.getDay = function(day, callback) {
    var id, path;
    id = this.get('id');
    if (id == null) {
      id = this.id;
    }
    path = "trackers/" + id + "/day/" + (day.format('YYYY-MM-DD'));
    return request.get(path, function(err, tracker) {
      if (err) {
        return callback(err);
      } else {
        if (tracker.amount != null) {
          return callback(null, new TrackerModel(tracker));
        } else {
          return callback(null, null);
        }
      }
    });
  };

  TrackerModel.prototype.updateDay = function(day, amount, callback) {
    var id, path;
    id = this.get('id');
    if (id == null) {
      id = this.id;
    }
    path = "trackers/" + id + "/day/" + (day.format('YYYY-MM-DD'));
    return request.put(path, {
      amount: amount
    }, callback);
  };

  return TrackerModel;

})(Backbone.Model);

});

;require.register("models/tracker_amount", function(exports, require, module) {
var TrackerModel, request,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

request = require('lib/request');

module.exports = TrackerModel = (function(_super) {
  __extends(TrackerModel, _super);

  function TrackerModel(data) {
    var date;
    TrackerModel.__super__.constructor.apply(this, arguments);
    date = this.get('date');
    this.set('displayDate', moment(date).format('YYYY MM DD'));
  }

  return TrackerModel;

})(Backbone.Model);

});

;require.register("router", function(exports, require, module) {
var AppView, Router, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AppView = require('views/app_view');

module.exports = Router = (function(_super) {
  __extends(Router, _super);

  function Router() {
    _ref = Router.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Router.prototype.routes = {
    '': 'main',
    'basic-trackers/:name': 'basicTracker',
    'trackers/:name': 'tracker',
    'mood': 'mood',
    '*path': 'main'
  };

  Router.prototype.createMainView = function() {
    var mainView, _ref1;
    if (((_ref1 = window.app) != null ? _ref1.mainView : void 0) == null) {
      mainView = new AppView();
      mainView.render();
      return window.app.router = this;
    }
  };

  Router.prototype.main = function() {
    this.createMainView();
    return window.app.mainView.displayTrackers();
  };

  Router.prototype.basicTracker = function(name) {
    this.createMainView();
    return window.app.mainView.displayBasicTracker(name);
  };

  Router.prototype.tracker = function(name) {
    this.createMainView();
    return window.app.mainView.displayTracker(name);
  };

  Router.prototype.mood = function(name) {
    this.createMainView();
    return window.app.mainView.displayMood();
  };

  return Router;

})(Backbone.Router);

});

;require.register("views/app_view", function(exports, require, module) {
var AppView, BaseView, BasicTrackerList, DailyNote, DailyNotes, MoodTracker, RawDataTable, Tracker, TrackerList, graphHelper, request,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

request = require('../lib/request');

graphHelper = require('../lib/graph');

BaseView = require('../lib/base_view');

Tracker = require('../models/tracker');

DailyNote = require('../models/dailynote');

DailyNotes = require('../collections/dailynotes');

MoodTracker = require('./mood_tracker');

TrackerList = require('./tracker_list');

BasicTrackerList = require('./basic_tracker_list');

RawDataTable = require('./raw_data_table');

module.exports = AppView = (function(_super) {
  __extends(AppView, _super);

  AppView.prototype.el = 'body.application';

  AppView.prototype.template = require('./templates/home');

  AppView.prototype.events = {
    'change #datepicker': 'onDatePickerChanged',
    'blur #dailynote': 'onDailyNoteChanged',
    'blur input.zoomtitle': 'onCurrentTrackerChanged',
    'blur textarea.zoomexplaination': 'onCurrentTrackerChanged',
    'change #zoomtimeunit': 'onComparisonChanged',
    'change #zoomstyle': 'onComparisonChanged',
    'change #zoomcomparison': 'onComparisonChanged',
    'click #add-tracker-btn': 'onTrackerButtonClicked',
    'click #remove-btn': 'onRemoveButtonClicked',
    'click #show-data-btn': 'onShowDataClicked'
  };

  function AppView() {
    this.onComparisonChanged = __bind(this.onComparisonChanged, this);
    this.onCurrentTrackerChanged = __bind(this.onCurrentTrackerChanged, this);
    this.onShowDataClicked = __bind(this.onShowDataClicked, this);
    this.onRemoveButtonClicked = __bind(this.onRemoveButtonClicked, this);
    this.redrawCharts = __bind(this.redrawCharts, this);
    this.showZoomTracker = __bind(this.showZoomTracker, this);
    this.showTrackers = __bind(this.showTrackers, this);
    this.getRenderData = __bind(this.getRenderData, this);
    AppView.__super__.constructor.apply(this, arguments);
    this.currentDate = moment();
  }

  AppView.prototype.getRenderData = function() {
    return {
      currentDate: this.currentDate.format('MM/DD/YYYY')
    };
  };

  AppView.prototype.afterRender = function() {
    this.colors = {};
    this.data = {};
    this.dataLoaded = false;
    $(window).on('resize', this.redrawCharts);
    window.app = {};
    window.app.mainView = this;
    this.rawDataTable = new RawDataTable();
    this.rawDataTable.render();
    this.$('#raw-data').append(this.rawDataTable.$el);
    this.moodTracker = new MoodTracker();
    this.$('#content').append(this.moodTracker.$el);
    this.moodTracker.render();
    this.trackerList = new TrackerList();
    this.$('#content').append(this.trackerList.$el);
    this.trackerList.render();
    this.basicTrackerList = new BasicTrackerList();
    this.$('#content').append(this.basicTrackerList.$el);
    this.basicTrackerList.render();
    this.$("#datepicker").datepicker({
      maxDate: "+0D"
    });
    this.$("#datepicker").val(this.currentDate.format('LL (dddd)'), {
      trigger: false
    });
    return this.loadNote();
  };

  AppView.prototype.onDatePickerChanged = function() {
    var _this = this;
    this.currentDate = moment(this.$("#datepicker").val());
    this.$("#datepicker").val(this.currentDate.format('LL (dddd)'), {
      trigger: false
    });
    this.loadNote();
    return this.moodTracker.reload(function() {
      return _this.trackerList.reloadAll(function() {
        return _this.basicTrackerList.reloadAll(function() {
          var tracker, trackerView;
          if (_this.$("#zoomtracker").is(":visible")) {
            if (_this.currentTracker === _this.moodTracker) {
              _this.currentData = _this.moodTracker.data;
            } else {
              tracker = _this.currentTracker;
              trackerView = _this.basicTrackerList.views[tracker.cid];
              if (trackerView == null) {
                trackerView = _this.trackerList.views[tracker.cid];
              }
              _this.currentData = trackerView != null ? trackerView.data : void 0;
            }
            return _this.onComparisonChanged();
          }
        });
      });
    });
  };

  AppView.prototype.showTrackers = function() {
    this.$("#moods").show();
    this.$("#tracker-list").show();
    this.$("#basic-tracker-list").show();
    this.$(".tools").show();
    this.$("#dailynote").show();
    this.$("#zoomtracker").hide();
    if (this.dataLoaded) {
      return this.redrawCharts();
    }
  };

  AppView.prototype.showZoomTracker = function() {
    this.$("#moods").hide();
    this.$("#tracker-list").hide();
    this.$("#basic-tracker-list").hide();
    this.$(".tools").hide();
    this.$("#dailynote").hide();
    this.$("#zoomtracker").show();
    this.$("#zoomtimeunit").val('day');
    return this.rawDataTable.collection.reset();
  };

  AppView.prototype.displayTrackers = function() {
    this.showTrackers();
    if (!this.dataLoaded) {
      return this.loadTrackers();
    }
  };

  AppView.prototype.redrawCharts = function() {
    $('.chart').html(null);
    $('.y-axis').html(null);
    if (this.$("#zoomtracker").is(":visible")) {
      this.onComparisonChanged();
    } else {
      this.moodTracker.redraw();
      this.trackerList.redrawAll();
      this.basicTrackerList.redrawAll();
    }
    return true;
  };

  AppView.prototype.onDailyNoteChanged = function(event) {
    var text,
      _this = this;
    text = this.$("#dailynote").val();
    return DailyNote.updateDay(this.currentDate, text, function(err, mood) {
      if (err) {
        return alert("An error occured while saving note of the day");
      }
    });
  };

  AppView.prototype.loadNote = function() {
    var _this = this;
    DailyNote.getDay(this.currentDate, function(err, dailynote) {
      if (err) {
        return alert("An error occured while retrieving daily note data");
      } else if (dailynote == null) {
        return _this.$('#dailynote').val(null);
      } else {
        return _this.$('#dailynote').val(dailynote.get('text'));
      }
    });
    this.notes = new DailyNotes;
    return this.notes.fetch();
  };

  AppView.prototype.onTrackerButtonClicked = function() {
    var description, name;
    name = $('#add-tracker-name').val();
    description = $('#add-tracker-description').val();
    if (name.length > 0) {
      return this.trackerList.collection.create({
        name: name,
        description: description
      }, {
        success: function() {},
        error: function() {
          return alert('A server error occured while saving your tracker');
        }
      });
    }
  };

  AppView.prototype.loadTrackers = function(callback) {
    var _this = this;
    this.dataLoaded = false;
    return this.moodTracker.reload(function() {
      return _this.trackerList.collection.fetch({
        success: function() {
          return _this.basicTrackerList.collection.fetch({
            success: function() {
              _this.dataLoaded = true;
              _this.fillComparisonCombo();
              if (callback != null) {
                return callback();
              }
            }
          });
        }
      });
    });
  };

  AppView.prototype.fillComparisonCombo = function() {
    var combo, option, tracker, _i, _j, _len, _len1, _ref, _ref1, _results;
    combo = this.$("#zoomcomparison");
    combo.append("<option value=\"undefined\">Select the tracker to compare</option>");
    combo.append("<option value=\"moods\">Moods</option>");
    _ref = this.trackerList.collection.models;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      tracker = _ref[_i];
      option = "<option value=";
      option += "\"" + (tracker.get('id')) + "\"";
      option += ">" + (tracker.get('name')) + "</option>";
      combo.append(option);
    }
    _ref1 = this.basicTrackerList.collection.models;
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      tracker = _ref1[_j];
      option = "<option value=";
      option += "\"basic-" + (tracker.get('slug')) + "\"";
      option += ">" + (tracker.get('name')) + "</option>";
      _results.push(combo.append(option));
    }
    return _results;
  };

  AppView.prototype.displayZoomTracker = function(callback) {
    var _this = this;
    if (this.dataLoaded) {
      this.showZoomTracker();
      return callback();
    } else {
      return this.loadTrackers(function() {
        _this.showZoomTracker();
        return callback();
      });
    }
  };

  AppView.prototype.displayMood = function() {
    var _this = this;
    return this.displayZoomTracker(function() {
      _this.$("#remove-btn").hide();
      _this.$("h2.zoomtitle").html(_this.$("#moods h2").html());
      _this.$("p.zoomexplaination").html(_this.$("#moods .explaination").html());
      _this.$("h2.zoomtitle").show();
      _this.$("p.zoomexplaination").show();
      _this.$("input.zoomtitle").hide();
      _this.$("textarea.zoomexplaination").hide();
      _this.$("#show-data-section").hide();
      _this.currentData = _this.moodTracker.data;
      _this.currentTracker = _this.moodTracker;
      return _this.printZoomGraph(_this.currentData, 'steelblue');
    });
  };

  AppView.prototype.displayBasicTracker = function(slug) {
    var _this = this;
    return this.displayZoomTracker(function() {
      var recWait, tracker;
      _this.$("#remove-btn").hide();
      tracker = _this.basicTrackerList.collection.findWhere({
        slug: slug
      });
      if (tracker == null) {
        return alert("Tracker does not exist");
      } else {
        _this.$("h2.zoomtitle").html(tracker.get('name'));
        _this.$("p.zoomexplaination").html(tracker.get('description'));
        _this.$("h2.zoomtitle").show();
        _this.$("p.zoomexplaination").show();
        _this.$("input.zoomtitle").hide();
        _this.$("textarea.zoomexplaination").hide();
        _this.$("#show-data-section").hide();
        recWait = function() {
          var data, _ref;
          data = (_ref = _this.basicTrackerList.views[tracker.cid]) != null ? _ref.data : void 0;
          if (data != null) {
            _this.currentData = data;
            _this.currentTracker = tracker;
            return _this.printZoomGraph(_this.currentData, tracker.get('color'));
          } else {
            return setTimeout(recWait, 10);
          }
        };
        return recWait();
      }
    });
  };

  AppView.prototype.displayTracker = function(id) {
    var _this = this;
    return this.displayZoomTracker(function() {
      var recWait, tracker;
      _this.$("#remove-btn").show();
      tracker = _this.trackerList.collection.findWhere({
        id: id
      });
      if (tracker == null) {
        return alert("Tracker does not exist");
      } else {
        _this.$("input.zoomtitle").val(tracker.get('name'));
        _this.$("textarea.zoomexplaination").val(tracker.get('description'));
        _this.$("h2.zoomtitle").hide();
        _this.$("p.zoomexplaination").hide();
        _this.$("input.zoomtitle").show();
        _this.$("textarea.zoomexplaination").show();
        _this.$("#show-data-section").show();
        _this.$("#show-data-csv").attr('href', "trackers/" + id + "/csv");
        recWait = function() {
          var data, _ref;
          data = (_ref = _this.trackerList.views[tracker.cid]) != null ? _ref.data : void 0;
          if (data != null) {
            _this.currentData = data;
            _this.currentTracker = tracker;
            return _this.printZoomGraph(_this.currentData, tracker.get('color'));
          } else {
            return setTimeout(recWait, 10);
          }
        };
        return recWait();
      }
    });
  };

  AppView.prototype.onRemoveButtonClicked = function() {
    var answer, tracker, view,
      _this = this;
    answer = confirm("Are you sure that you want to delete this tracker?");
    if (answer) {
      tracker = this.currentTracker;
      view = this.trackerList.views[tracker.cid];
      return tracker.destroy({
        success: function() {
          view.remove();
          return window.app.router.navigate('#', {
            trigger: true
          });
        },
        error: function() {
          return alert('something went wrong while removing tracker.');
        }
      });
    }
  };

  AppView.prototype.onShowDataClicked = function() {
    this.rawDataTable.show();
    return this.rawDataTable.load(this.currentTracker);
  };

  AppView.prototype.onCurrentTrackerChanged = function() {
    this.currentTracker.set('name', this.$('input.zoomtitle').val());
    this.currentTracker.set('description', this.$('textarea.zoomexplaination').val());
    return this.currentTracker.save();
  };

  AppView.prototype.onComparisonChanged = function() {
    var color, comparisonData, data, graphStyle, time, timeUnit, tracker, val, _ref, _ref1;
    val = this.$("#zoomcomparison").val();
    timeUnit = $("#zoomtimeunit").val();
    graphStyle = $("#zoomstyle").val();
    data = this.currentData;
    time = true;
    if (val === 'moods') {
      comparisonData = this.moodTracker.data;
    } else if (val.indexOf('basic') !== -1) {
      tracker = this.basicTrackerList.collection.findWhere({
        slug: val.substring(6)
      });
      comparisonData = (_ref = this.basicTrackerList.views[tracker.cid]) != null ? _ref.data : void 0;
    } else if (val !== "undefined") {
      tracker = this.trackerList.collection.findWhere({
        id: val
      });
      comparisonData = (_ref1 = this.trackerList.views[tracker.cid]) != null ? _ref1.data : void 0;
    } else {
      comparisonData = null;
    }
    if (timeUnit === 'week') {
      data = graphHelper.getWeekData(data);
      if (comparisonData != null) {
        comparisonData = graphHelper.getWeekData(comparisonData);
      }
    } else if (timeUnit === 'month') {
      data = graphHelper.getMonthData(data);
      if (comparisonData != null) {
        comparisonData = graphHelper.getMonthData(comparisonData);
      }
    }
    if (graphStyle === 'correlation' && (comparisonData != null)) {
      data = graphHelper.mixData(data, comparisonData);
      comparisonData = null;
      graphStyle = 'scatterplot';
      time = false;
    }
    if (comparisonData != null) {
      comparisonData = graphHelper.normalizeComparisonData(data, comparisonData);
    }
    if (comparisonData != null) {
      color = 'black';
    } else if (this.currentTracker === this.moodTracker) {
      color = 'steelblue';
    } else {
      color = this.currentTracker.get('color');
    }
    return this.printZoomGraph(data, color, graphStyle, comparisonData, time);
  };

  AppView.prototype.printZoomGraph = function(data, color, graphStyle, comparisonData, time) {
    var amount, annotator, average, date, el, graph, note, timelineEl, width, yEl, _i, _j, _len, _len1, _ref;
    if (graphStyle == null) {
      graphStyle = 'line';
    }
    width = $(window).width() - 140;
    el = this.$('#zoom-charts')[0];
    yEl = this.$('#zoom-y-axis')[0];
    graphHelper.clear(el, yEl);
    graph = graphHelper.draw(el, yEl, width, color, data, graphStyle, comparisonData, time);
    timelineEl = this.$('#timeline')[0];
    ({
      element: this.$('#timeline').html(null)
    });
    annotator = new Rickshaw.Graph.Annotate({
      graph: graph,
      element: this.$('#timeline')[0]
    });
    _ref = this.notes.models;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      note = _ref[_i];
      date = moment(note.get('date')).valueOf() / 1000;
      annotator.add(date, note.get('text'));
    }
    annotator.update();
    average = 0;
    for (_j = 0, _len1 = data.length; _j < _len1; _j++) {
      amount = data[_j];
      average += amount.y;
    }
    average = average / data.length;
    return $("#average-value").html(average);
  };

  return AppView;

})(BaseView);

});

;require.register("views/basic_tracker_list", function(exports, require, module) {
var BasicTrackerCollection, BasicTrackerList, ViewCollection, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ViewCollection = require('lib/view_collection');

BasicTrackerCollection = require('collections/basic_trackers');

module.exports = BasicTrackerList = (function(_super) {
  __extends(BasicTrackerList, _super);

  function BasicTrackerList() {
    _ref = BasicTrackerList.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  BasicTrackerList.prototype.id = 'basic-tracker-list';

  BasicTrackerList.prototype.itemView = require('views/basic_tracker_list_item');

  BasicTrackerList.prototype.template = require('views/templates/basic_tracker_list');

  BasicTrackerList.prototype.collection = new BasicTrackerCollection();

  BasicTrackerList.prototype.redrawAll = function() {
    var id, view, _ref1, _results;
    _ref1 = this.views;
    _results = [];
    for (id in _ref1) {
      view = _ref1[id];
      _results.push(view.redrawGraph());
    }
    return _results;
  };

  BasicTrackerList.prototype.reloadAll = function(callback) {
    var id, length, nbLoaded, view, _ref1, _ref2, _results,
      _this = this;
    this.$(".tracker .chart").html('');
    this.$(".tracker .y-axis").html('');
    nbLoaded = 0;
    length = 0;
    _ref1 = this.views;
    for (id in _ref1) {
      view = _ref1[id];
      length++;
    }
    _ref2 = this.views;
    _results = [];
    for (id in _ref2) {
      view = _ref2[id];
      _results.push(view.afterRender(function() {
        nbLoaded++;
        if (nbLoaded === length) {
          if (callback != null) {
            return callback();
          }
        }
      }));
    }
    return _results;
  };

  return BasicTrackerList;

})(ViewCollection);

});

;require.register("views/basic_tracker_list_item", function(exports, require, module) {
var BaseView, BasicTrackerItem, graph, request, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

request = require('lib/request');

graph = require('lib/graph');

module.exports = BasicTrackerItem = (function(_super) {
  __extends(BasicTrackerItem, _super);

  function BasicTrackerItem() {
    this.afterRender = __bind(this.afterRender, this);
    _ref = BasicTrackerItem.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  BasicTrackerItem.prototype.className = 'tracker line';

  BasicTrackerItem.prototype.template = require('views/templates/basic_tracker_list_item');

  BasicTrackerItem.prototype.afterRender = function(callback) {
    var day;
    day = window.app.mainView.currentDate;
    return this.getAnalytics(callback);
  };

  BasicTrackerItem.prototype.getAnalytics = function(callback) {
    var day,
      _this = this;
    this.$('.graph-container').spin('tiny');
    day = window.app.mainView.currentDate.format('YYYY-MM-DD');
    return request.get(this.model.get('path') + '/' + day, function(err, data) {
      if (err) {
        alert('An error occured while retrieving data');
      } else {
        _this.$('.graph-container').spin();
        _this.data = data;
        _this.drawCharts();
      }
      if (callback != null) {
        return callback();
      }
    });
  };

  BasicTrackerItem.prototype.redrawGraph = function() {
    return this.drawCharts();
  };

  BasicTrackerItem.prototype.drawCharts = function() {
    var color, el, width, yEl;
    width = this.$('.graph-container').width() - 70;
    el = this.$('.chart')[0];
    yEl = this.$('.y-axis')[0];
    color = this.model.get('color');
    return graph.draw(el, yEl, width, color, this.data);
  };

  return BasicTrackerItem;

})(BaseView);

});

;require.register("views/mood_tracker", function(exports, require, module) {
var BaseView, Mood, Moods, TrackerItem, graph, request, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

request = require('lib/request');

graph = require('lib/graph');

Mood = require('../models/mood');

Moods = require('../collections/moods');

module.exports = TrackerItem = (function(_super) {
  __extends(TrackerItem, _super);

  function TrackerItem() {
    _ref = TrackerItem.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  TrackerItem.prototype.id = 'moods';

  TrackerItem.prototype.className = 'line';

  TrackerItem.prototype.template = require('./templates/mood');

  TrackerItem.prototype.events = {
    'click #good-mood-btn': 'onGoodMoodClicked',
    'click #neutral-mood-btn': 'onNeutralMoodClicked',
    'click #bad-mood-btn': 'onBadMoodClicked'
  };

  TrackerItem.prototype.onGoodMoodClicked = function() {
    return this.updateMood('good');
  };

  TrackerItem.prototype.onNeutralMoodClicked = function() {
    return this.updateMood('neutral');
  };

  TrackerItem.prototype.onBadMoodClicked = function() {
    return this.updateMood('bad');
  };

  TrackerItem.prototype.updateMood = function(status) {
    var day,
      _this = this;
    this.$('#current-mood').html('&nbsp;');
    this.$('#current-mood').spin('tiny');
    day = window.app.mainView.currentDate;
    return Mood.updateDay(day, status, function(err, mood) {
      _this.$('#current-mood').spin();
      if (err) {
        return alert("An error occured while saving data");
      } else {
        _this.$('#current-mood').html(status);
        graph.clear(_this.$('#moods-charts'), _this.$('#moods-y-axis'));
        return _this.loadAnalytics();
      }
    });
  };

  TrackerItem.prototype.reload = function(callback) {
    var day,
      _this = this;
    day = window.app.mainView.currentDate;
    return Mood.getDay(day, function(err, mood) {
      if (err) {
        alert("An error occured while retrieving mood data");
      } else if (mood == null) {
        _this.$('#current-mood').html('Set your mood for current day');
      } else {
        _this.$('#current-mood').html(mood.get('status'));
      }
      _this.loadAnalytics();
      if (callback != null) {
        return callback();
      }
    });
  };

  TrackerItem.prototype.loadAnalytics = function() {
    var day, path,
      _this = this;
    day = window.app.mainView.currentDate;
    path = "moods/" + (day.format('YYYY-MM-DD'));
    this.$("#moods-charts").html('');
    this.$("#moods-y-axis").html('');
    this.$("#moods").spin('tiny');
    return request.get(path, function(err, data) {
      _this.$("#moods").spin();
      if (err) {
        return alert("An error occured while retrieving moods data");
      } else {
        _this.data = data;
        return _this.redraw();
      }
    });
  };

  TrackerItem.prototype.redraw = function() {
    var el, width, yEl;
    this.$("#moods-charts").html('');
    this.$("#moods-y-axis").html('');
    width = this.$("#moods").width() - 70;
    el = this.$("#moods-charts")[0];
    yEl = this.$("#moods-y-axis")[0];
    return graph.draw(el, yEl, width, 'steelblue', this.data);
  };

  return TrackerItem;

})(BaseView);

});

;require.register("views/raw_data_table", function(exports, require, module) {
var RawDataTable, TrackerAmountCollection, ViewCollection, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ViewCollection = require('lib/view_collection');

TrackerAmountCollection = require('collections/tracker_amounts');

module.exports = RawDataTable = (function(_super) {
  __extends(RawDataTable, _super);

  function RawDataTable() {
    _ref = RawDataTable.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  RawDataTable.prototype.id = 'raw-data-table';

  RawDataTable.prototype.itemView = require('views/tracker_amount_item');

  RawDataTable.prototype.template = require('views/templates/tracker_amount_list');

  RawDataTable.prototype.collection = new TrackerAmountCollection();

  RawDataTable.prototype.tagName = 'table';

  RawDataTable.prototype.className = 'table';

  RawDataTable.prototype.show = function() {
    return this.$el.show();
  };

  RawDataTable.prototype.load = function(tracker) {
    if (tracker != null) {
      this.tracker = tracker;
      this.collection.url = "trackers/" + (tracker.get('id')) + "/raw-data";
      return this.collection.fetch();
    }
  };

  return RawDataTable;

})(ViewCollection);

});

;require.register("views/templates/basic_tracker_list", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
}
return buf.join("");
};
});

;require.register("views/templates/basic_tracker_list_item", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="mod w33 left"><h2> <a');
buf.push(attrs({ 'href':("#basic-trackers/" + (model.slug) + "") }, {"href":true}));
buf.push('>' + escape((interp = model.name) == null ? '' : interp) + '</a></h2><p class="explaination">' + escape((interp = model.description) == null ? '' : interp) + '</p></div><div class="mod w66 left"><div class="graph-container"><div class="y-axis"></div><div class="chart"></div></div></div>');
}
return buf.join("");
};
});

;require.register("views/templates/home", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div id="menu"><div class="right"><h1><a href="#"> <img src="icons/main_icon_small.png"/></a></h1></div><div class="left"> <span class="header-button date-previous"><</span><input id="datepicker"/><span class="header-button date-next">></span></div></div><div id="content" class="pa2 trackers"><div class="line pl1"><textarea id="dailynote" placeholder="add a note for today"></textarea></div><div id="zoomtracker" class="line"><div class="line graph-section"><h2 class="zoomtitle">No tracker selected</h2><p class="zoomexplaination explaination"></p><p class="zoom-editable"><input class="zoomtitle"/></p><p class="zoom-editable"><textarea class="zoomexplaination explaination"></textarea></p><p><select id="zoomtimeunit"><option value="day">day</option><option value="week">week</option><option value="month">month</option></select><span>&nbsp;</span><select id="zoomstyle"><option value="line">lines</option><option value="bar">bars</option><option value="scatterplot">points</option><option value="lineplot">lines + points</option><option value="correlation">correlate (points)</option></select><span>&nbsp;</span><span>(average:&nbsp;</span><span id="average-value"></span><span>)</span></p><p><select id="zoomcomparison"></select><span class="smaller em">&nbsp;(Compared tracker is in red).</span></p></div><div id="zoomgraph" class="graph-container"><div id="zoom-y-axis" class="y-axis"></div><div id="zoom-charts" class="chart"></div><div id="timeline" class="rickshaw_annotation_timeline"></div></div><div class="line txt-center pt2"><a href="#">go back to tracker list</a></div><p><button id="remove-btn" class="smaller">remove tracker</button></p><p id="show-data-section"><button id="show-data-btn">show data</button>or <a id="show-data-csv" target="_blank"> download csv file</a></p><div id="raw-data"></div></div></div><div class="tools line"><div id="add-tracker-widget"><h2>Create your tracker</h2><div class="line"><input id="add-tracker-name" placeholder="name"/></div><div class="line"><textarea id="add-tracker-description" placeholder="description"></textarea></div><div class="line"><button id="add-tracker-btn">add tracker</button></div></div></div>');
}
return buf.join("");
};
});

;require.register("views/templates/mood", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="mod w33 left"><h2> <a href="#mood">Mood</a></h2><p class="explaination">The goal of this tracker is to help you\nunderstand what could influence your mood by comparing it\nto other trackers.</p><p id="current-mood">loading...</p><button id="good-mood-btn">good</button><button id="neutral-mood-btn">neutral</button><button id="bad-mood-btn">bad</button></div><div class="mod w66 left"><div id="moods" class="graph-container"><div id="moods-y-axis" class="y-axis"></div><div id="moods-charts" class="chart"></div></div></div>');
}
return buf.join("");
};
});

;require.register("views/templates/tracker_amount_item", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<tr><td class="amount-date">' + escape((interp = model.displayDate) == null ? '' : interp) + '</td><td class="amount-amount">' + escape((interp = model.amount) == null ? '' : interp) + '</td><td class="amount-delete"><button>x</button></td></tr>');
}
return buf.join("");
};
});

;require.register("views/templates/tracker_amount_list", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<table id="raw-data-table"></table>');
}
return buf.join("");
};
});

;require.register("views/templates/tracker_list", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
}
return buf.join("");
};
});

;require.register("views/templates/tracker_list_item", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="mod w33 left"><h2> <a');
buf.push(attrs({ 'href':("#trackers/" + (model.id) + "") }, {"href":true}));
buf.push('>' + escape((interp = model.name) == null ? '' : interp) + '</a></h2><p class="explaination">' + escape((interp = model.description) == null ? '' : interp) + '</p><div class="current-amount">Set value for today</div><button class="up-btn">+ </button><button class="down-btn">-</button><input value="1" class="tracker-increment"/></div><div class="mod w66 left"><div class="graph-container"><div class="y-axis"></div><div class="chart"></div></div></div>');
}
return buf.join("");
};
});

;require.register("views/tracker_amount_item", function(exports, require, module) {
var BaseView, TrackerAmountItem, request, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

request = require('../lib/request');

module.exports = TrackerAmountItem = (function(_super) {
  __extends(TrackerAmountItem, _super);

  function TrackerAmountItem() {
    this.afterRender = __bind(this.afterRender, this);
    _ref = TrackerAmountItem.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  TrackerAmountItem.prototype.className = 'tracker-amount';

  TrackerAmountItem.prototype.template = require('views/templates/tracker_amount_item');

  TrackerAmountItem.prototype.events = {
    'click .amount-delete button': 'onDeleteClicked'
  };

  TrackerAmountItem.prototype.afterRender = function(callback) {};

  TrackerAmountItem.prototype.onDeleteClicked = function() {
    this.$el.addClass('deleted');
    this.model.state = 'deleted';
    return request.del("trackers/" + (this.model.get('tracker')) + "/raw-data/" + (this.model.get('id')), function(err) {
      if (err) {
        return alert('An error occured while deleting selected amount');
      }
    });
  };

  return TrackerAmountItem;

})(BaseView);

});

;require.register("views/tracker_list", function(exports, require, module) {
var TrackerCollection, TrackerList, ViewCollection, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ViewCollection = require('lib/view_collection');

TrackerCollection = require('collections/trackers');

module.exports = TrackerList = (function(_super) {
  __extends(TrackerList, _super);

  function TrackerList() {
    _ref = TrackerList.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  TrackerList.prototype.id = 'tracker-list';

  TrackerList.prototype.itemView = require('views/tracker_list_item');

  TrackerList.prototype.template = require('views/templates/tracker_list');

  TrackerList.prototype.collection = new TrackerCollection();

  TrackerList.prototype.redrawAll = function() {
    var id, view, _ref1, _results;
    _ref1 = this.views;
    _results = [];
    for (id in _ref1) {
      view = _ref1[id];
      _results.push(view.redrawGraph());
    }
    return _results;
  };

  TrackerList.prototype.reloadAll = function(callback) {
    var id, length, nbLoaded, view, _ref1, _ref2, _results,
      _this = this;
    this.$(".tracker .chart").html('');
    this.$(".tracker .y-axis").html('');
    nbLoaded = 0;
    length = 0;
    _ref1 = this.views;
    for (id in _ref1) {
      view = _ref1[id];
      length++;
    }
    _ref2 = this.views;
    _results = [];
    for (id in _ref2) {
      view = _ref2[id];
      _results.push(view.afterRender(function() {
        nbLoaded++;
        if (nbLoaded === length) {
          if (callback != null) {
            return callback();
          }
        }
      }));
    }
    return _results;
  };

  return TrackerList;

})(ViewCollection);

});

;require.register("views/tracker_list_item", function(exports, require, module) {
var BaseView, TrackerItem, graph, request, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

request = require('lib/request');

graph = require('lib/graph');

module.exports = TrackerItem = (function(_super) {
  __extends(TrackerItem, _super);

  function TrackerItem() {
    this.afterRender = __bind(this.afterRender, this);
    _ref = TrackerItem.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  TrackerItem.prototype.className = 'tracker line';

  TrackerItem.prototype.template = require('views/templates/tracker_list_item');

  TrackerItem.prototype.events = {
    'click .up-btn': 'onUpClicked',
    'click .down-btn': 'onDownClicked',
    'keyup .tracker-increment': 'onCurrentAmountKeyup'
  };

  TrackerItem.prototype.afterRender = function(callback) {
    var day, getData,
      _this = this;
    day = window.app.mainView.currentDate;
    getData = function() {
      return _this.model.getDay(day, function(err, amount) {
        if (err) {
          alert("An error occured while retrieving tracker data");
        } else if (amount == null) {
          _this.$('.current-amount').html('Set value for current day');
        } else {
          _this.$('.current-amount').html(amount.get('amount'));
        }
        return _this.getAnalytics(callback);
      });
    };
    if (this.model.id != null) {
      return getData();
    } else {
      return setTimeout(getData, 1000);
    }
  };

  TrackerItem.prototype.onCurrentAmountKeyup = function(event) {
    var keyCode;
    keyCode = event.which || event.keyCode;
    if (keyCode === 13) {
      return this.onUpClicked();
    }
  };

  TrackerItem.prototype.onUpClicked = function(event) {
    var day,
      _this = this;
    day = window.app.mainView.currentDate;
    return this.model.getDay(day, function(err, amount) {
      var label;
      if (err) {
        alert('An error occured while retrieving data');
        return;
      } else if ((amount != null) && (amount.get('amount') != null)) {
        amount = amount.get('amount');
      } else {
        amount = 0;
      }
      try {
        amount += parseInt(_this.$('.tracker-increment').val());
      } catch (_error) {
        return false;
      }
      label = _this.$('.current-amount');
      label.css('color', 'transparent');
      label.spin('tiny', {
        color: '#444'
      });
      day = window.app.mainView.currentDate;
      return _this.model.updateDay(day, amount, function(err) {
        label.spin();
        label.css('color', '#444');
        if (err) {
          return alert('An error occured while saving data');
        } else {
          label.html(amount);
          _this.data[_this.data.length - 1]['y'] = amount;
          _this.$('.chart').html(null);
          _this.$('.y-axis').html(null);
          return _this.redrawGraph();
        }
      });
    });
  };

  TrackerItem.prototype.onDownClicked = function(event) {
    var day,
      _this = this;
    day = window.app.mainView.currentDate;
    return this.model.getDay(day, function(err, amount) {
      var label;
      if (err) {
        alert('An error occured while retrieving data');
      }
      if ((amount != null) && (amount.get('amount') != null)) {
        amount = amount.get('amount');
      } else {
        amount = 0;
      }
      try {
        amount -= parseInt(_this.$('.tracker-increment').val());
        if (amount < 0) {
          amount = 0;
        }
      } catch (_error) {
        return false;
      }
      label = _this.$('.current-amount');
      label.css('color', 'transparent');
      label.spin('tiny', {
        color: '#444'
      });
      day = window.app.mainView.currentDate;
      return _this.model.updateDay(day, amount, function(err) {
        label.spin();
        label.css('color', '#444');
        if (err) {
          return alert('An error occured while saving data');
        } else {
          label.html(amount);
          _this.data[_this.data.length - 1]['y'] = amount;
          _this.$('.chart').html(null);
          _this.$('.y-axis').html(null);
          return _this.redrawGraph();
        }
      });
    });
  };

  TrackerItem.prototype.getAnalytics = function(callback) {
    var day,
      _this = this;
    this.$(".graph-container").spin('tiny');
    day = window.app.mainView.currentDate.format("YYYY-MM-DD");
    return request.get("trackers/" + (this.model.get('id')) + "/amounts/" + day, function(err, data) {
      if (err) {
        return alert("An error occured while retrieving data");
      } else {
        _this.$(".graph-container").spin();
        _this.data = data;
        _this.drawCharts();
        if (callback != null) {
          return callback();
        }
      }
    });
  };

  TrackerItem.prototype.redrawGraph = function() {
    return this.drawCharts();
  };

  TrackerItem.prototype.drawCharts = function() {
    var color, el, width, yEl;
    width = this.$(".graph-container").width() - 70;
    el = this.$('.chart')[0];
    yEl = this.$('.y-axis')[0];
    color = 'black';
    return graph.draw(el, yEl, width, color, this.data);
  };

  return TrackerItem;

})(BaseView);

});

;
//# sourceMappingURL=app.js.map