(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var has = ({}).hasOwnProperty;

  var aliases = {};

  var endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  };

  var unalias = function(alias, loaderPath) {
    var start = 0;
    if (loaderPath) {
      if (loaderPath.indexOf('components/' === 0)) {
        start = 'components/'.length;
      }
      if (loaderPath.indexOf('/', start) > 0) {
        loaderPath = loaderPath.substring(start, loaderPath.indexOf('/', start));
      }
    }
    var result = aliases[alias + '/index.js'] || aliases[loaderPath + '/deps/' + alias + '/index.js'];
    if (result) {
      return 'components/' + result.substring(0, result.length - '.js'.length);
    }
    return alias;
  };

  var expand = (function() {
    var reg = /^\.\.?(\/|$)/;
    return function(root, name) {
      var results = [], parts, part;
      parts = (reg.test(name) ? root + '/' + name : name).split('/');
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
  })();
  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var absolute = expand(dirname(path), name);
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
    path = unalias(name, loaderPath);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has.call(cache, dirIndex)) return cache[dirIndex].exports;
    if (has.call(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  require.list = function() {
    var result = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  require.brunch = true;
  globals.require = require;
})();
require.register("application", function(exports, require, module) {
module.exports = {
  initialize: function() {
    var Router;
    Router = require('router');
    this.router = new Router();
    Backbone.history.start();
    if (typeof Object.freeze === 'function') {
      return Object.freeze(this);
    }
  }
};

});

require.register("collections/basic_trackers", function(exports, require, module) {
var TrackersCollection,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

module.exports = TrackersCollection = (function(superClass) {
  extend(TrackersCollection, superClass);

  function TrackersCollection() {
    return TrackersCollection.__super__.constructor.apply(this, arguments);
  }

  TrackersCollection.prototype.model = require('../models/basic_tracker');

  TrackersCollection.prototype.url = 'basic-trackers';

  return TrackersCollection;

})(Backbone.Collection);

});

require.register("collections/dailynotes", function(exports, require, module) {
var DailyNotes,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

module.exports = DailyNotes = (function(superClass) {
  extend(DailyNotes, superClass);

  function DailyNotes() {
    return DailyNotes.__super__.constructor.apply(this, arguments);
  }

  DailyNotes.prototype.model = require('../models/dailynote');

  DailyNotes.prototype.url = 'dailynotes/';

  return DailyNotes;

})(Backbone.Collection);

});

require.register("collections/moods", function(exports, require, module) {
var Moods,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

module.exports = Moods = (function(superClass) {
  extend(Moods, superClass);

  function Moods() {
    return Moods.__super__.constructor.apply(this, arguments);
  }

  Moods.prototype.model = require('../models/mood');

  Moods.prototype.url = 'moods/';

  return Moods;

})(Backbone.Collection);

});

require.register("collections/tracker_amounts", function(exports, require, module) {
var TrackersCollection,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

module.exports = TrackersCollection = (function(superClass) {
  extend(TrackersCollection, superClass);

  function TrackersCollection() {
    return TrackersCollection.__super__.constructor.apply(this, arguments);
  }

  TrackersCollection.prototype.model = require('../models/tracker_amount');

  return TrackersCollection;

})(Backbone.Collection);

});

require.register("collections/trackers", function(exports, require, module) {
var TrackersCollection,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

module.exports = TrackersCollection = (function(superClass) {
  extend(TrackersCollection, superClass);

  function TrackersCollection() {
    return TrackersCollection.__super__.constructor.apply(this, arguments);
  }

  TrackersCollection.prototype.model = require('../models/tracker');

  TrackersCollection.prototype.url = 'trackers';

  return TrackersCollection;

})(Backbone.Collection);

});

require.register("initialize", function(exports, require, module) {
var app;

app = require('application');

$(function() {
  require('lib/app_helpers');
  return app.initialize();
});

});

require.register("lib/app_helpers", function(exports, require, module) {
(function() {
  return (function() {
    var console, dummy, method, methods, results;
    console = window.console = window.console || {};
    method = void 0;
    dummy = function() {};
    methods = 'assert,count,debug,dir,dirxml,error,exception, group,groupCollapsed,groupEnd,info,log,markTimeline, profile,profileEnd,time,timeEnd,trace,warn'.split(',');
    results = [];
    while (method = methods.pop()) {
      results.push(console[method] = console[method] || dummy);
    }
    return results;
  })();
})();

});

require.register("lib/base_view", function(exports, require, module) {
var BaseView,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

module.exports = BaseView = (function(superClass) {
  extend(BaseView, superClass);

  function BaseView() {
    return BaseView.__super__.constructor.apply(this, arguments);
  }

  BaseView.prototype.template = function() {};

  BaseView.prototype.initialize = function() {};

  BaseView.prototype.getRenderData = function() {
    var ref;
    return {
      model: (ref = this.model) != null ? ref.toJSON() : void 0
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

  BaseView.prototype.show = function() {
    return this.$el.show();
  };

  BaseView.prototype.hide = function() {
    return this.$el.hide();
  };

  return BaseView;

})(Backbone.View);

});

require.register("lib/calculus", function(exports, require, module) {
var MainState;

MainState = require('../main_state');

module.exports = {
  average: function(data) {
    var amount, average, i, len;
    average = 0;
    if (data != null) {
      for (i = 0, len = data.length; i < len; i++) {
        amount = data[i];
        average += amount.y;
      }
      average = average / data.length;
      average = Math.round(average * 100) / 100;
    }
    return average;
  },
  addDayToDates: function(data, nbDays) {
    var date, entry, i, len;
    for (i = 0, len = data.length; i < len; i++) {
      entry = data[i];
      date = moment(entry.x * 1000);
      date.add('day', nbDays);
      entry.x = date.toDate().getTime() / 1000;
    }
    return data;
  },
  addYearToDates: function(data) {
    var date, entry, i, len;
    for (i = 0, len = data.length; i < len; i++) {
      entry = data[i];
      date = moment(entry.x * 1000);
      date.add('year', 1);
      entry.x = date.toDate().getTime() / 1000;
    }
    return data;
  },
  getDefaultData: function() {
    return [
      {
        x: MainState.startDate.toDate().getTime() / 1000,
        y: 0
      }, {
        x: MainState.endDate.toDate().getTime() / 1000,
        y: 0
      }
    ];
  }
};

});

require.register("lib/constants", function(exports, require, module) {
module.exports = {
  DATE_FORMAT: 'dddd, DD MMMM, YYYY',
  DATE_URL_FORMAT: 'YYYY-MM-DD'
};

});

require.register("lib/graph", function(exports, require, module) {
module.exports = {
  draw: function(opts) {
    var color, comparisonData, data, el, goal, goalData, graph, graphStyle, hoverDetail, i, len, point, series, time, width, x_axis, yEl, y_axis;
    el = opts.el, yEl = opts.yEl, width = opts.width, color = opts.color, data = opts.data, graphStyle = opts.graphStyle, comparisonData = opts.comparisonData, time = opts.time, goal = opts.goal;
    if (graphStyle == null) {
      graphStyle = "bar";
    }
    if (comparisonData != null) {
      series = [
        {
          color: color,
          data: data,
          renderer: graphStyle
        }, {
          color: 'red',
          data: comparisonData,
          renderer: graphStyle
        }
      ];
    } else {
      series = [
        {
          color: color,
          data: data,
          renderer: graphStyle
        }
      ];
    }
    if (goal != null) {
      goal = parseInt(goal);
      goalData = [];
      for (i = 0, len = data.length; i < len; i++) {
        point = data[i];
        goalData.push({
          x: point.x,
          y: goal
        });
      }
      series.push({
        color: 'rgba(200, 200, 220, 0.8)',
        renderer: 'line',
        data: goalData
      });
    }
    graph = new Rickshaw.Graph({
      element: el,
      width: width,
      height: 300,
      series: series,
      interpolation: 'linear',
      renderer: 'multi',
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
    var date, entry, epoch, graphData, graphDataArray, i, len, value;
    graphData = {};
    for (i = 0, len = data.length; i < len; i++) {
      entry = data[i];
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
    var date, entry, epoch, graphData, graphDataArray, i, len, value;
    graphData = {};
    for (i = 0, len = data.length; i < len; i++) {
      entry = data[i];
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
    var comparisonDataHash, dataHash, entry, factor, i, j, k, l, len, len1, len2, len3, len4, len5, m, maxComparisonData, maxData, n, name, name1, newComparisonData, newData, x;
    maxData = 0;
    for (i = 0, len = data.length; i < len; i++) {
      entry = data[i];
      if (entry.y > maxData) {
        maxData = entry.y;
      }
    }
    maxComparisonData = 0;
    for (j = 0, len1 = comparisonData.length; j < len1; j++) {
      entry = comparisonData[j];
      if (entry.y > maxComparisonData) {
        maxComparisonData = entry.y;
      }
    }
    if (maxComparisonData > 0) {
      factor = maxData / maxComparisonData;
    } else {
      factor = 1;
    }
    dataHash = {};
    comparisonDataHash = {};
    for (k = 0, len2 = data.length; k < len2; k++) {
      entry = data[k];
      dataHash[entry.x] = entry;
    }
    for (l = 0, len3 = comparisonData.length; l < len3; l++) {
      entry = comparisonData[l];
      comparisonDataHash[entry.x] = entry;
    }
    for (m = 0, len4 = data.length; m < len4; m++) {
      entry = data[m];
      if (comparisonDataHash[name = entry.x] == null) {
        comparisonDataHash[name] = {
          x: entry.x,
          y: 0
        };
      }
    }
    for (n = 0, len5 = comparisonData.length; n < len5; n++) {
      entry = comparisonData[n];
      if (dataHash[name1 = entry.x] == null) {
        dataHash[name1] = {
          x: entry.x,
          y: 0
        };
      }
    }
    newData = [];
    newComparisonData = [];
    for (x in dataHash) {
      entry = dataHash[x];
      if (entry != null) {
        newData.push(entry);
      }
    }
    for (x in comparisonDataHash) {
      entry = comparisonDataHash[x];
      newComparisonData.push({
        x: entry.x,
        y: entry.y * factor
      });
    }
    return {
      data: newData,
      comparisonData: newComparisonData
    };
  },
  mixData: function(data, comparisonData) {
    var dataHash, entry, i, j, len, len1, newData;
    dataHash = {};
    for (i = 0, len = data.length; i < len; i++) {
      entry = data[i];
      dataHash[entry.x] = entry.y;
    }
    newData = [];
    for (j = 0, len1 = comparisonData.length; j < len1; j++) {
      entry = comparisonData[j];
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

require.register("lib/model", function(exports, require, module) {
var Model,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

module.exports = Model = (function(superClass) {
  extend(Model, superClass);

  function Model() {
    return Model.__super__.constructor.apply(this, arguments);
  }

  Model.prototype.idAttribute = '_id';

  Model.prototype.bindField = function(attribute, field) {
    if (field == null) {
      return console.log("try to bind a non existing field with " + attribute);
    } else {
      field.keyup((function(_this) {
        return function() {
          _this.set(attribute, field.val(), {
            silent: true
          });
          return true;
        };
      })(this));
      return this.on("change:" + attribute, (function(_this) {
        return function() {
          return field.val(_this.get("attribute"));
        };
      })(this));
    }
  };

  return Model;

})(Backbone.Model);

});

require.register("lib/normalizer", function(exports, require, module) {
module.exports = {
  getSixMonths: function(data, endDate) {
    var beginDate, currentDate, i, len, point, result;
    if (endDate == null) {
      endDate = window.app.mainView.currentDate;
    }
    result = [];
    endDate = moment(endDate);
    endDate.add(1, 'days');
    beginDate = moment(endDate);
    beginDate = beginDate.subtract(6, 'months');
    for (i = 0, len = data.length; i < len; i++) {
      point = data[i];
      currentDate = moment(point.x * 1000);
      if ((currentDate != null) && (currentDate >= beginDate) && (currentDate <= endDate)) {
        result.push(point);
      }
    }
    return result;
  }
};

});

require.register("lib/request", function(exports, require, module) {
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

require.register("lib/view_collection", function(exports, require, module) {
var BaseView, ViewCollection,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BaseView = require('lib/base_view');

module.exports = ViewCollection = (function(superClass) {
  extend(ViewCollection, superClass);

  function ViewCollection() {
    this.removeItem = bind(this.removeItem, this);
    this.addItem = bind(this.addItem, this);
    return ViewCollection.__super__.constructor.apply(this, arguments);
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
    var id, ref, view;
    ref = this.views;
    for (id in ref) {
      view = ref[id];
      view.$el.detach();
    }
    return ViewCollection.__super__.render.apply(this, arguments);
  };

  ViewCollection.prototype.afterRender = function() {
    var id, ref, view;
    console.log(this.colllectionEl);
    if (this.colllectionEl != null) {
      this.$collectionEl = $(this.collectionEl);
    } else {
      this.$collectionEl = this.$el;
    }
    ref = this.views;
    for (id in ref) {
      view = ref[id];
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
    var id, ref, view;
    ref = this.views;
    for (id in ref) {
      view = ref[id];
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
    model.view = view;
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

require.register("main_state", function(exports, require, module) {
var DATE_FORMAT, DATE_URL_FORMAT, mainState, now, ref;

ref = require('../lib/constants'), DATE_FORMAT = ref.DATE_FORMAT, DATE_URL_FORMAT = ref.DATE_URL_FORMAT;

now = moment();

module.exports = mainState = {
  startDate: now,
  endDate: now,
  currentView: 'main',
  data: {},
  getData: function(slug) {
    var data;
    data = mainState.data[slug];
    if (data == null) {
      data = {};
      data[mainState.startDate.format(DATE_URL_FORMAT)] = 0;
      data[mainState.endDate.format(DATE_URL_FORMAT)] = 0;
    }
    return data;
  }
};

});

require.register("models/basic_tracker", function(exports, require, module) {
var DATE_FORMAT, DATE_URL_FORMAT, TrackerModel, ref, request,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

request = require('lib/request');

ref = require('../lib/constants'), DATE_FORMAT = ref.DATE_FORMAT, DATE_URL_FORMAT = ref.DATE_URL_FORMAT;

module.exports = TrackerModel = (function(superClass) {
  extend(TrackerModel, superClass);

  function TrackerModel() {
    return TrackerModel.__super__.constructor.apply(this, arguments);
  }

  TrackerModel.prototype.rootUrl = "basic-trackers";

  TrackerModel.prototype.getPath = function(startDate, endDate) {
    var format;
    format = DATE_URL_FORMAT;
    return (this.get('path')) + "/" + (startDate.format(format)) + "/" + (endDate.format(format));
  };

  TrackerModel.prototype.setMetadata = function(field, value) {
    var metadata;
    metadata = this.get('metadata');
    metadata[field] = value;
    return this.set('metadata', metadata);
  };

  return TrackerModel;

})(Backbone.Model);

});

require.register("models/dailynote", function(exports, require, module) {
var DailyNote, Model, request,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Model = require('lib/model');

request = require('lib/request');

module.exports = DailyNote = (function(superClass) {
  extend(DailyNote, superClass);

  function DailyNote() {
    return DailyNote.__super__.constructor.apply(this, arguments);
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

require.register("models/mood", function(exports, require, module) {
var Model, Mood, request,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Model = require('lib/model');

request = require('lib/request');

module.exports = Mood = (function(superClass) {
  extend(Mood, superClass);

  function Mood() {
    return Mood.__super__.constructor.apply(this, arguments);
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

require.register("models/mood_tracker", function(exports, require, module) {
var DATE_FORMAT, DATE_URL_FORMAT, Model, Mood, ref, request,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Model = require('lib/model');

request = require('lib/request');

ref = require('../lib/constants'), DATE_FORMAT = ref.DATE_FORMAT, DATE_URL_FORMAT = ref.DATE_URL_FORMAT;

module.exports = Mood = (function(superClass) {
  extend(Mood, superClass);

  function Mood() {
    return Mood.__super__.constructor.apply(this, arguments);
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

  Mood.prototype.getPath = function(startDate, endDate) {
    var format, path;
    format = DATE_URL_FORMAT;
    path = 'moods';
    return path + "/" + (startDate.format(format)) + "/" + (endDate.format(format));
  };

  Mood.prototype.setMetadata = function(field, value) {
    var metadata;
    metadata = this.get('metadata');
    metadata[field] = value;
    return this.set('metadata', metadata);
  };

  Mood.prototype.loadMetadata = function(callback) {
    return request.get('metadata/basic-trackers/mood', (function(_this) {
      return function(err, metadata) {
        if (err) {
          alert('Cannot load metadata for mood');
        } else {
          _this.set('metadata', metadata);
        }
        return callback(metadata);
      };
    })(this));
  };

  return Mood;

})(Model);

});

require.register("models/tracker", function(exports, require, module) {
var DATE_FORMAT, DATE_URL_FORMAT, TrackerModel, ref, request,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

request = require('lib/request');

ref = require('../lib/constants'), DATE_FORMAT = ref.DATE_FORMAT, DATE_URL_FORMAT = ref.DATE_URL_FORMAT;

module.exports = TrackerModel = (function(superClass) {
  extend(TrackerModel, superClass);

  TrackerModel.prototype.rootUrl = "trackers";

  function TrackerModel() {
    TrackerModel.__super__.constructor.apply(this, arguments);
    if (this.get('metadata') == null) {
      this.set('metadata', {});
    }
  }

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

  TrackerModel.prototype.getPath = function(startDate, endDate) {
    var format, id;
    format = DATE_URL_FORMAT;
    id = this.get('id');
    return "trackers/" + id + "/amounts/" + (startDate.format(format)) + "/" + (endDate.format(format));
  };

  TrackerModel.prototype.setMetadata = function(field, value) {
    var metadata;
    metadata = this.get('metadata');
    metadata[field] = value;
    return this.set('metadata', metadata);
  };

  return TrackerModel;

})(Backbone.Model);

});

require.register("models/tracker_amount", function(exports, require, module) {
var TrackerModel, request,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

request = require('lib/request');

module.exports = TrackerModel = (function(superClass) {
  extend(TrackerModel, superClass);

  function TrackerModel(data) {
    var date;
    TrackerModel.__super__.constructor.apply(this, arguments);
    date = this.get('date');
    this.set('displayDate', moment(date).format('YYYY MM DD'));
  }

  return TrackerModel;

})(Backbone.Model);

});

require.register("models/zoom", function(exports, require, module) {
var TrackerModel,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

module.exports = TrackerModel = (function(superClass) {
  extend(TrackerModel, superClass);

  function TrackerModel() {
    return TrackerModel.__super__.constructor.apply(this, arguments);
  }

  return TrackerModel;

})(Backbone.Model);

});

require.register("router", function(exports, require, module) {
var AppView, MainState, Router,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

AppView = require('views/app_view');

MainState = require('./main_state');

module.exports = Router = (function(superClass) {
  extend(Router, superClass);

  function Router() {
    return Router.__super__.constructor.apply(this, arguments);
  }

  Router.prototype.routes = {
    '': 'main',
    'main/:startDate/:endDate': 'mainDate',
    'mood/:startDate/:endDate': 'moodDate',
    'basic-trackers/:name': 'basicTracker',
    'basic-trackers/:name/:startDate/:endDate': 'basicTrackerDate',
    'trackers/:name': 'tracker',
    'trackers/:name/:startDate/:endDate': 'trackerDate',
    'mood': 'mood',
    'add-tracker': 'addTracker',
    '*path': 'main'
  };

  Router.prototype.createMainView = function(startDate, endDate) {
    var mainView, ref;
    if (((ref = window.app) != null ? ref.mainView : void 0) == null) {
      mainView = new AppView({
        startDate: startDate,
        endDate: endDate
      });
      mainView.render();
      window.app = {};
      window.app.router = this;
      return window.app.mainView = mainView;
    }
  };

  Router.prototype.main = function() {
    this.createMainView();
    return window.app.mainView.displayTrackers();
  };

  Router.prototype.mainDate = function(startDate, endDate) {
    this.createMainView(startDate, endDate);
    return window.app.mainView.displayTrackers();
  };

  Router.prototype.basicTracker = function(name) {
    this.createMainView();
    return window.app.mainView.displayBasicTracker(name);
  };

  Router.prototype.basicTrackerDate = function(name, startDate, endDate) {
    this.createMainView(startDate, endDate);
    return window.app.mainView.displayBasicTracker(name);
  };

  Router.prototype.navigateZoom = function() {
    return this.navigateTo({
      isMain: false,
      trigger: true
    });
  };

  Router.prototype.navigateHome = function() {
    return this.navigateTo({
      isMain: true,
      trigger: true
    });
  };

  Router.prototype.resetHash = function() {
    return this.navigateTo({
      isMain: false,
      trigger: false
    });
  };

  Router.prototype.navigateTo = function(options) {
    var end, isMain, start, trigger, view;
    isMain = options.isMain, trigger = options.trigger;
    if (isMain) {
      view = 'main';
    } else {
      view = MainState.currentView;
    }
    start = MainState.startDate.format('YYYY-MM-DD');
    end = MainState.endDate.format('YYYY-MM-DD');
    return window.app.router.navigate("#" + view + "/" + start + "/" + end, {
      trigger: trigger
    });
  };

  Router.prototype.mood = function(name) {
    var end, start, view;
    this.createMainView();
    view = 'mood';
    start = MainState.startDate.format('YYYY-MM-DD');
    end = MainState.endDate.format('YYYY-MM-DD');
    return window.app.router.navigate("#" + view + "/" + start + "/" + end, {
      trigger: true
    });
  };

  Router.prototype.moodDate = function(name) {
    this.createMainView();
    return window.app.mainView.displayMood();
  };

  Router.prototype.tracker = function(name) {
    var end, start, view;
    this.createMainView();
    view = 'mood';
    start = MainState.startDate.format('YYYY-MM-DD');
    end = MainState.endDate.format('YYYY-MM-DD');
    return window.app.router.navigate("#trackers/" + name + "/" + start + "/" + end, {
      trigger: true
    });
  };

  Router.prototype.trackerDate = function(name) {
    this.createMainView();
    return window.app.mainView.displayTracker(name);
  };

  Router.prototype.addTracker = function(name) {
    this.createMainView();
    return window.app.mainView.displayAddTracker();
  };

  return Router;

})(Backbone.Router);

});

require.register("views/add_basic_tracker_list", function(exports, require, module) {
var AddBasicTrackerList, BasicTrackerCollection, ViewCollection,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ViewCollection = require('lib/view_collection');

BasicTrackerCollection = require('collections/basic_trackers');

module.exports = AddBasicTrackerList = (function(superClass) {
  extend(AddBasicTrackerList, superClass);

  AddBasicTrackerList.prototype.el = '#add-basic-tracker-list';

  AddBasicTrackerList.prototype.collectionEl = '#add-basic-tracker-list';

  AddBasicTrackerList.prototype.itemView = require('views/add_basic_tracker_list_item');

  AddBasicTrackerList.prototype.template = require('views/templates/add_basic_tracker_list');

  function AddBasicTrackerList(collection) {
    this.collection = collection;
    AddBasicTrackerList.__super__.constructor.apply(this, arguments);
    this.$collectionEl = $(this.collectionEl);
  }

  AddBasicTrackerList.prototype.afterRender = function() {
    return AddBasicTrackerList.__super__.afterRender.apply(this, arguments);
  };

  AddBasicTrackerList.prototype.appendView = function(view) {
    return this.$collectionEl.append(view.el);
  };

  return AddBasicTrackerList;

})(ViewCollection);

});

require.register("views/add_basic_tracker_list_item", function(exports, require, module) {
var AddBasicTrackerItem, BaseView,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BaseView = require('lib/base_view');

module.exports = AddBasicTrackerItem = (function(superClass) {
  extend(AddBasicTrackerItem, superClass);

  function AddBasicTrackerItem() {
    this.clicked = bind(this.clicked, this);
    this.afterRender = bind(this.afterRender, this);
    return AddBasicTrackerItem.__super__.constructor.apply(this, arguments);
  }

  AddBasicTrackerItem.prototype.tagName = 'button';

  AddBasicTrackerItem.prototype.className = 'btn';

  AddBasicTrackerItem.prototype.template = require('views/templates/add_basic_tracker_list_item');

  AddBasicTrackerItem.prototype.events = {
    'click': 'clicked'
  };

  AddBasicTrackerItem.prototype.afterRender = function(callback) {
    this.selected = !this.model.get('metadata').hidden;
    if (this.selected) {
      return this.$el.addClass('selected');
    }
  };

  AddBasicTrackerItem.prototype.clicked = function() {
    if (this.selected) {
      this.selected = false;
      this.$el.removeClass('selected');
      return Backbone.Mediator.pub('basic-tracker:removed', this.model.get('slug'));
    } else {
      this.selected = true;
      this.$el.addClass('selected');
      return Backbone.Mediator.pub('basic-tracker:add', this.model.get('slug'));
    }
  };

  return AddBasicTrackerItem;

})(BaseView);

});

require.register("views/add_tracker", function(exports, require, module) {
var AddBasicTrackerList, AddTrackerList, AddTrackerView, BaseView, MainState, Tracker, calculus, graphHelper, request,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BaseView = require('lib/base_view');

AddBasicTrackerList = require('./add_basic_tracker_list');

AddTrackerList = require('./add_tracker_list');

request = require('lib/request');

graphHelper = require('../lib/graph');

calculus = require('lib/calculus');

Tracker = require('../models/tracker');

MainState = require('../main_state');

module.exports = AddTrackerView = (function(superClass) {
  extend(AddTrackerView, superClass);

  AddTrackerView.prototype.className = '';

  AddTrackerView.prototype.el = '#add-tracker-zone';

  AddTrackerView.prototype.template = require('views/templates/add_tracker');

  AddTrackerView.prototype.events = {
    'click #add-tracker-btn': 'onTrackerButtonClicked'
  };

  function AddTrackerView(model1, basicTrackers, moodTracker, trackers) {
    this.model = model1;
    this.basicTrackers = basicTrackers;
    this.moodTracker = moodTracker;
    this.trackers = trackers;
    AddTrackerView.__super__.constructor.apply(this, arguments);
  }

  AddTrackerView.prototype.afterRender = function() {
    this.addBasicTrackerList = new AddBasicTrackerList(this.basicTrackers);
    return this.addTrackerList = new AddTrackerList(this.trackers);
  };

  AddTrackerView.prototype.onTrackerButtonClicked = function() {
    var data, description, name;
    name = this.$('#add-tracker-name').val();
    description = this.$('#add-tracker-description').val();
    if (name.length > 0) {
      data = {
        name: name,
        description: description
      };
      return this.trackers.create(data, {
        success: (function(_this) {
          return function(model) {};
        })(this),
        error: function() {
          return alert('A server error occured while saving your tracker');
        }
      });
    }
  };

  return AddTrackerView;

})(BaseView);

});

require.register("views/add_tracker_list", function(exports, require, module) {
var AddTrackerList, TrackerCollection, ViewCollection,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ViewCollection = require('lib/view_collection');

TrackerCollection = require('collections/trackers');

module.exports = AddTrackerList = (function(superClass) {
  extend(AddTrackerList, superClass);

  AddTrackerList.prototype.el = '#add-tracker-list';

  AddTrackerList.prototype.collectionEl = '#add-tracker-list';

  AddTrackerList.prototype.itemView = require('views/add_tracker_list_item');

  AddTrackerList.prototype.template = require('views/templates/add_tracker_list');

  function AddTrackerList(collection) {
    this.collection = collection;
    AddTrackerList.__super__.constructor.apply(this, arguments);
    this.$collectionEl = $(this.collectionEl);
  }

  AddTrackerList.prototype.afterRender = function() {
    return AddTrackerList.__super__.afterRender.apply(this, arguments);
  };

  AddTrackerList.prototype.getView = function(id) {
    var tracker, view;
    tracker = this.collection.findWhere({
      id: id
    });
    view = this.views[tracker.cid];
    return view;
  };

  return AddTrackerList;

})(ViewCollection);

});

require.register("views/add_tracker_list_item", function(exports, require, module) {
var AddTrackerItem, BaseView,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BaseView = require('lib/base_view');

module.exports = AddTrackerItem = (function(superClass) {
  extend(AddTrackerItem, superClass);

  function AddTrackerItem() {
    this.clicked = bind(this.clicked, this);
    this.afterRender = bind(this.afterRender, this);
    return AddTrackerItem.__super__.constructor.apply(this, arguments);
  }

  AddTrackerItem.prototype.tagName = 'button';

  AddTrackerItem.prototype.className = 'btn';

  AddTrackerItem.prototype.template = require('views/templates/add_tracker_list_item');

  AddTrackerItem.prototype.events = {
    'click': 'clicked'
  };

  AddTrackerItem.prototype.afterRender = function(callback) {
    this.selected = !this.model.get('metadata').hidden;
    if (this.selected) {
      return this.$el.addClass('selected');
    }
  };

  AddTrackerItem.prototype.clicked = function() {
    if (this.selected) {
      this.selected = false;
      this.$el.removeClass('selected');
      return Backbone.Mediator.pub('tracker:removed', this.model.get('id'));
    } else {
      this.selected = true;
      this.$el.addClass('selected');
      return Backbone.Mediator.pub('tracker:add', this.model.get('id'));
    }
  };

  return AddTrackerItem;

})(BaseView);

});

require.register("views/app_view", function(exports, require, module) {
var AddBasicTrackerList, AddTrackerView, AppView, BaseView, BasicTrackerList, DATE_FORMAT, DATE_URL_FORMAT, DailyNote, DailyNotes, MainState, MoodTracker, MoodTrackerModel, RawDataTable, Tracker, TrackerList, Zoom, ZoomView, graphHelper, ref,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

graphHelper = require('../lib/graph');

BaseView = require('../lib/base_view');

Tracker = require('../models/tracker');

MoodTrackerModel = require('../models/mood_tracker');

Zoom = require('../models/zoom');

DailyNote = require('../models/dailynote');

DailyNotes = require('../collections/dailynotes');

ZoomView = require('./zoom');

MoodTracker = require('./mood_tracker');

TrackerList = require('./tracker_list');

BasicTrackerList = require('./basic_tracker_list');

AddTrackerView = require('./add_tracker');

AddBasicTrackerList = require('./add_basic_tracker_list');

RawDataTable = require('./raw_data_table');

MainState = require('../main_state');

ref = require('../lib/constants'), DATE_FORMAT = ref.DATE_FORMAT, DATE_URL_FORMAT = ref.DATE_URL_FORMAT;

module.exports = AppView = (function(superClass) {
  extend(AppView, superClass);

  AppView.prototype.el = 'body.application';

  AppView.prototype.template = require('./templates/home');

  AppView.prototype.events = {
    'change #datepicker': 'onDatePickerChanged',
    'blur #dailynote': 'onDailyNoteChanged',
    'click .date-previous': 'onPreviousClicked',
    'click .date-next': 'onNextClicked',
    'click .reload': 'onReloadClicked',
    'click #show-data-btn': 'onShowDataClicked'
  };

  AppView.prototype.subscriptions = {
    'start-date:change': 'onStartDateChanged',
    'end-date:change': 'onEndDateChanged',
    'basic-tracker:add': 'onTrackerAdded',
    'tracker:add': 'onTrackerAdded'
  };

  function AppView(options) {
    this.onShowDataClicked = bind(this.onShowDataClicked, this);
    this.redrawCharts = bind(this.redrawCharts, this);
    this.getRenderData = bind(this.getRenderData, this);
    var endDate, startDate;
    AppView.__super__.constructor.apply(this, arguments);
    if (MainState == null) {
      MainState = {};
    }
    startDate = options.startDate, endDate = options.endDate;
    this.initDates(startDate, endDate);
  }

  AppView.prototype.initDates = function(startDate, endDate) {
    if (startDate) {
      MainState.startDate = moment(startDate, DATE_URL_FORMAT);
    } else {
      MainState.startDate = moment();
      MainState.startDate = MainState.startDate.subtract('month', 6);
    }
    if (endDate) {
      MainState.endDate = moment(endDate, DATE_URL_FORMAT);
    } else {
      MainState.endDate = moment();
    }
    return this.currentDate = MainState.endDate;
  };

  AppView.prototype.getRenderData = function() {
    return {
      startDate: MainState.startDate.format(DATE_FORMAT),
      endDate: MainState.endDate.format(DATE_FORMAT)
    };
  };

  AppView.prototype.afterRender = function() {
    var moodTracker, zoom;
    this.colors = {};
    this.data = {};
    MainState.dataLoaded = false;
    $(window).on('resize', this.redrawCharts);
    this.initDatePickers();
    this.addTrackerButton = this.$('#add-tracker-button');
    this.welcomeMessage = this.$('.welcome-message');
    this.welcomeMessage.hide();
    moodTracker = new MoodTrackerModel({
      slug: 'mood',
      name: 'Mood',
      color: '#039BE5',
      metadata: {},
      description: " The goal of this tracker is to help you\nunderstand what could influence your mood by comparing it to\nother trackers."
    });
    this.moodTracker = new MoodTracker(moodTracker);
    this.$('#mood-section').append(this.moodTracker.$el);
    this.moodTracker.render();
    this.trackerList = new TrackerList();
    this.trackerList.render();
    this.$('#content').append(this.trackerList.$el);
    this.basicTrackerList = new BasicTrackerList();
    this.$('#content').append(this.basicTrackerList.$el);
    this.basicTrackerList.render();
    zoom = new Zoom;
    this.zoomView = new ZoomView(zoom, this.basicTrackerList.collection, this.moodTracker.model, this.trackerList.collection);
    this.zoomView.render();
    this.zoomView.hide();
    this.addTrackerView = new AddTrackerView(zoom, this.basicTrackerList.collection, this.moodTracker.model, this.trackerList.collection);
    this.addTrackerView.render();
    return this.addTrackerView.hide();
  };

  AppView.prototype.initDatePickers = function() {
    var now;
    now = new Date();
    $('#datepicker-start').pikaday({
      maxDate: now,
      format: DATE_FORMAT,
      defaultDate: MainState.startDate.toDate(),
      setDefaultDate: true,
      onSelect: function(value) {
        return Backbone.Mediator.publish('start-date:change', value);
      }
    });
    return $('#datepicker-end').pikaday({
      maxDate: now,
      defaultDate: MainState.endDate.toDate(),
      format: DATE_FORMAT,
      onSelect: function(value) {
        return Backbone.Mediator.publish('end-date:change', value);
      }
    });
  };

  AppView.prototype.onStartDateChanged = function(date) {
    MainState.startDate = moment(date);
    this.loadTrackers((function(_this) {
      return function() {
        return _this.zoomView.reload();
      };
    })(this));
    return this.resetRouteHash();
  };

  AppView.prototype.onEndDateChanged = function(date) {
    MainState.endDate = moment(date);
    this.loadTrackers((function(_this) {
      return function() {
        return _this.zoomView.reload();
      };
    })(this));
    return this.resetRouteHash();
  };

  AppView.prototype.resetRouteHash = function() {
    return window.app.router.resetHash();
  };

  AppView.prototype.loadTrackers = function(callback) {
    MainState.dataLoaded = false;
    return this.moodTracker.load((function(_this) {
      return function() {
        return _this.trackerList.load(function() {
          return _this.basicTrackerList.load(function() {
            MainState.dataLoaded = true;
            if (_this.trackerList.isEmpty() && _this.basicTrackerList.isEmpty()) {
              _this.welcomeMessage.show();
            }
            return typeof callback === "function" ? callback() : void 0;
          });
        });
      };
    })(this));
  };

  AppView.prototype.reloadAll = function() {
    return this.moodTracker.reload((function(_this) {
      return function() {
        return _this.basicTrackerList.reloadAll(function() {
          return _this.trackerList.reloadAll(function() {});
        });
      };
    })(this));
  };

  AppView.prototype.hideMain = function() {
    this.basicTrackerList.hide();
    this.trackerList.hide();
    this.moodTracker.hide();
    this.welcomeMessage.hide();
    this.addTrackerView.hide();
    return this.addTrackerButton.hide();
  };

  AppView.prototype.showMain = function() {
    this.basicTrackerList.show();
    this.trackerList.show();
    this.moodTracker.show();
    this.welcomeMessage.hide();
    this.addTrackerView.hide();
    return this.addTrackerButton.show();
  };

  AppView.prototype.displayAddTracker = function() {
    this.hideMain();
    this.zoomView.hide();
    return this.addTrackerView.show();
  };

  AppView.prototype.displayTrackers = function() {
    MainState.currentView = 'main';
    this.showMain();
    this.redrawCharts();
    this.zoomView.hide();
    if (!MainState.dataLoaded) {
      this.loadTrackers();
    }
    return $(document).scrollTop(0);
  };

  AppView.prototype.displayMood = function() {
    MainState.currentView = "mood";
    this.hideMain();
    return this.displayZoomTracker('mood', (function(_this) {
      return function() {};
    })(this));
  };

  AppView.prototype.displayTracker = function(id) {
    MainState.currentView = "id";
    this.hideMain();
    return this.displayZoomTracker(id);
  };

  AppView.prototype.displayBasicTracker = function(slug) {
    MainState.currentView = "basic-trackers/" + slug;
    this.hideMain();
    return this.displayZoomTracker(slug, (function(_this) {
      return function() {};
    })(this));
  };

  AppView.prototype.displayZoomTracker = function(slug, callback) {
    if (MainState.dataLoaded) {
      this.zoomView.show(slug);
      $(document).scrollTop(0);
      return typeof callback === "function" ? callback() : void 0;
    } else {
      return this.loadTrackers((function(_this) {
        return function() {
          _this.zoomView.show(slug);
          $(document).scrollTop(0);
          return typeof callback === "function" ? callback() : void 0;
        };
      })(this));
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

  AppView.prototype.onTrackerAdded = function() {
    return this.welcomeMessage.hide();
  };

  AppView.prototype.onDailyNoteChanged = function(event) {
    var text;
    text = this.$("#dailynote").val();
    return DailyNote.updateDay(this.currentDate, text, (function(_this) {
      return function(err, mood) {
        if (err) {
          return alert("An error occured while saving note of the day");
        }
      };
    })(this));
  };

  AppView.prototype.loadNote = function() {
    DailyNote.getDay(this.currentDate, (function(_this) {
      return function(err, dailynote) {
        if (err) {
          return alert("An error occured while retrieving daily note data");
        } else if (dailynote == null) {
          return _this.$('#dailynote').val(null);
        } else {
          return _this.$('#dailynote').val(dailynote.get('text'));
        }
      };
    })(this));
    this.notes = new DailyNotes;
    return this.notes.fetch();
  };

  AppView.prototype.onShowDataClicked = function() {
    this.rawDataTable.show();
    return this.rawDataTable.load(this.currentTracker);
  };

  return AppView;

})(BaseView);

});

require.register("views/basic_tracker_list", function(exports, require, module) {
var BasicTrackerCollection, BasicTrackerList, ViewCollection, request,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

request = require('lib/request');

ViewCollection = require('lib/view_collection');

BasicTrackerCollection = require('collections/basic_trackers');

module.exports = BasicTrackerList = (function(superClass) {
  extend(BasicTrackerList, superClass);

  BasicTrackerList.prototype.id = 'basic-tracker-list';

  BasicTrackerList.prototype.itemView = require('views/basic_tracker_list_item');

  BasicTrackerList.prototype.template = require('views/templates/basic_tracker_list');

  BasicTrackerList.prototype.collection = new BasicTrackerCollection();

  BasicTrackerList.prototype.subscriptions = {
    'basic-tracker:add': 'onAddBasicTracker',
    'basic-tracker:removed': 'onBasicTrackerRemoved'
  };

  function BasicTrackerList() {
    BasicTrackerList.__super__.constructor.apply(this, arguments);
  }

  BasicTrackerList.prototype.afterRender = function() {
    return BasicTrackerList.__super__.afterRender.apply(this, arguments);
  };

  BasicTrackerList.prototype.load = function(callback) {
    return this.collection.fetch({
      success: (function(_this) {
        return function() {
          return _this.reloadAll(function() {
            console.log('load done');
            return typeof callback === "function" ? callback() : void 0;
          });
        };
      })(this),
      error: (function(_this) {
        return function() {
          alert('Cannot load basic trackers');
          return typeof callback === "function" ? callback() : void 0;
        };
      })(this)
    });
  };

  BasicTrackerList.prototype.redrawAll = function() {
    var id, ref, results, view;
    ref = this.views;
    results = [];
    for (id in ref) {
      view = ref[id];
      results.push(view.drawCharts());
    }
    return results;
  };

  BasicTrackerList.prototype.reloadAll = function(callback) {
    var id, ref, trackers, view;
    this.$(".tracker .chart").html('');
    this.$(".tracker .y-axis").html('');
    trackers = [];
    ref = this.views;
    for (id in ref) {
      view = ref[id];
      trackers.push(view);
    }
    return async.eachSeries(trackers, function(tracker, next) {
      if (!tracker.model.get('metadata').hidden) {
        return tracker.load(next);
      } else {
        return next();
      }
    }, function(err) {
      console.log('reloadAll done');
      if (callback != null) {
        return callback();
      }
    });
  };

  BasicTrackerList.prototype.appendView = function(view) {
    this.$collectionEl.append(view.el);
    if (view.model.get('metadata').hidden) {
      return view.$el.addClass('hidden');
    }
  };

  BasicTrackerList.prototype.onAddBasicTracker = function(slug) {
    var data, view;
    view = this.getView(slug);
    view.$el.removeClass('hidden');
    view.load();
    data = {
      hidden: false
    };
    return request.put("metadata/basic-trackers/" + slug, data, function(err) {});
  };

  BasicTrackerList.prototype.onBasicTrackerRemoved = function(slug) {
    var data;
    this.remove(slug);
    data = {
      hidden: true
    };
    return request.put("metadata/basic-trackers/" + slug, data, function(err) {});
  };

  BasicTrackerList.prototype.remove = function(slug) {
    var view;
    view = this.getView(slug);
    return view.remove();
  };

  BasicTrackerList.prototype.getView = function(slug) {
    var tracker, view;
    tracker = this.collection.findWhere({
      slug: slug
    });
    view = this.views[tracker.cid];
    return view;
  };

  BasicTrackerList.prototype.isEmpty = function() {
    var i, isEmpty, isHidden, len, ref, tracker;
    isEmpty = true;
    ref = this.collection.models;
    for (i = 0, len = ref.length; i < len; i++) {
      tracker = ref[i];
      isHidden = tracker.get('metadata').hidden;
      if (isHidden === false) {
        isEmpty = false;
      }
    }
    return isEmpty;
  };

  return BasicTrackerList;

})(ViewCollection);

});

require.register("views/basic_tracker_list_item", function(exports, require, module) {
var BaseView, BasicTrackerItem, MainState, calculus, graph, request,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BaseView = require('lib/base_view');

request = require('lib/request');

graph = require('lib/graph');

calculus = require('lib/calculus');

MainState = require('../main_state');

module.exports = BasicTrackerItem = (function(superClass) {
  extend(BasicTrackerItem, superClass);

  function BasicTrackerItem() {
    return BasicTrackerItem.__super__.constructor.apply(this, arguments);
  }

  BasicTrackerItem.prototype.className = 'tracker line';

  BasicTrackerItem.prototype.template = require('views/templates/basic_tracker_list_item');

  BasicTrackerItem.prototype.load = function(callback) {
    var path;
    this.$(".graph-container").spin(true);
    path = this.model.getPath(MainState.startDate, MainState.endDate);
    return request.get(path, (function(_this) {
      return function(err, data) {
        if (err) {
          return alert("An error occured while retrieving data");
        } else {
          _this.$(".graph-container").spin(false);
          _this.data = data;
          MainState.data[_this.model.get('slug')] = data;
          _this.drawCharts();
          if (callback != null) {
            return callback();
          }
        }
      };
    })(this));
  };

  BasicTrackerItem.prototype.drawCharts = function() {
    var color, data, el, graphStyle, width, yEl;
    if (this.data != null) {
      width = this.$(".graph-container").width() - 70;
      el = this.$('.chart')[0];
      yEl = this.$('.y-axis')[0];
      color = this.model.get('color');
      data = MainState.data[this.model.get('slug')];
      graphStyle = this.model.get('metadata').style || 'bar';
      if (data == null) {
        data = calculus.getDefaultData();
      }
      return graph.draw({
        el: el,
        yEl: yEl,
        width: width,
        color: color,
        data: data,
        graphStyle: graphStyle
      });
    }
  };

  return BasicTrackerItem;

})(BaseView);

});

require.register("views/mood_tracker", function(exports, require, module) {
var BaseView, DATE_FORMAT, DATE_URL_FORMAT, MainState, Mood, MoodTracker, Moods, calculus, graph, normalizer, ref, request,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BaseView = require('lib/base_view');

request = require('lib/request');

graph = require('lib/graph');

normalizer = require('lib/normalizer');

calculus = require('lib/calculus');

MainState = require('../main_state');

Mood = require('../models/mood');

Moods = require('../collections/moods');

ref = require('../lib/constants'), DATE_FORMAT = ref.DATE_FORMAT, DATE_URL_FORMAT = ref.DATE_URL_FORMAT;

module.exports = MoodTracker = (function(superClass) {
  extend(MoodTracker, superClass);

  MoodTracker.prototype.id = 'moods-tracker';

  MoodTracker.prototype.className = 'line';

  MoodTracker.prototype.template = require('./templates/mood');

  MoodTracker.prototype.events = {
    'click #good-mood-btn': 'onGoodMoodClicked',
    'click #neutral-mood-btn': 'onNeutralMoodClicked',
    'click #bad-mood-btn': 'onBadMoodClicked'
  };

  MoodTracker.prototype.onGoodMoodClicked = function() {
    return this.updateMood('good');
  };

  MoodTracker.prototype.onNeutralMoodClicked = function() {
    return this.updateMood('neutral');
  };

  MoodTracker.prototype.onBadMoodClicked = function() {
    return this.updateMood('bad');
  };

  function MoodTracker(model) {
    this.model = model;
    this.loadCurrentDay = bind(this.loadCurrentDay, this);
    this.load = bind(this.load, this);
    MoodTracker.__super__.constructor.apply(this, arguments);
  }

  MoodTracker.prototype.afterRender = function() {
    MoodTracker.__super__.afterRender.apply(this, arguments);
    return this.$('#mood-current-date').pikaday({
      maxDate: new Date(),
      format: DATE_FORMAT,
      defaultDate: MainState.endDate.toDate(),
      setDefaultDate: true,
      onSelect: (function(_this) {
        return function(value) {
          return _this.loadCurrentDay();
        };
      })(this)
    });
  };

  MoodTracker.prototype.updateMood = function(status) {
    var day;
    day = moment(this.$('#mood-current-date').val());
    this.$('#mood-current-value').html('&nbsp;');
    this.$('#mood-current-value').spin(true);
    return Mood.updateDay(day, status, (function(_this) {
      return function(err, mood) {
        var i, val;
        _this.$('#mood-current-value').spin(false);
        if (err) {
          return alert("An error occured while saving data");
        } else {
          _this.$('#mood-current-value').html(status);
          if (status === 'good') {
            val = 3;
          } else if (status === 'neutral') {
            val = 2;
          } else {
            val = 1;
          }
          if (day >= MainState.startDate && day <= MainState.endDate) {
            i = 0;
            while (i < _this.data.length && moment(_this.data[i].x * 1000) < day) {
              i++;
            }
            if ((_this.data[i] != null) && moment(_this.data[i].x * 1000).format('YYYY-MM-DD') === moment(day).format('YYYY-MM-DD')) {
              _this.data[i] = {
                x: moment(day).toDate().getTime() / 1000,
                y: val
              };
            } else {
              _this.data.splice(i, 0, {
                x: moment(day).toDate().getTime() / 1000,
                y: val
              });
            }
            _this.$('.chart').html(null);
            _this.$('.y-axis').html(null);
            console.log(_this.data);
            return _this.redraw();
          }
        }
      };
    })(this));
  };

  MoodTracker.prototype.load = function(callback) {
    return this.model.loadMetadata((function(_this) {
      return function() {
        return _this.reload(callback);
      };
    })(this));
  };

  MoodTracker.prototype.reload = function(callback) {
    var day;
    day = moment(this.$('#mood-current-date').val());
    return this.loadCurrentDay((function(_this) {
      return function() {
        return _this.loadAnalytics(function() {
          _this.redraw();
          return typeof callback === "function" ? callback() : void 0;
        });
      };
    })(this));
  };

  MoodTracker.prototype.loadCurrentDay = function(callback) {
    var day;
    day = moment(this.$('#mood-current-date').val());
    this.$('#mood-current-value').html('&nbsp;');
    this.$('#mood-current-value').spin(true);
    return Mood.getDay(day, (function(_this) {
      return function(err, mood) {
        _this.$('#mood-current-value').spin(false);
        if (err) {
          alert("An error occured while retrieving mood data");
        } else if ((mood == null) || !mood.get('status')) {
          _this.$('#mood-current-value').html('no mood set');
        } else {
          _this.$('#mood-current-value').html(mood.get('status'));
        }
        return typeof callback === "function" ? callback() : void 0;
      };
    })(this));
  };

  MoodTracker.prototype.loadAnalytics = function(callback) {
    var end, path, start;
    start = MainState.startDate.format('YYYY-MM-DD');
    end = MainState.endDate.format('YYYY-MM-DD');
    path = "moods/" + start + "/" + end;
    this.showLoading();
    return request.get(path, (function(_this) {
      return function(err, data) {
        _this.hideLoading();
        if (err) {
          return alert("An error occured while retrieving moods data");
        } else {
          MainState.data['mood'] = _this.data = data;
          if ((_this.data == null) || _this.data.length === 0) {
            _this.data = calculus.getDefaultData();
          }
          return typeof callback === "function" ? callback() : void 0;
        }
      };
    })(this));
  };

  MoodTracker.prototype.redraw = function() {
    var color, data, el, graphStyle, width, yEl;
    if (this.data != null) {
      this.$("#moods-charts").html('');
      this.$("#moods-y-axis").html('');
      width = this.$("#moods").width() - 70;
      el = this.$("#moods-charts")[0];
      yEl = this.$("#moods-y-axis")[0];
      data = this.data;
      color = '#039BE5';
      graphStyle = this.model.get('metadata').style || 'bar';
      return graph.draw({
        el: el,
        yEl: yEl,
        width: width,
        color: color,
        data: data,
        graphStyle: graphStyle
      });
    }
  };

  MoodTracker.prototype.showLoading = function() {
    return this.$("#moods").spin(true);
  };

  MoodTracker.prototype.hideLoading = function() {
    return this.$("#moods").spin(false);
  };

  return MoodTracker;

})(BaseView);

});

require.register("views/raw_data_table", function(exports, require, module) {
var RawDataTable, TrackerAmountCollection, ViewCollection,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ViewCollection = require('lib/view_collection');

TrackerAmountCollection = require('collections/tracker_amounts');

module.exports = RawDataTable = (function(superClass) {
  extend(RawDataTable, superClass);

  function RawDataTable() {
    return RawDataTable.__super__.constructor.apply(this, arguments);
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

require.register("views/templates/add_basic_tracker_list", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
}
return buf.join("");
};
});

require.register("views/templates/add_basic_tracker_list_item", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
var __val__ = model.name
buf.push(escape(null == __val__ ? "" : __val__));
}
return buf.join("");
};
});

require.register("views/templates/add_tracker", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div id="add-basic-tracker-widget"><h2 class="mb1">Select the trackers you want to see</h2><div id="add-basic-tracker-list" class="line"></div><div class="line"> <i>Custom trackers</i></div><div id="add-tracker-list" class="line"></div></div><div id="add-tracker-widget"><h2>Create a custom tracker</h2><div class="mt2"><div><input id="add-tracker-name" placeholder="name" class="input"/></div><div><textarea id="add-tracker-description" placeholder="description" class="input"></textarea></div><div><button id="add-tracker-btn" class="btn">add tracker</button></div></div></div><div class="line"></div><div class="line txt-center"><a href="#" class="btn">See trackers</a></div>');
}
return buf.join("");
};
});

require.register("views/templates/add_tracker_list", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
}
return buf.join("");
};
});

require.register("views/templates/add_tracker_list_item", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
var __val__ = model.name
buf.push(escape(null == __val__ ? "" : __val__));
}
return buf.join("");
};
});

require.register("views/templates/basic_tracker_list", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
}
return buf.join("");
};
});

require.register("views/templates/basic_tracker_list_item", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="line"><h2> <a');
buf.push(attrs({ 'href':("#basic-trackers/" + (model.slug) + "") }, {"href":true}));
buf.push('>' + escape((interp = model.name) == null ? '' : interp) + '</a></h2><p class="explaination">' + escape((interp = model.description) == null ? '' : interp) + '</p></div><div class="line"><div class="graph-container"><div class="y-axis"></div><div class="chart"></div></div></div>');
}
return buf.join("");
};
});

require.register("views/templates/home", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div id="menu"><a id="home-btn" href="#" class="left"> <img src="icons/home.png" title="Kyou Home"/></a><div class="menu-date left"><span class="info-text">Visualize your data from:</span><input');
buf.push(attrs({ 'id':('datepicker-start'), 'value':("" + (startDate) + ""), "class": ('datepicker') }, {"value":true}));
buf.push('/><span class="info-text">to:</span><input');
buf.push(attrs({ 'id':('datepicker-end'), 'value':("" + (endDate) + ""), "class": ('datepicker') }, {"value":true}));
buf.push('/></div><a id="config-btn" href="#add-tracker" title="Select your trackers" class="right"><img src="icons/config.png"/></a></div><div id="content" class="pa2"><div class="w100 welcome-message"><p><img src="icons/main_icon.png" title="Kyou Home"/></p><p>Welcome to KYou the app that allows you to quantify yourself !</p><p>Through the webtools you use and your connected objects you create a huge amount of personal data. Unfortunately, you\ncan\'t take advantage of it to its full potential. It\'s a pity because you could\nbe learning a lot on yourself. </p><p> \nKYou, by building analytics directly from you Cozy data, provides you with the first taste of an empirical knowledge of yourself. Empowered with this new knowledge, you will learn more about you and improve yourself.</p><p> \nHere are the main concepts you will help you using KYou:</p><ul><li><strong>Basic Tracking: </strong><span>They are trackers built from the data stored into you Cozy. For instance, you can watch your daily amounts of emails or your daily amounts of steps.</span></li><li><strong>Custom Tracking:</strong><span>You can add custom trackers. They are useful when you \nwant to track something that could not be built from Cozy data.\nThey require you enter your data manually.</span></li><li><strong>Comparisons: </strong><span>you can compare trackers with each other. Click on\na name of a trackers and you will access to the comparision\ntool. More information about the current graph will be\ndisplayed too.</span></li></ul><p>Know you KYou better, let\'s start with tracking your mood. KYou can\'t guess your mood, so you\nhave to enter it manually every day. Once you saved your mood\nfor several days, start comparing it to your other data. You\nwill find interesting relations. To add other trackers to compare click\non the button at the bottom of this page or on the button at \nthe top right corner.</p></div><div id="mood-section"></div><img src="img/spinner.svg" class="hidden"/><div id="zoom-view" class="line"></div></div><div id="add-tracker-button" class="line txt-center"><a href="#add-tracker" class="btn">Add a tracker</a></div><div id="add-tracker-zone" class="pa2 line"></div>');
}
return buf.join("");
};
});

require.register("views/templates/mood", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="line"><h2> <a href="#mood">Mood</a></h2><p class="explaination">The goal of this tracker is to help you\nunderstand what could influence your mood by comparing it\nto other trackers.</p></div><div class="line"><div id="moods" class="graph-container"><div id="moods-y-axis" class="y-axis"></div><div id="moods-charts" class="chart"></div></div></div><div class="line"><p><strong>Change values</strong></p><p><span>Mood at </span><input id="mood-current-date" class="input tracker-input"/><span>:</span><span id="mood-current-value" class="tracker-value">&nbsp;</span></p><p id="set-mood"><span>Choose value:&nbsp;</span><button id="good-mood-btn" class="btn">good</button><button id="neutral-mood-btn" class="btn">neutral</button><button id="bad-mood-btn" class="btn">bad</button></p></div>');
}
return buf.join("");
};
});

require.register("views/templates/tracker_amount_item", function(exports, require, module) {
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

require.register("views/templates/tracker_amount_list", function(exports, require, module) {
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

require.register("views/templates/tracker_list", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
}
return buf.join("");
};
});

require.register("views/templates/tracker_list_item", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="line"><h2> <a');
buf.push(attrs({ 'href':("#trackers/" + (model.id) + "") }, {"href":true}));
buf.push('>' + escape((interp = model.name) == null ? '' : interp) + '</a></h2><p class="explaination">' + escape((interp = model.description) == null ? '' : interp) + '</p></div><div class="line"><div class="graph-container"><div class="y-axis"></div><div class="chart"></div></div></div><div class="line"><p><strong>Change values</strong></p><p><span>Value at </span><input class="input tracker-input tracker-current-date"/><span>:</span><span class="tracker-current-value">&nbsp;</span></p><p class="set-tracker-value"><span>Choose value:&nbsp;</span><input class="input tracker-input tracker-new-value"/><button class="btn save-tracker-value">save</button></p></div>');
}
return buf.join("");
};
});

require.register("views/templates/zoom", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="line graph-section"><h2 class="zoomtitle">No tracker selected</h2><p class="zoomexplaination explaination"></p><p class="zoom-editable"><input class="zoomtitle"/></p><p class="zoom-editable"><textarea class="zoomexplaination explaination"></textarea></p></div><div id="zoomgraph" class="graph-container"><div id="zoom-y-axis" class="y-axis"></div><div id="zoom-charts" class="chart"></div><div id="timeline" class="rickshaw_annotation_timeline"></div></div><div class="line txt-center pt2"><a id="back-trackers-btn" href="#">go back to tracker list</a></div><div class="line"><div class="mod w50 left"><h3>Options</h3><p class="zoom-option"><span>scale</span><span><select id="zoomtimeunit"><option value="day">day</option><option value="week">week</option><option value="month">month</option></select></span></p><p class="zoom-option"><span>display</span><span><select id="zoomstyle"><option id="zoom-bar-option" value="bar">bars</option><option value="line">lines</option><option value="scatterplot">points</option><option id="zoom-correlation-option" value="correlation">correlate (points)</option></select></span></p><p class="zoom-option"><span>compare with</span><span><select id="zoomcomparison"></select><br/></span></p><p class="zoom-option"><span>goal</span><span><input id="zoomgoal" value="0"/></span></p><p><span class="smaller em">Note: Compared tracker is displayed in red.</span></p></div><div class="mod w50 left"><h3>Information</h3><p class="zoom-option"><span>average&nbsp;</span><span id="average-value"></span></p><p class="zoom-option"><span>recent evolution&nbsp;</span><span id="evolution-value"></span></p><h3>Manage</h3><p class="zoom-option"><span>export</span><span><a href="" id="export-btn" class="btn smaller">all data in a .csv file</a></span></p><p id="import-section" class="zoom-option"><span>import</span><span class="import-widget"><input id="import-input" type="file" accept=".csv" class="input"/><button id="import-button" class="btn smaller">import data</button></span></p><p id="remove-section" class="zoom-option"><span>remove</span><span><button id="remove-btn" class="btn-danger smaller"> \nremove tracker and delete all data</button></span></p><p id="import-info" class="smaller em">Note: Expected format for import is a two-column CSV file where\nfirst column contains dates and second column contains amounts.</p></div></div><div class="line"><p class="pa2"></p><p id="show-data-section"><button id="show-data-btn">show data</button>or <a id="show-data-csv" target="_blank"> download csv file</a></p><div id="raw-data"></div></div>');
}
return buf.join("");
};
});

require.register("views/tracker_amount_item", function(exports, require, module) {
var BaseView, TrackerAmountItem, request,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BaseView = require('lib/base_view');

request = require('../lib/request');

module.exports = TrackerAmountItem = (function(superClass) {
  extend(TrackerAmountItem, superClass);

  function TrackerAmountItem() {
    this.afterRender = bind(this.afterRender, this);
    return TrackerAmountItem.__super__.constructor.apply(this, arguments);
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

require.register("views/tracker_list", function(exports, require, module) {
var TrackerCollection, TrackerList, ViewCollection, normalizer, request,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

normalizer = require('lib/normalizer');

ViewCollection = require('lib/view_collection');

TrackerCollection = require('collections/trackers');

request = require('lib/request');

module.exports = TrackerList = (function(superClass) {
  extend(TrackerList, superClass);

  function TrackerList() {
    return TrackerList.__super__.constructor.apply(this, arguments);
  }

  TrackerList.prototype.id = 'tracker-list';

  TrackerList.prototype.itemView = require('views/tracker_list_item');

  TrackerList.prototype.template = require('views/templates/tracker_list');

  TrackerList.prototype.collection = new TrackerCollection();

  TrackerList.prototype.subscriptions = {
    'tracker:add': 'onAddTracker',
    'tracker:removed': 'onTrackerRemoved'
  };

  TrackerList.prototype.load = function(callback) {
    return this.collection.fetch({
      success: (function(_this) {
        return function() {
          return _this.reloadAll(function() {
            console.log('load done');
            return typeof callback === "function" ? callback() : void 0;
          });
        };
      })(this),
      error: (function(_this) {
        return function() {
          alert('Cannot load basic trackers');
          return typeof callback === "function" ? callback() : void 0;
        };
      })(this)
    });
  };

  TrackerList.prototype.reloadAll = function(callback) {
    var id, ref, trackers, view;
    this.$(".tracker .chart").html('');
    this.$(".tracker .y-axis").html('');
    trackers = [];
    ref = this.views;
    for (id in ref) {
      view = ref[id];
      trackers.push(view);
    }
    return async.eachSeries(trackers, function(tracker, next) {
      if (!tracker.model.get('metadata').hidden) {
        return tracker.load(next);
      } else {
        return next();
      }
    }, function(err) {
      console.log('reloadAll done');
      if (callback != null) {
        return callback();
      }
    });
  };

  TrackerList.prototype.redrawAll = function() {
    var id, ref, results, view;
    ref = this.views;
    results = [];
    for (id in ref) {
      view = ref[id];
      results.push(view.redrawGraph());
    }
    return results;
  };

  TrackerList.prototype.appendView = function(view) {
    this.$collectionEl.append(view.el);
    if (view.model.get('metadata').hidden) {
      return view.$el.addClass('hidden');
    }
  };

  TrackerList.prototype.refreshCurrentValue = function() {
    var id, ref, results, view;
    ref = this.views;
    results = [];
    for (id in ref) {
      view = ref[id];
      results.push(view.refreshCurrentValue());
    }
    return results;
  };

  TrackerList.prototype.remove = function(id) {
    var view;
    view = this.getView(id);
    return view.remove();
  };

  TrackerList.prototype.getView = function(id) {
    var tracker, view;
    tracker = this.collection.findWhere({
      id: id
    });
    view = this.views[tracker.cid];
    return view;
  };

  TrackerList.prototype.onAddTracker = function(id) {
    var data, view;
    view = this.getView(id);
    view.$el.removeClass('hidden');
    view.load();
    data = {
      hidden: false
    };
    return request.put("metadata/basic-trackers/" + id, data, function(err) {});
  };

  TrackerList.prototype.onTrackerRemoved = function(id) {
    var data;
    this.remove(id);
    data = {
      hidden: true
    };
    return request.put("metadata/basic-trackers/" + id, data, function(err) {});
  };

  TrackerList.prototype.isEmpty = function() {
    var i, isEmpty, isHidden, len, ref, tracker;
    isEmpty = true;
    ref = this.collection.models;
    for (i = 0, len = ref.length; i < len; i++) {
      tracker = ref[i];
      isHidden = tracker.get('metadata').hidden;
      if (isHidden === false) {
        isEmpty = false;
      }
    }
    return isEmpty;
  };

  return TrackerList;

})(ViewCollection);

});

require.register("views/tracker_list_item", function(exports, require, module) {
var BaseView, DATE_FORMAT, DATE_URL_FORMAT, MainState, TrackerItem, calculus, graph, normalizer, ref, request,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BaseView = require('lib/base_view');

request = require('lib/request');

graph = require('lib/graph');

normalizer = require('lib/normalizer');

calculus = require('lib/calculus');

MainState = require('../main_state');

ref = require('../lib/constants'), DATE_FORMAT = ref.DATE_FORMAT, DATE_URL_FORMAT = ref.DATE_URL_FORMAT;

module.exports = TrackerItem = (function(superClass) {
  extend(TrackerItem, superClass);

  function TrackerItem() {
    this.loadCurrentDay = bind(this.loadCurrentDay, this);
    this.afterRender = bind(this.afterRender, this);
    return TrackerItem.__super__.constructor.apply(this, arguments);
  }

  TrackerItem.prototype.className = 'tracker line';

  TrackerItem.prototype.template = require('views/templates/tracker_list_item');

  TrackerItem.prototype.events = {
    'click .up-btn': 'onUpClicked',
    'click .down-btn': 'onDownClicked',
    'click .save-tracker-value': 'onSaveClicked'
  };

  TrackerItem.prototype.afterRender = function() {
    this.$('.tracker-current-date').pikaday({
      maxDate: new Date(),
      format: DATE_FORMAT,
      defaultDate: MainState.endDate.toDate(),
      setDefaultDate: true,
      onSelect: (function(_this) {
        return function(value) {
          return _this.loadCurrentDay();
        };
      })(this)
    });
    this.$('.tracker-new-value').numeric();
    return this.loadCurrentDay();
  };

  TrackerItem.prototype.loadCurrentDay = function() {
    var day;
    if (this.model.get('id')) {
      day = moment(this.$('.tracker-current-date').val());
      return this.model.getDay(day, (function(_this) {
        return function(err, amount) {
          if (err) {
            return alert("An error occured while retrieving tracker data");
          } else if (amount == null) {
            return _this.$('.tracker-current-value').html('no value set');
          } else {
            return _this.$('.tracker-current-value').html(amount.get('amount'));
          }
        };
      })(this));
    } else {
      return setTimeout(this.loadCurrentDay, 500);
    }
  };

  TrackerItem.prototype.onSaveClicked = function(event) {
    var amount, day, label;
    day = moment(this.$('.tracker-current-date').val());
    amount = this.$('.tracker-new-value').val();
    amount = parseInt(amount);
    label = this.$('.tracker-current-value');
    label.spin(true);
    return this.model.updateDay(day, amount, (function(_this) {
      return function(err) {
        var i;
        label.spin(false);
        if (err) {
          return alert('An error occured while saving tracker amount');
        } else {
          label.html(amount);
          if (day >= MainState.startDate && day <= MainState.endDate) {
            i = 0;
            while (i < _this.data.length && moment(_this.data[i].x * 1000) < day) {
              i++;
            }
            if ((_this.data[i] != null) && moment(_this.data[i].x * 1000).format('YYYY-MM-DD') === moment(day).format('YYYY-MM-DD')) {
              _this.data[i] = {
                x: moment(day).toDate().getTime() / 1000,
                y: amount
              };
            } else {
              _this.data.splice(i, 0, {
                x: moment(day).toDate().getTime() / 1000,
                y: amount
              });
            }
            _this.$('.chart').html(null);
            _this.$('.y-axis').html(null);
            return _this.drawCharts();
          }
        }
      };
    })(this));
  };

  TrackerItem.prototype.load = function(callback) {
    var path;
    this.$(".graph-container").spin(true);
    path = this.model.getPath(MainState.startDate, MainState.endDate);
    return request.get(path, (function(_this) {
      return function(err, data) {
        if (err) {
          alert("An error occured while retrieving data");
        } else {
          _this.$(".graph-container").spin(false);
          _this.data = data;
          MainState.data[_this.model.get('id')] = data;
          _this.drawCharts();
        }
        if (callback != null) {
          return callback();
        }
      };
    })(this));
  };

  TrackerItem.prototype.drawCharts = function() {
    var color, data, el, graphStyle, width, yEl;
    if (this.data != null) {
      width = this.$(".graph-container").width() - 70;
      el = this.$('.chart')[0];
      yEl = this.$('.y-axis')[0];
      color = 'black';
      data = MainState.data[this.model.get('id')];
      graphStyle = this.model.get('metadata').style || 'bar';
      if (data == null) {
        data = calculus.getDefaultData();
      }
      return graph.draw({
        el: el,
        yEl: yEl,
        width: width,
        color: color,
        data: data,
        graphStyle: graphStyle
      });
    }
  };

  TrackerItem.prototype.redrawGraph = function() {
    return this.drawCharts();
  };

  return TrackerItem;

})(BaseView);

});

require.register("views/zoom", function(exports, require, module) {
var BaseView, MainState, Tracker, ZoomView, calculus, graphHelper, request,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BaseView = require('lib/base_view');

request = require('lib/request');

graphHelper = require('../lib/graph');

calculus = require('lib/calculus');

Tracker = require('../models/tracker');

MainState = require('../main_state');

module.exports = ZoomView = (function(superClass) {
  extend(ZoomView, superClass);

  ZoomView.prototype.className = '';

  ZoomView.prototype.el = '#zoom-view';

  ZoomView.prototype.template = require('views/templates/zoom');

  ZoomView.prototype.events = {
    'blur input.zoomtitle': 'onCurrentTrackerChanged',
    'blur textarea.zoomexplaination': 'onCurrentTrackerChanged',
    'change #zoomtimeunit': 'onComparisonChanged',
    'change #zoomstyle': 'onStyleChanged',
    'change #zoomcomparison': 'onComparisonChanged',
    'keyup #zoomgoal': 'onGoalChanged',
    'click #remove-btn': 'onRemoveClicked',
    'click #back-trackers-btn': 'onBackTrackersClicked',
    'change #import-input': 'onImportFileChanged',
    'click #import-button': 'onImportClicked'
  };

  function ZoomView(model, basicTrackers, moodTracker, trackers) {
    this.model = model;
    this.basicTrackers = basicTrackers;
    this.moodTracker = moodTracker;
    this.trackers = trackers;
    this.onComparisonChanged = bind(this.onComparisonChanged, this);
    this.onGoalChanged = bind(this.onGoalChanged, this);
    this.onStyleChanged = bind(this.onStyleChanged, this);
    this.onBackTrackersClicked = bind(this.onBackTrackersClicked, this);
    this.onRemoveClicked = bind(this.onRemoveClicked, this);
    ZoomView.__super__.constructor.apply(this, arguments);
  }

  ZoomView.prototype.afterRender = function() {
    this.$('#zoom-correlation-option').hide();
    return this.$('#zoomgoal').numeric();
  };

  ZoomView.prototype.getTracker = function() {
    return this.model.get('tracker');
  };

  ZoomView.prototype.show = function(slug) {
    var tracker;
    ZoomView.__super__.show.apply(this, arguments);
    if (slug === 'mood') {
      tracker = this.moodTracker;
      this.$("#export-btn").attr("href", "moods/export/mood.csv");
      this.$("#remove-section").hide();
      this.$("#import-section").hide();
      this.$("#import-info").hide();
    } else if (slug.length === 32) {
      tracker = this.trackers.findWhere({
        id: slug
      });
      console.log(tracker);
      tracker.set('slug', slug);
      this.$("#export-btn").attr("href", "trackers/export/" + slug + "/export.csv");
      this.$("#remove-section").show();
      this.$("#import-section").show();
      this.$("#import-info").show();
    } else {
      tracker = this.basicTrackers.findWhere({
        slug: slug
      });
      this.$("#export-btn").attr("href", "basic-trackers/export/" + slug + ".csv");
      this.$("#remove-section").hide();
      this.$("#import-section").hide();
      this.$("#import-info").hide();
    }
    if (tracker == null) {
      alert("Tracker does not exist");
    } else {
      this.model.set('tracker', tracker);
      this.prefillFields(tracker);
      this.setEditMode();
      this.displayData(tracker);
    }
    return this.$el.scrollTop();
  };

  ZoomView.prototype.prefillFields = function(tracker) {
    this.$("h2.zoomtitle").html(tracker.get('name'));
    this.$("p.zoomexplaination").html(tracker.get('description'));
    this.$("#zoomstyle").val(tracker.get('metadata').style || 'bar');
    this.$("#zoomgoal").val(tracker.get('metadata').goal || '0');
    return this.fillComparisonCombo();
  };

  ZoomView.prototype.fillComparisonCombo = function() {
    var combo, j, k, len, len1, option, ref, ref1, results, tracker;
    combo = this.$("#zoomcomparison");
    combo.html(null);
    combo.append("<option value=\"undefined\">no comparison</option>\"");
    combo.append("<option value=\"last-year\">previous year</option>\"");
    combo.append("<option value=\"previous\">previous period</option>\"");
    combo.append("<option value=\"moods\">Moods</option>");
    ref = this.trackers.models;
    for (j = 0, len = ref.length; j < len; j++) {
      tracker = ref[j];
      if (!tracker.get('metadata').hidden) {
        option = "<option value=";
        option += "\"" + (tracker.get('id')) + "\"";
        option += ">" + (tracker.get('name')) + "</option>";
        combo.append(option);
      }
    }
    ref1 = this.basicTrackers.models;
    results = [];
    for (k = 0, len1 = ref1.length; k < len1; k++) {
      tracker = ref1[k];
      if (!tracker.get('metadata').hidden) {
        option = "<option value=";
        option += "\"basic-" + (tracker.get('slug')) + "\"";
        option += ">" + (tracker.get('name')) + "</option>";
        results.push(combo.append(option));
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  ZoomView.prototype.setEditMode = function() {
    this.$("h2.zoomtitle").show();
    this.$("p.zoomexplaination").show();
    this.$("input.zoomtitle").hide();
    this.$("textarea.zoomexplaination").hide();
    return this.$("#show-data-section").hide();
  };

  ZoomView.prototype.displayData = function(tracker) {
    var data;
    data = MainState.data[tracker.get('slug')];
    this.showAverage(data);
    this.showEvolution(data);
    return this.printZoomGraph(data, this.getColor());
  };

  ZoomView.prototype.reload = function() {
    var data, tracker;
    tracker = this.model.get('tracker');
    if (tracker != null) {
      data = MainState.data[tracker.get('slug')];
      return this.printZoomGraph(data, tracker.get('color'));
    }
  };

  ZoomView.prototype.showAverage = function(data) {
    return this.$("#average-value").html(calculus.average(data));
  };

  ZoomView.prototype.showEvolution = function(data) {
    var evolution, i, length, middle, newTrend, oldTrend, ref;
    evolution = 0;
    if (data) {
      if ((ref = !data.length) === 0 || ref === 1) {
        length = data.length;
        if (data.length < 14) {
          middle = Math.round(length / 2);
        } else {
          middle = 7;
        }
        newTrend = 0;
        i = middle;
        while (i > 0) {
          newTrend += data[length - i - 1].y;
          i--;
        }
        oldTrend = 0;
        i = middle;
        while (i > 0) {
          oldTrend += data[length - middle - i].y;
          i--;
        }
        if (oldTrend !== 0) {
          evolution = (newTrend / oldTrend) * 100 - 100;
        } else {
          evolution = 0;
        }
      }
    }
    evolution = Math.round(evolution * 100) / 100;
    return this.$("#evolution-value").html(evolution + " %");
  };

  ZoomView.prototype.printZoomGraph = function(data, color, graphStyle, comparisonData, time, goal) {
    var annotator, el, graph, timelineEl, width, yEl;
    if (data != null) {
      if (graphStyle == null) {
        graphStyle = this.$("#zoomstyle").val() || 'bar';
      }
      if (goal == null) {
        goal = this.$("#zoomgoal").val() || null;
      }
      if (color == null) {
        color = 'black';
      }
      width = $(window).width() - 140;
      el = this.$('#zoom-charts')[0];
      yEl = this.$('#zoom-y-axis')[0];
      graphHelper.clear(el, yEl);
      graph = graphHelper.draw({
        el: el,
        yEl: yEl,
        width: width,
        color: color,
        data: data,
        graphStyle: graphStyle,
        comparisonData: comparisonData,
        time: time,
        goal: goal
      });
      timelineEl = this.$('#timeline')[0];
      this.$('#timeline').html(null);
      return annotator = new Rickshaw.Graph.Annotate({
        graph: graph,
        element: this.$('#timeline')[0]
      });
    }
  };

  ZoomView.prototype.onRemoveClicked = function() {
    var answer, id, tracker;
    answer = confirm("Are you sure that you want to delete this tracker?");
    if (answer) {
      tracker = this.getTracker();
      id = tracker.get('id');
      return tracker.destroy({
        success: (function(_this) {
          return function() {
            return window.app.router.navigateHome();
          };
        })(this),
        error: function() {
          return alert('something went wrong while removing tracker.');
        }
      });
    }
  };

  ZoomView.prototype.getMetadataPath = function() {
    var slug, tracker;
    tracker = this.getTracker();
    slug = tracker.get('slug');
    return "metadata/basic-trackers/" + slug;
  };

  ZoomView.prototype.onBackTrackersClicked = function(event) {
    window.app.router.navigateHome();
    return event.preventDefault();
  };

  ZoomView.prototype.onStyleChanged = function() {
    var data, slug, style, tracker;
    style = this.$("#zoomstyle").val();
    if (style === 'bar' || style === 'line' || style === 'scatterplot') {
      tracker = this.model.get('tracker');
      slug = tracker.get('slug');
      data = {
        style: style
      };
      tracker.setMetadata('style', data.style);
      request.put(this.getMetadataPath(), data, function(err) {});
    }
    return this.onComparisonChanged();
  };

  ZoomView.prototype.onGoalChanged = function() {
    var data, slug, tracker;
    tracker = this.model.get('tracker');
    slug = tracker.get('slug');
    data = {
      goal: parseInt(this.$("#zoomgoal").val())
    };
    tracker.setMetadata('goal', data.goal);
    this.onComparisonChanged();
    return request.put(this.getMetadataPath(), data, function(err) {});
  };

  ZoomView.prototype.onComparisonChanged = function() {
    var comparisonData, data, graphStyle, timeUnit, toNormalize, tracker, val;
    val = this.$("#zoomcomparison").val();
    timeUnit = this.$("#zoomtimeunit").val();
    graphStyle = this.$("#zoomstyle").val();
    tracker = this.model.get('tracker');
    data = MainState.data[tracker.get('slug')];
    toNormalize = false;
    if (val.indexOf('basic') !== -1 || (val === 'last-year' || val === 'previous' || val === 'moods') || val.length === 32) {
      this.$('#zoom-bar-option').hide();
      this.$('#zoom-correlation-option').show();
      if (graphStyle === 'bar') {
        graphStyle = 'line';
        this.$("#zoomstyle").val('line');
      }
      return this.getComparisonData(val, (function(_this) {
        return function(err, comparisonData) {
          toNormalize = !(val === 'last-year' || val === 'previous');
          return _this.displayGraph({
            timeUnit: timeUnit,
            data: data,
            comparisonData: comparisonData,
            graphStyle: graphStyle,
            toNormalize: toNormalize
          });
        };
      })(this));
    } else {
      this.$('#zoom-correlation-option').hide();
      this.$('#zoom-bar-option').show();
      if (graphStyle === 'correlation') {
        graphStyle = 'bar';
        this.$("#zoomstyle").val('line');
      }
      comparisonData = null;
      return this.displayGraph({
        timeUnit: timeUnit,
        data: data,
        graphStyle: graphStyle,
        toNormalize: toNormalize
      });
    }
  };

  ZoomView.prototype.displayGraph = function(options) {
    var color, comparisonData, data, graphStyle, ref, time, timeUnit, toNormalize;
    timeUnit = options.timeUnit, data = options.data, comparisonData = options.comparisonData, graphStyle = options.graphStyle, toNormalize = options.toNormalize;
    time = true;
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
    if (toNormalize) {
      ref = graphHelper.normalizeComparisonData(data, comparisonData), data = ref.data, comparisonData = ref.comparisonData;
    }
    if (graphStyle === 'correlation' && (comparisonData != null)) {
      data = graphHelper.mixData(data, comparisonData);
      comparisonData = null;
      graphStyle = 'scatterplot';
      time = false;
    }
    color = this.getColor(comparisonData !== null);
    return this.printZoomGraph(data, color, graphStyle, comparisonData, time);
  };

  ZoomView.prototype.getColor = function(isComparison) {
    var color;
    if (isComparison) {
      color = 'black';
    } else {
      color = this.getTracker().get('color');
    }
    return color;
  };

  ZoomView.prototype.getComparisonData = function(slug, callback) {
    var endDate, length, path, startDate;
    if (slug === 'last-year' || slug === 'previous') {
      startDate = moment(MainState.startDate);
      endDate = moment(MainState.endDate);
      if (slug === 'last-year') {
        startDate.subtract('year', 1);
        endDate.subtract('year', 1);
      }
      if (slug === 'previous') {
        length = endDate.diff(startDate, 'days');
        length++;
        startDate.subtract('day', length);
        endDate.subtract('day', length);
      }
      path = this.getTracker().getPath(startDate, endDate);
      return request.get(path, (function(_this) {
        return function(err, data) {
          if (err) {
            alert("An error occured while retrieving previous data");
            return callback(null, {});
          } else {
            if (slug === 'last-year') {
              calculus.addYearToDates(data);
            }
            if (slug === 'previous') {
              calculus.addDayToDates(data, length);
            }
            return callback(null, data);
          }
        };
      })(this));
    } else {
      if (slug.length !== 32 && slug !== 'moods') {
        slug = slug.substring(6);
      } else if (slug === 'moods') {
        slug = 'mood';
      }
      return callback(null, MainState.data[slug]);
    }
  };

  ZoomView.prototype.onImportFileChanged = function(event) {
    var file;
    file = event.target.files[0];
    this.reader = new FileReader();
    return this.reader.readAsText(file);
  };

  ZoomView.prototype.onImportClicked = function() {
    var data, tracker;
    tracker = this.getTracker();
    data = {
      csv: this.reader.result
    };
    return request.post("trackers/" + (tracker.get('id')) + "/csv", data, (function(_this) {
      return function(err) {
        console.log(err);
        if (err) {
          return alert('An error occured during the import.');
        } else {
          alert('Your import was successfully completed.');
          return window.app.mainView.trackerList.reloadAll(function() {
            return _this.reload();
          });
        }
      };
    })(this));
  };

  ZoomView.prototype.reload = function() {
    var data, tracker;
    tracker = this.model.get('tracker');
    if (tracker != null) {
      data = MainState.data[tracker.get('slug')];
      return this.printZoomGraph(data, tracker.get('color'));
    }
  };

  return ZoomView;

})(BaseView);

});


//# sourceMappingURL=app.js.map