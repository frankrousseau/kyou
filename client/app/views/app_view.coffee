graphHelpers = require '../lib/graph'
BaseView = require '../lib/base_view'

Tracker = require '../models/tracker'
MoodTrackerModel = require '../models/mood_tracker'
Zoom = require '../models/zoom'
DailyNote = require '../models/dailynote'
DailyNotes = require '../collections/dailynotes'

ZoomView = require './zoom'
MoodTracker = require './mood_tracker'
TrackerList = require './tracker_list'
BasicTrackerList = require './basic_tracker_list'
AddTrackerView = require './add_tracker'
AddBasicTrackerList = require './add_basic_tracker_list'

RawDataTable = require './raw_data_table'

MainState = require '../main_state'

{DATE_FORMAT, SHORT_DATE_FORMAT, DATE_URL_FORMAT} = require '../lib/constants'


module.exports = class AppView extends BaseView

    el: 'body.application'
    template: require('./templates/home')

    events:
        'change #datepicker': 'onDatePickerChanged'
        'click .date-previous': 'onPreviousClicked'
        'click .date-next': 'onNextClicked'
        'click .reload': 'onReloadClicked'
        'click #show-data-btn': 'onShowDataClicked'


    subscriptions:
        'start-date:change': 'onStartDateChanged'
        'end-date:change': 'onEndDateChanged'
        'basic-tracker:add': 'onTrackerAdded'
        'tracker:add': 'onTrackerAdded'


    constructor: (options) ->
        super

        MainState ?= {}
        {startDate, endDate} = options
        @initDates startDate, endDate


    initDates: (startDate, endDate) ->

        if startDate
            MainState.startDate = moment startDate, DATE_URL_FORMAT
        else
            MainState.startDate = moment()
            MainState.startDate = MainState.startDate.subtract 'month', 6

        if endDate
            MainState.endDate = moment endDate, DATE_URL_FORMAT
        else
            MainState.endDate = moment()

        @currentDate = MainState.endDate


    getRenderData: =>
        if not graphHelpers.isSmallScreen()
            data =
                startDate: MainState.startDate.format SHORT_DATE_FORMAT
                endDate: MainState.endDate.format SHORT_DATE_FORMAT
        else
            data =
                startDate: MainState.startDate.format SHORT_DATE_FORMAT
                endDate: MainState.endDate.format SHORT_DATE_FORMAT
        console.log data
        data


    afterRender: ->
        @colors = {}
        @data = {}
        MainState.dataLoaded = false

        $(window).on 'resize',  @redrawCharts
        @initDatePickers()

        @addTrackerButton = @$ '#add-tracker-button'
        @welcomeMessage = @$ '.welcome-message'
        @welcomeMessage.hide()

        #@rawDataTable = new RawDataTable()
        #@rawDataTable.render()
        #@$('#raw-data').append @rawDataTable.$el

        # Mood

        moodTracker = new MoodTrackerModel
            slug: 'mood'
            name: 'Mood'
            color: '#039BE5'
            metadata: {}
            description: """ The goal of this tracker is to help you
            understand what could influence your mood by comparing it to
            other trackers.
            """
        @moodTracker = new MoodTracker moodTracker
        @$('#mood-section').append @moodTracker.$el
        @moodTracker.render()


        # Trackers
        @trackerList = new TrackerList()
        @trackerList.render()
        @$('#content').append @trackerList.$el


        # Basic trackers
        @basicTrackerList = new BasicTrackerList()
        @$('#content').append @basicTrackerList.$el
        @basicTrackerList.render()


        # Add tracker buttons
        #
        # Zoom widget

        zoom = new Zoom
        @zoomView = new ZoomView(
            zoom,
            @basicTrackerList.collection,
            @moodTracker.model,
            @trackerList.collection
        )
        @zoomView.render()
        @zoomView.hide()

        @addTrackerView = new AddTrackerView(
            zoom,
            @basicTrackerList.collection,
            @moodTracker.model,
            @trackerList.collection
        )
        @addTrackerView.render()
        @addTrackerView.hide()


    initDatePickers: ->
        now = new Date()
        if not graphHelpers.isSmallScreen()
            format = DATE_FORMAT
        else
            format = SHORT_DATE_FORMAT

        $('#datepicker-start').pikaday
            maxDate: now
            format: format
            defaultDate: MainState.startDate.toDate()
            setDefaultDate: true
            onSelect: (value) ->
                Backbone.Mediator.publish 'start-date:change', value

        $('#datepicker-end').pikaday
            maxDate: now
            defaultDate: MainState.endDate.toDate()
            format: format
            onSelect: (value) ->
                Backbone.Mediator.publish 'end-date:change', value


    onStartDateChanged: (date) ->
        MainState.startDate = moment date
        @loadTrackers =>
            @zoomView.reload()
        @resetRouteHash()


    onEndDateChanged: (date) ->
        MainState.endDate = moment date
        @loadTrackers =>
            @zoomView.reload()
        @resetRouteHash()


    resetRouteHash: ->
        window.app.router.resetHash()


    loadTrackers: (callback) ->
        MainState.dataLoaded = false
        @moodTracker.load =>
            @trackerList.load =>
                @basicTrackerList.load =>
                    MainState.dataLoaded = true
                    if @trackerList.isEmpty() and @basicTrackerList.isEmpty()
                        @welcomeMessage.show()
                    callback?()


    reloadAll: ->
        @moodTracker.reload =>
            @basicTrackerList.reloadAll =>
                @trackerList.reloadAll =>


    hideMain: ->
        @basicTrackerList.hide()
        @trackerList.hide()
        @moodTracker.hide()
        @welcomeMessage.hide()
        @addTrackerView.hide()
        @addTrackerButton.hide()


    showMain: ->
        @basicTrackerList.show()
        @trackerList.show()
        @moodTracker.show()
        @welcomeMessage.hide()
        @addTrackerView.hide()
        @addTrackerButton.show()


    displayAddTracker: ->
        @zoomView.hide()
        @hideMain()
        @addTrackerView.show()
        @trackerList.hide()
        $(document).scrollTop 0


    displayTrackers: ->
        MainState.currentView = 'main'
        @showMain()
        @redrawCharts()
        @zoomView.hide()
        @loadTrackers() unless MainState.dataLoaded
        $(document).scrollTop 0


    displayMood: ->
        MainState.currentView = "mood"
        @hideMain()
        @displayZoomTracker 'mood', =>


    displayTracker: (id) ->
        MainState.currentView = id
        @hideMain()
        @displayZoomTracker id


    displayBasicTracker: (slug) ->
        MainState.currentView = "basic-trackers/#{slug}"
        @hideMain()
        @displayZoomTracker slug, =>


    displayZoomTracker: (slug, callback) ->
        if MainState.dataLoaded
            @zoomView.show slug
            $(document).scrollTop 0
            callback?()
        else
            @loadTrackers =>
                @zoomView.show slug
                $(document).scrollTop 0
                callback?()

    redrawCharts: =>
        $('.chart').html(null)
        $('.y-axis').html(null)
        @zoomView.onComparisonChanged()

        @moodTracker.redraw()
        @trackerList.redrawAll()
        @basicTrackerList.redrawAll()

        true

    onTrackerAdded: ->
        @welcomeMessage.hide()

