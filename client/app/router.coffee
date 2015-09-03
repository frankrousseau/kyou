AppView = require 'views/app_view'
MainState = require './main_state'


module.exports = class Router extends Backbone.Router


    routes:
        '': 'main'
        'main/:startDate/:endDate': 'mainDate'
        'basic-trackers/:name': 'basicTracker'
        'basic-trackers/:name/:startDate/:endDate': 'basicTrackerDate'
        'trackers/:name': 'tracker'
        'mood': 'mood'
        '*path': 'main'


    createMainView: (startDate, endDate) ->
        unless window.app?.mainView?
            mainView = new AppView {startDate, endDate}
            mainView.render()
            window.app = {}
            window.app.router = @
            window.app.mainView = mainView


    main: ->
        @createMainView()
        window.app.mainView.displayTrackers()


    mainDate: (startDate, endDate) ->
        @createMainView startDate, endDate
        window.app.mainView.displayTrackers()


    basicTracker: (name) ->
        @createMainView()
        window.app.mainView.displayBasicTracker name


    basicTrackerDate: (name, startDate, endDate) ->
        @createMainView startDate, endDate
        window.app.mainView.displayBasicTracker name


    navigateZoom: ->
        @navigate isMain: false, trigger: true


    navigateHome: ->
        @navigate isMain: true, trigger: true


    resetHash: ->
        @navigate isMain: false, trigger: false


    navigate: (options) ->
        {isMain, trigger} = options

        if isMain
            view = MainState.currentView
        else
            view = 'main'
        start = MainState.startDate.format 'YYYY-MM-DD'
        end = MainState.endDate.format 'YYYY-MM-DD'
        window.app.router.navigate "##{view}/#{start}/#{end}", trigger: trigger


    tracker: (name) ->
        @createMainView()
        window.app.mainView.displayTracker name


    mood: (name) ->
        @createMainView()
        window.app.mainView.displayMood()

