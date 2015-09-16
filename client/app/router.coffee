AppView = require 'views/app_view'
MainState = require './main_state'


module.exports = class Router extends Backbone.Router


    routes:
        '': 'main'
        'main/:startDate/:endDate': 'mainDate'
        'mood/:startDate/:endDate': 'moodDate'
        'basic-trackers/:name': 'basicTracker'
        'basic-trackers/:name/:startDate/:endDate': 'basicTrackerDate'
        'trackers/:name': 'tracker'
        'trackers/:name/:startDate/:endDate': 'trackerDate'
        'mood': 'mood'
        'add-tracker': 'addTracker'
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
        @navigateTo isMain: false, trigger: true


    navigateHome: ->
        @navigateTo isMain: true, trigger: true


    resetHash: ->
        @navigateTo isMain: false, trigger: false


    navigateTo: (options) ->
        {isMain, trigger} = options

        if isMain
            view = 'main'
        else
            view = MainState.currentView
        start = MainState.startDate.format 'YYYY-MM-DD'
        end = MainState.endDate.format 'YYYY-MM-DD'
        window.app.router.navigate "##{view}/#{start}/#{end}", trigger: trigger


    mood: (name) ->
        @createMainView()
        view = 'mood'
        start = MainState.startDate.format 'YYYY-MM-DD'
        end = MainState.endDate.format 'YYYY-MM-DD'
        window.app.router.navigate "##{view}/#{start}/#{end}", trigger: true


    moodDate: (name) ->
        @createMainView()

        window.app.mainView.displayMood()


    tracker: (name) ->
        @createMainView()
        view = 'mood'
        start = MainState.startDate.format 'YYYY-MM-DD'
        end = MainState.endDate.format 'YYYY-MM-DD'
        window.app.router.navigate "#trackers/#{name}/#{start}/#{end}",
            trigger: true


    trackerDate: (name) ->
        @createMainView()
        window.app.mainView.displayTracker name


    addTracker: (name) ->
        @createMainView()
        window.app.mainView.displayAddTracker()

