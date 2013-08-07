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
      Router = require('router');
      this.router = new Router();
      Backbone.history.start();
      if (typeof Object.freeze === 'function') {
        return Object.freeze(this);
      }
    }
  };
  
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
      var collectionEl;
      ViewCollection.__super__.initialize.apply(this, arguments);
      this.views = {};
      this.listenTo(this.collection, "reset", this.onReset);
      this.listenTo(this.collection, "add", this.addItem);
      this.listenTo(this.collection, "remove", this.removeItem);
      if (this.collectionEl == null) {
        return collectionEl = el;
      }
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
      this.$collectionEl = $(this.collectionEl);
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
      view = new this.itemview(options);
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

    Mood.getLast = function(callback) {
      return request.get('moods/today/', function(err, mood) {
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

    Mood.updateLast = function(status, callback) {
      return request.put('moods/today/', {
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
      return mainView.render();
    };

    return Router;

  })(Backbone.Router);
  
});
window.require.register("views/app_view", function(exports, require, module) {
  var AppView, BaseView, Mood, Moods, request, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseView = require('../lib/base_view');

  Mood = require('../models/mood');

  Moods = require('../collections/moods');

  request = require('../lib/request');

  module.exports = AppView = (function(_super) {
    __extends(AppView, _super);

    function AppView() {
      _ref = AppView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    AppView.prototype.el = 'body.application';

    AppView.prototype.template = require('./templates/home');

    AppView.prototype.events = {
      'click #good-mood-btn': 'onGoodMoodClicked',
      'click #neutral-mood-btn': 'onNeutralMoodClicked',
      'click #bad-mood-btn': 'onBadMoodClicked'
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
      return Mood.updateLast(status, function(err, mood) {
        if (err) {
          return alert("An error occured while saving data");
        } else {
          return _this.$('#current-mood').html(status);
        }
      });
    };

    AppView.prototype.afterRender = function() {
      this.data = {};
      this.colors = {};
      this.loadMood();
      this.getAnalytics('moods', 'steelblue');
      this.getAnalytics('tasks', 'maroon');
      this.getAnalytics('mails', 'green');
      return $(window).on("resize", this.redrawCharts());
    };

    AppView.prototype.loadMood = function() {
      var _this = this;
      return Mood.getLast(function(err, mood) {
        if (err) {
          return alert("An error occured while retrieving data");
        } else if (mood == null) {
          return _this.$('#current-mood').html('Set your mood for today');
        } else {
          return _this.$('#current-mood').html(mood.get('status'));
        }
      });
    };

    AppView.prototype.getAnalytics = function(dataType, color) {
      var _this = this;
      return request.get(dataType, function(err, data) {
        var chartId, width, yAxisId;
        if (err) {
          return alert("An error occured while retrieving " + dataType + " data");
        } else {
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
      var chartId, color, data, dataType, width, yAxisId, _ref1, _results;
      _ref1 = this.data;
      _results = [];
      for (dataType in _ref1) {
        data = _ref1[dataType];
        width = $("#" + dataType).width() - 30;
        chartId = "" + dataType + "-charts";
        yAxisId = "" + dataType + "-y-axis";
        color = this.colors[dataType];
        $("" + dataType).html('');
        _results.push(this.drawCharts(data, chartId, yAxisId, color, width));
      }
      return _results;
    };

    AppView.prototype.drawCharts = function(data, chartId, yAxisId, color, width) {
      var graph, x_axis, y_axis;
      console.log(width);
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
      return graph;
    };

    return AppView;

  })(BaseView);
  
});
window.require.register("views/templates/home", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div id="content" class="pa2"><div class="line"><h1 class="right">Kantify YOU</h1></div><div id="mood" class="line"><div class="mod w33 left"><h2>Mood</h2><p class="explaination">The mood is the main thing to track with Kyou. The main goal\nof Kyou is tp help you\nto understand what could influence your mood.</p><p id="current-mood">\'loading...\'</p><button id="good-mood-btn">good</button><button id="neutral-mood-btn">neutral</button><button id="bad-mood-btn">bad</button></div><div class="mod w66 left"><div id="moods" class="graph-container"><div id="moods-y-axis" class="y-axis"></div><div id="moods-charts" class="chart"></div></div></div></div><div id="task" class="line"><div class="mod w33 left"><h2>Tasks</h2><p class="explaination">This tracker counts the tasks marked as done in\nyour Cozy. The date used to build the graph is the completion\ndate</p></div><div class="mod w66 left"><div id="tasks" class="graph-container"><div id="tasks-y-axis" class="y-axis"></div><div id="tasks-charts" class="chart"></div></div></div></div><div id="mail" class="line"><div class="mod w33 left"><h2>Mails</h2><p class="explaination">This tracker counts the amount of mails you received \nin your mailbox everyday.</p></div><div class="mod w66 left"><div id="mails" class="graph-container"><div id="mails-y-axis" class="y-axis"></div><div id="mails-charts" class="chart"></div></div></div></div></div>');
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
window.require.register("views/templates/task", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<p><' + (date) + '>- ' + escape((interp = nbTasks) == null ? '' : interp) + '</' + (date) + '></p>');
  }
  return buf.join("");
  };
});
