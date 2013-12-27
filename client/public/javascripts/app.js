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
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
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

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.brunch = true;
})();

window.require.register("application", function(exports, require, module) {
  module.exports = {
    initialize: function() {
      var Router;
      $.fn.spin = function(opts, color) {
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
      Router = require('router');
      this.router = new Router();
      Backbone.history.start();
      if (typeof Object.freeze === 'function') {
        return Object.freeze(this);
      }
    }
  };
  
});
window.require.register("collections/basic_trackers", function(exports, require, module) {
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
window.require.register("collections/moods", function(exports, require, module) {
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
window.require.register("collections/trackers", function(exports, require, module) {
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
window.require.register("initialize", function(exports, require, module) {
  var app;

  app = require('application');

  $(function() {
    require('lib/app_helpers');
    return app.initialize();
  });
  
});
window.require.register("lib/app_helpers", function(exports, require, module) {
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
window.require.register("lib/base_view", function(exports, require, module) {
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
window.require.register("lib/model", function(exports, require, module) {
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
window.require.register("lib/request", function(exports, require, module) {
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
window.require.register("lib/view_collection", function(exports, require, module) {
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
window.require.register("models/basic_tracker", function(exports, require, module) {
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
window.require.register("models/mood", function(exports, require, module) {
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
window.require.register("models/moods", function(exports, require, module) {
  var MoodsCollection, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = MoodsCollection = (function(_super) {
    __extends(MoodsCollection, _super);

    function MoodsCollection() {
      _ref = MoodsCollection.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    MoodsCollection.prototype.model = require('../models/mood');

    MoodsCollection.prototype.url = 'moods/';

    return MoodsCollection;

  })(Backbone.Collection);
  
});
window.require.register("models/tracker", function(exports, require, module) {
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
window.require.register("router", function(exports, require, module) {
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
      '': 'main'
    };

    Router.prototype.main = function() {
      var mainView;
      mainView = new AppView();
      mainView.render();
      window.app = {};
      return window.app.mainView = mainView;
    };

    return Router;

  })(Backbone.Router);
  
});
window.require.register("views/app_view", function(exports, require, module) {
  var AppView, BaseView, BasicTrackerList, Mood, Moods, TrackerList, request,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  request = require('../lib/request');

  BaseView = require('../lib/base_view');

  Mood = require('../models/mood');

  Moods = require('../collections/moods');

  TrackerList = require('./tracker_list');

  BasicTrackerList = require('./basic_tracker_list');

  module.exports = AppView = (function(_super) {
    __extends(AppView, _super);

    AppView.prototype.el = 'body.application';

    AppView.prototype.template = require('./templates/home');

    AppView.prototype.events = {
      'click #good-mood-btn': 'onGoodMoodClicked',
      'click #neutral-mood-btn': 'onNeutralMoodClicked',
      'click #bad-mood-btn': 'onBadMoodClicked',
      'click #add-tracker-btn': 'onTrackerButtonClicked',
      'change #datepicker': 'onDatePickerChanged'
    };

    function AppView() {
      this.redrawCharts = __bind(this.redrawCharts, this);
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
      this.data = {};
      this.colors = {};
      $(window).on('resize', this.redrawCharts);
      this.loadBaseAnalytics();
      this.basicTrackerList = new BasicTrackerList();
      this.$('#content').append(this.basicTrackerList.$el);
      this.basicTrackerList.render();
      this.basicTrackerList.collection.fetch();
      this.trackerList = new TrackerList();
      this.$('#content').append(this.trackerList.$el);
      this.trackerList.render();
      this.trackerList.collection.fetch();
      this.$("#datepicker").datepicker({
        maxDate: "+0D"
      });
      return this.$("#datepicker").val(this.currentDate.format('LL'), {
        trigger: false
      });
    };

    AppView.prototype.onDatePickerChanged = function() {
      this.currentDate = moment(this.$("#datepicker").val());
      this.loadBaseAnalytics();
      return this.$("#datepicker").val(this.currentDate.format('LL'), {
        trigger: false
      });
    };

    AppView.prototype.loadBaseAnalytics = function() {
      this.loadMood();
      this.getAnalytics("moods", 'steelblue');
      if (this.trackerList != null) {
        this.basicTrackerList.reloadAll();
      }
      if (this.trackerList != null) {
        return this.trackerList.reloadAll();
      }
    };

    AppView.prototype.onGoodMoodClicked = function() {
      return this.updateMood('good');
    };

    AppView.prototype.onNeutralMoodClicked = function() {
      return this.updateMood('neutral');
    };

    AppView.prototype.onBadMoodClicked = function() {
      return this.updateMood('bad');
    };

    AppView.prototype.updateMood = function(status) {
      var _this = this;
      this.$('#current-mood').html('&nbsp;');
      this.$('#current-mood').spin('tiny');
      return Mood.updateDay(this.currentDate, status, function(err, mood) {
        if (err) {
          _this.$('#current-mood').spin();
          return alert("An error occured while saving data");
        } else {
          _this.$('#current-mood').spin();
          _this.$('#current-mood').html(status);
          _this.$('#moods-charts').html('');
          _this.$('#moods-y-axis').html('');
          return _this.getAnalytics('moods', 'steelblue');
        }
      });
    };

    AppView.prototype.loadMood = function() {
      var _this = this;
      return Mood.getDay(this.currentDate, function(err, mood) {
        if (err) {
          return alert("An error occured while retrieving mood data");
        } else if (mood == null) {
          return _this.$('#current-mood').html('Set your mood for current day');
        } else {
          return _this.$('#current-mood').html(mood.get('status'));
        }
      });
    };

    AppView.prototype.getAnalytics = function(dataType, color) {
      var path,
        _this = this;
      this.$("#" + dataType + "-charts").html('');
      this.$("#" + dataType + "-y-axis").html('');
      $("#" + dataType).spin('tiny');
      path = "" + dataType + "/" + (this.currentDate.format('YYYY-MM-DD'));
      return request.get(path, function(err, data) {
        var chartId, width, yAxisId;
        if (err) {
          return alert("An error occured while retrieving " + dataType + " data");
        } else {
          $("#" + dataType).spin();
          width = $("#" + dataType).width() - 30;
          chartId = "" + dataType + "-charts";
          yAxisId = "" + dataType + "-y-axis";
          _this.data[dataType] = data;
          _this.colors[dataType] = color;
          return _this.drawCharts(data, chartId, yAxisId, color, width);
        }
      });
    };

    AppView.prototype.redrawCharts = function() {
      var chartId, color, data, dataType, width, yAxisId, _ref;
      $('.chart').html(null);
      $('.y-axis').html(null);
      _ref = this.data;
      for (dataType in _ref) {
        data = _ref[dataType];
        width = $("#" + dataType).width() - 30;
        chartId = "" + dataType + "-charts";
        yAxisId = "" + dataType + "-y-axis";
        color = this.colors[dataType];
        this.drawCharts(data, chartId, yAxisId, color, width);
      }
      this.trackerList.redrawAll();
      this.basicTrackerList.redrawAll();
      return true;
    };

    AppView.prototype.drawCharts = function(data, chartId, yAxisId, color, width) {
      var graph, hoverDetail, x_axis, y_axis;
      graph = new Rickshaw.Graph({
        element: document.querySelector("#" + chartId),
        width: width,
        height: 300,
        renderer: 'bar',
        series: [
          {
            color: color,
            data: data
          }
        ]
      });
      x_axis = new Rickshaw.Graph.Axis.Time({
        graph: graph
      });
      y_axis = new Rickshaw.Graph.Axis.Y({
        graph: graph,
        orientation: 'left',
        tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
        element: document.getElementById(yAxisId)
      });
      graph.render();
      hoverDetail = new Rickshaw.Graph.HoverDetail({
        graph: graph,
        xFormatter: function(x) {
          return moment(x * 1000).format('LL');
        },
        formatter: function(series, x, y) {
          return Math.floor(y);
        }
      });
      return graph;
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

    return AppView;

  })(BaseView);
  
});
window.require.register("views/basic_tracker_list", function(exports, require, module) {
  var BasicTrackerCollection, TrackerList, ViewCollection, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ViewCollection = require('lib/view_collection');

  BasicTrackerCollection = require('collections/basic_trackers');

  module.exports = TrackerList = (function(_super) {
    __extends(TrackerList, _super);

    function TrackerList() {
      _ref = TrackerList.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    TrackerList.prototype.id = 'basic-tracker-list';

    TrackerList.prototype.itemView = require('views/basic_tracker_list_item');

    TrackerList.prototype.template = require('views/templates/basic_tracker_list');

    TrackerList.prototype.collection = new BasicTrackerCollection();

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

    TrackerList.prototype.reloadAll = function() {
      var id, view, _ref1, _results;
      this.$(".tracker .chart").html('');
      this.$(".tracker .y-axis").html('');
      _ref1 = this.views;
      _results = [];
      for (id in _ref1) {
        view = _ref1[id];
        _results.push(view.afterRender());
      }
      return _results;
    };

    return TrackerList;

  })(ViewCollection);
  
});
window.require.register("views/basic_tracker_list_item", function(exports, require, module) {
  var BaseView, BasicTrackerItem, request, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseView = require('lib/base_view');

  request = require('lib/request');

  module.exports = BasicTrackerItem = (function(_super) {
    __extends(BasicTrackerItem, _super);

    function BasicTrackerItem() {
      this.afterRender = __bind(this.afterRender, this);
      _ref = BasicTrackerItem.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    BasicTrackerItem.prototype.className = 'tracker line';

    BasicTrackerItem.prototype.template = require('views/templates/basic_tracker_list_item');

    BasicTrackerItem.prototype.afterRender = function() {
      var day;
      day = window.app.mainView.currentDate;
      return this.getAnalytics();
    };

    BasicTrackerItem.prototype.getAnalytics = function() {
      var day,
        _this = this;
      this.$(".graph-container").spin('tiny');
      day = window.app.mainView.currentDate.format("YYYY-MM-DD");
      return request.get(this.model.get('path'), function(err, data) {
        if (err) {
          return alert("An error occured while retrieving data");
        } else {
          _this.$(".graph-container").spin();
          _this.data = data;
          return _this.drawCharts();
        }
      });
    };

    BasicTrackerItem.prototype.redrawGraph = function() {
      return this.drawCharts();
    };

    BasicTrackerItem.prototype.drawCharts = function() {
      var graph, hoverDetail, width, x_axis, y_axis;
      console.log(this.model.get('color'));
      width = this.$(".graph-container").width() - 30;
      graph = new Rickshaw.Graph({
        element: this.$('.chart')[0],
        width: width,
        height: 300,
        renderer: 'bar',
        series: [
          {
            color: this.model.get('color'),
            data: this.data
          }
        ]
      });
      x_axis = new Rickshaw.Graph.Axis.Time({
        graph: graph
      });
      y_axis = new Rickshaw.Graph.Axis.Y({
        graph: graph,
        orientation: 'left',
        tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
        element: this.$('.y-axis')[0]
      });
      graph.render();
      hoverDetail = new Rickshaw.Graph.HoverDetail({
        graph: graph,
        xFormatter: function(x) {
          return moment(x * 1000).format('LL');
        },
        formatter: function(series, x, y) {
          return Math.floor(y);
        }
      });
      return graph;
    };

    return BasicTrackerItem;

  })(BaseView);
  
});
window.require.register("views/templates/basic_tracker_list", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  }
  return buf.join("");
  };
});
window.require.register("views/templates/basic_tracker_list_item", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div class="mod w33 left"><h2>' + escape((interp = model.name) == null ? '' : interp) + '</h2><p class="explaination">' + escape((interp = model.description) == null ? '' : interp) + '</p></div><div class="mod w66 left"><div class="graph-container"><div class="y-axis"></div><div class="chart"></div></div></div>');
  }
  return buf.join("");
  };
});
window.require.register("views/templates/home", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div id="content" class="pa2 trackers"><div class="line"><img src="icons/main_icon.png" style="height: 50px" class="mt3 ml1 right"/><h1 class="right"> <a href="http://frankrousseau.github.io/kyou/" target="_blank">Kantify YOU</a></h1></div><div class="line"><input id="datepicker"/></div><div id="mood" class="line"><div class="mod w33 left"><h2>Mood</h2><p class="explaination">The goal of this tracker is to help you\nunderstand what could influence your mood by comparing it\nto other trackers.</p><p id="current-mood">loading...</p><button id="good-mood-btn">good</button><button id="neutral-mood-btn">neutral</button><button id="bad-mood-btn">bad</button></div><div class="mod w66 left"><div id="moods" class="graph-container"><div id="moods-y-axis" class="y-axis"></div><div id="moods-charts" class="chart"></div></div></div></div></div><div class="tools line"><div id="add-tracker-widget"><h2>Create your tracker</h2><div class="line"><input id="add-tracker-name" placeholder="name"/></div><div class="line"><textarea id="add-tracker-description" placeholder="description"></textarea></div><div class="line"><button id="add-tracker-btn">add tracker</button></div></div></div>');
  }
  return buf.join("");
  };
});
window.require.register("views/templates/mood", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<p><' + (date) + '>- ' + escape((interp = status) == null ? '' : interp) + '</' + (date) + '></p>');
  }
  return buf.join("");
  };
});
window.require.register("views/templates/tracker_list", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  }
  return buf.join("");
  };
});
window.require.register("views/templates/tracker_list_item", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div class="mod w33 left"><h2>' + escape((interp = model.name) == null ? '' : interp) + '</h2><p class="explaination">' + escape((interp = model.description) == null ? '' : interp) + '</p><div class="current-amount">Set value for today</div><button class="up-btn">+ </button><button class="down-btn">-</button><p><button class="smaller remove-btn">remove tracker</button></p></div><div class="mod w66 left"><div class="graph-container"><div class="y-axis"></div><div class="chart"></div></div></div>');
  }
  return buf.join("");
  };
});
window.require.register("views/tracker_list", function(exports, require, module) {
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

    TrackerList.prototype.reloadAll = function() {
      var id, view, _ref1, _results;
      this.$(".tracker .chart").html('');
      this.$(".tracker .y-axis").html('');
      _ref1 = this.views;
      _results = [];
      for (id in _ref1) {
        view = _ref1[id];
        _results.push(view.afterRender());
      }
      return _results;
    };

    return TrackerList;

  })(ViewCollection);
  
});
window.require.register("views/tracker_list_item", function(exports, require, module) {
  var BaseView, TrackerItem, request, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseView = require('lib/base_view');

  request = require('lib/request');

  module.exports = TrackerItem = (function(_super) {
    __extends(TrackerItem, _super);

    function TrackerItem() {
      this.afterRender = __bind(this.afterRender, this);
      this.onRemoveClicked = __bind(this.onRemoveClicked, this);
      _ref = TrackerItem.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    TrackerItem.prototype.className = 'tracker line';

    TrackerItem.prototype.template = require('views/templates/tracker_list_item');

    TrackerItem.prototype.events = {
      'click .remove-btn': 'onRemoveClicked',
      'click .up-btn': 'onUpClicked',
      'click .down-btn': 'onDownClicked'
    };

    TrackerItem.prototype.onRemoveClicked = function() {
      var answer,
        _this = this;
      answer = confirm("Are you sure that you want to delete this tracker?");
      if (answer) {
        return this.model.destroy({
          success: function() {
            return _this.remove();
          },
          error: function() {
            return alert('something went wrong while removing tracker.');
          }
        });
      }
    };

    TrackerItem.prototype.afterRender = function() {
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
          return _this.getAnalytics();
        });
      };
      if (this.model.id != null) {
        return getData();
      } else {
        return setTimeout(getData, 1000);
      }
    };

    TrackerItem.prototype.onUpClicked = function(event) {
      var day,
        _this = this;
      day = window.app.mainView.currentDate;
      return this.model.getDay(day, function(err, amount) {
        var button, label;
        if (err) {
          alert('An error occured while retrieving data');
          return;
        } else if ((amount != null) && (amount.get('amount') != null)) {
          amount = amount.get('amount');
        } else {
          amount = 0;
        }
        amount++;
        label = _this.$('.current-amount');
        button = $(event.target);
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
        var button, label;
        if (err) {
          alert('An error occured while retrieving data');
        }
        if ((amount != null) && (amount.get('amount') != null)) {
          amount = amount.get('amount');
        } else {
          amount = 0;
        }
        if (amount > 0) {
          amount--;
        }
        label = _this.$('.current-amount');
        button = $(event.target);
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

    TrackerItem.prototype.getAnalytics = function() {
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
          return _this.drawCharts();
        }
      });
    };

    TrackerItem.prototype.redrawGraph = function() {
      return this.drawCharts();
    };

    TrackerItem.prototype.drawCharts = function() {
      var graph, hoverDetail, width, x_axis, y_axis;
      width = this.$(".graph-container").width() - 30;
      graph = new Rickshaw.Graph({
        element: this.$('.chart')[0],
        width: width,
        height: 300,
        renderer: 'bar',
        series: [
          {
            color: "black",
            data: this.data
          }
        ]
      });
      x_axis = new Rickshaw.Graph.Axis.Time({
        graph: graph
      });
      y_axis = new Rickshaw.Graph.Axis.Y({
        graph: graph,
        orientation: 'left',
        tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
        element: this.$('.y-axis')[0]
      });
      graph.render();
      hoverDetail = new Rickshaw.Graph.HoverDetail({
        graph: graph,
        xFormatter: function(x) {
          return moment(x * 1000).format('LL');
        },
        formatter: function(series, x, y) {
          return Math.floor(y);
        }
      });
      return graph;
    };

    return TrackerItem;

  })(BaseView);
  
});
