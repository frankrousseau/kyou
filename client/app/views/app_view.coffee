request = require '../lib/request'
graphHelper = require '../lib/graph'
BaseView = require '../lib/base_view'

Mood = require '../models/mood'
Tracker = require '../models/tracker'
DailyNote = require '../models/dailynote'
Moods = require '../collections/moods'

TrackerList = require './tracker_list'
BasicTrackerList = require './basic_tracker_list'

module.exports = class AppView extends BaseView

    el: 'body.application'
    template: require('./templates/home')

    events:
        'click #good-mood-btn': 'onGoodMoodClicked'
        'click #neutral-mood-btn': 'onNeutralMoodClicked'
        'click #bad-mood-btn': 'onBadMoodClicked'
        'click #add-tracker-btn': 'onTrackerButtonClicked'
        'change #datepicker': 'onDatePickerChanged'
        'blur #dailynote': 'onDailyNoteChanged'
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

        @loadNote()
        @loadBaseAnalytics()

        @trackerList = new TrackerList()
        @$('#content').append @trackerList.$el
        @trackerList.render()

        @basicTrackerList = new BasicTrackerList()
        @$('#content').append @basicTrackerList.$el
        @basicTrackerList.render()

        @$("#datepicker").datepicker maxDate: "+0D"
        @$("#datepicker").val @currentDate.format('LL'), trigger: false

    onDatePickerChanged: ->
        @currentDate = moment @$("#datepicker").val()
        @loadNote()
        @loadBaseAnalytics()
        @$("#datepicker").val @currentDate.format('LL'), trigger: false

    loadBaseAnalytics: ->
        @loadMood()
        @getMoodAnalytics()
        @basicTrackerList.reloadAll() if @trackerList?
        @trackerList.reloadAll() if @trackerList?

    onGoodMoodClicked: -> @updateMood 'good'
    onNeutralMoodClicked: -> @updateMood 'neutral'
    onBadMoodClicked: -> @updateMood 'bad'

    updateMood: (status) ->
        @$('#current-mood').html '&nbsp;'
        @$('#current-mood').spin 'tiny'
        Mood.updateDay @currentDate, status, (err, mood) =>
            if err
                @$('#current-mood').spin()
                alert "An error occured while saving data"
            else
                @$('#current-mood').spin()
                @$('#current-mood').html status
                graphHelper.clear @$('#moods-charts'), @$('#moods-y-axis')
                @getMoodAnalytics()

    loadMood: ->
        Mood.getDay @currentDate, (err, mood) =>
            if err
                alert "An error occured while retrieving mood data"
            else if not mood?
                @$('#current-mood').html 'Set your mood for current day'
            else
                @$('#current-mood').html mood.get 'status'

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

    drawMoodGraph: (data) ->
        width = @$("#moods").width() - 70
        el = @$("#moods-charts")[0]
        yEl = @$("#moods-y-axis")[0]
        @data['moods'] = data
        graphHelper.draw el, yEl, width, 'steelblue', data


    getMoodAnalytics: ->
        @$("#moods-charts").html ''
        @$("#moods-y-axis").html ''
        @$("#moods").spin 'tiny'
        path = "moods/#{@currentDate.format 'YYYY-MM-DD'}"
        request.get path, (err, data) =>
            if err
                alert "An error occured while retrieving moods data"
            else
                $("#moods").spin()
                @drawMoodGraph data


    redrawCharts: =>
        $('.chart').html null
        $('.y-axis').html null
        @drawMoodGraph()
        @trackerList.redrawAll()
        @basicTrackerList.redrawAll()
        true


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

            @currentData = @data['moods']
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
