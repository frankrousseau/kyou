AppView = require 'views/app_view'

module.exports = class Router extends Backbone.Router

    routes:
        '': 'main'
        'basic-trackers/:name': 'basicTracker'
        'trackers/:name': 'tracker'
        'mood': 'mood'
        '*path': 'main'

    createMainView: ->
        unless window.app?.mainView?
            mainView = new AppView()
            mainView.render()
            window.app.router = @

    main: ->
        @createMainView()
        window.app.mainView.displayTrackers()

    basicTracker: (name) ->
        @createMainView()
        window.app.mainView.displayBasicTracker name

    tracker: (name) ->
        @createMainView()
        window.app.mainView.displayTracker name

    mood: (name) ->
        @createMainView()
        window.app.mainView.displayMood()
