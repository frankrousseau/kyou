request = require '../lib/request'
graphHelper = require '../lib/graph'
BaseView = require '../lib/base_view'

Tracker = require '../models/tracker'
DailyNote = require '../models/dailynote'

MoodTracker = require './mood_tracker'
TrackerList = require './tracker_list'
BasicTrackerList = require './basic_tracker_list'

module.exports = class AppView extends BaseView

    el: 'body.application'
    template: require('./templates/home')

    events:
        'change #datepicker': 'onDatePickerChanged'
        'blur #dailynote': 'onDailyNoteChanged'
        'click #add-tracker-btn': 'onTrackerButtonClicked'
        'change #zoomtimeunit': 'onTimeUnitChanged'

    constructor: ->
        super
        @currentDate = moment()

    getRenderData: =>
        currentDate: @currentDate.format 'MM/DD/YYYY'

    afterRender: ->
        @data = {}
        @colors = {}
        $(window).on 'resize',  @redrawCharts
        window.app = {}
        window.app.mainView = @

        @moodTracker = new MoodTracker()
        @$('#content').append @moodTracker.$el
        @moodTracker.render()

        @trackerList = new TrackerList()
        @$('#content').append @trackerList.$el
        @trackerList.render()

        @basicTrackerList = new BasicTrackerList()
        @$('#content').append @basicTrackerList.$el
        @basicTrackerList.render()

        @$("#datepicker").datepicker maxDate: "+0D"
        @$("#datepicker").val @currentDate.format('LL'), trigger: false

        @loadNote()
        @moodTracker.reload()


    onDatePickerChanged: ->
        @currentDate = moment @$("#datepicker").val()
        @loadNote()
        @loadAnalytics()


    loadAnalytics: ->
        @moodTracker.reload()
        @basicTrackerList.reloadAll() if @trackerList?
        @trackerList.reloadAll() if @trackerList?


    redrawCharts: =>
        $('.chart').html null
        $('.y-axis').html null
        @moodTracker.redraw()
        @trackerList.redrawAll()
        @basicTrackerList.redrawAll()
        true

    # View management

    showTrackers: =>
        @$("#mood").show()
        @$("#tracker-list").show()
        @$("#basic-tracker-list").show()
        @$(".tools").show()
        @$("#zoomtracker").hide()


    showZoomTracker: =>
        @$("#mood").hide()
        @$("#tracker-list").hide()
        @$("#basic-tracker-list").hide()
        @$(".tools").hide()
        @$("#zoomtracker").show()


    displayTrackers: ->
        @showTrackers()
        @loadTrackers() unless @dataLoaded



    ## Note Widget

    onDailyNoteChanged: (event) ->
        text = @$("#dailynote").val()
        DailyNote.updateDay @currentDate, text, (err, mood) =>
            if err
                alert "An error occured while saving note of the day"


    loadNote: ->
        DailyNote.getDay @currentDate, (err, dailynote) =>
            if err
                alert "An error occured while retrieving daily note data"
            else if not dailynote?
                @$('#dailynote').val null
            else
                @$('#dailynote').val dailynote.get 'text'


    ## Tracker creation widget

    onTrackerButtonClicked: ->
        name = $('#add-tracker-name').val()
        description = $('#add-tracker-description').val()

        if name.length > 0
            @trackerList.collection.create(
                    name: name,
                    description: description
                ,
                    success: ->
                    error: ->
                        alert 'A server error occured while saving your tracker'
            )


    loadTrackers: (callback) ->
        @dataLoaded = false
        @trackerList.collection.fetch
            success: =>
                @basicTrackerList.collection.fetch
                    success: =>
                        @dataLoaded = true
                        callback() if callback?


    ## Zoom widgeT

    displayZoomTracker: (callback) ->
        if @dataLoaded
            @showZoomTracker()
            callback()
        else
            @loadTrackers =>
                @showZoomTracker()
                callback()

    displayMood: ->
        @displayZoomTracker =>
            @$("#zoomtitle").html @$("#mood h2").html()
            @$("#zoomexplaination").html @$("#mood .explaination").html()

            @currentData = @moodTracker.data
            @currentTracker = new Tracker
                name: 'moods'
                color: 'steelblue'
            @printZoomGraph @currentData, 'steelblue'

    displayBasicTracker: (slug) ->
        @displayZoomTracker =>
            tracker = @basicTrackerList.collection.findWhere slug: slug
            unless tracker?
                alert "Tracker does not exist"
            else
                @$("#zoomtitle").html tracker.get 'name'
                @$("#zoomexplaination").html tracker.get 'description'

                @currentData = @basicTrackerList.views[tracker.cid]?.data
                @currentTracker = tracker
                @printZoomGraph @currentData, tracker.get 'color'

    displayTracker: (id) ->
        @displayZoomTracker =>
            tracker = @trackerList.collection.findWhere id: id
            unless tracker?
                alert "Tracker does not exist"
            else
                @$("#zoomtitle").html tracker.get 'name'
                @$("#zoomexplaination").html tracker.get 'description'

                @currentData = @trackerList.views[tracker.cid]?.data
                @currentTracker = tracker
                @printZoomGraph @currentData, tracker.get 'color'


    onTimeUnitChanged: (event) ->
        timeUnit = $("#zoomtimeunit").val()

        if timeUnit is 'day'
            graphDataArray = @currentData

        else
            data = @currentData
            graphData = {}

            if timeUnit is 'week'
                data = {}
                for entry in @currentData
                    date = moment new Date(entry.x * 1000)
                    date = date.day 1
                    epoch = date.unix()

                    if graphData[epoch]?
                        graphData[epoch] += entry.y
                    else
                        graphData[epoch] = entry.y

            else if timeUnit is 'month'
                data = {}
                for entry in @currentData
                    date = moment new Date(entry.x * 1000)
                    date = date.date 1
                    epoch = date.unix()

                    if graphData[epoch]?
                        graphData[epoch] += entry.y
                    else
                        graphData[epoch] = entry.y

            graphDataArray = []
            for epoch, value of graphData
                graphDataArray.push
                    x: parseInt(epoch)
                    y: value

        @printZoomGraph graphDataArray, @currentTracker.get 'color'

    printZoomGraph: (data, color) ->
        width = $(window).width() - 100
        el = @$('#zoom-charts')[0]
        yEl = @$('#zoom-y-axis')[0]

        graphHelper.clear el, yEl
        graphHelper.draw el, yEl, width, color, data
