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

    main: ->
        console.log "main"
        @createMainView()
        window.app.mainView.displayTrackers()

    basicTracker: (name) ->
        console.log "basic"
        @createMainView()
        window.app.mainView.displayBasicTracker name

    tracker: (name) ->
        console.log "tracker"
        @createMainView()
        window.app.mainView.displayTracker name

    mood: (name) ->
        console.log "mood"
        @createMainView()
        window.app.mainView.displayMood()
