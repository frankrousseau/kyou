request = require '../lib/request'
graphHelper = require '../lib/graph'
BaseView = require '../lib/base_view'

Tracker = require '../models/tracker'
DailyNote = require '../models/dailynote'
DailyNotes = require '../collections/dailynotes'

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
        'change #zoomtimeunit': 'onComparisonChanged'
        'change #zoomstyle': 'onComparisonChanged'
        'change #zoomcomparison': 'onComparisonChanged'

    constructor: ->
        super
        @currentDate = moment()

    getRenderData: =>
        currentDate: @currentDate.format 'MM/DD/YYYY'

    afterRender: ->
        @colors = {}
        @data = {}
        @dataLoaded = false

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


    onDatePickerChanged: ->
        @currentDate = moment @$("#datepicker").val()
        @$("#datepicker").val @currentDate.format('LL'), trigger: false
        @loadNote()
        @moodTracker.reload =>
            @trackerList.reloadAll =>
                @basicTrackerList.reloadAll =>
                    if @$("#zoomtracker").is(":visible")
                        if @currentTracker is @moodTracker
                            @currentData = @moodTracker.data
                        else
                            tracker = @currentTracker
                            trackerView = @basicTrackerList.views[tracker.cid]
                            unless trackerView?
                                trackerView = @trackerList.views[tracker.cid]
                            @currentData = trackerView?.data
                        @onComparisonChanged()


    # View management

    showTrackers: =>
        @$("#moods").show()
        @$("#tracker-list").show()
        @$("#basic-tracker-list").show()
        @$(".tools").show()
        @$("#zoomtracker").hide()

        @redrawCharts() if @dataLoaded


    showZoomTracker: =>
        @$("#moods").hide()
        @$("#tracker-list").hide()
        @$("#basic-tracker-list").hide()
        @$(".tools").hide()
        @$("#zoomtracker").show()

        @$("#zoomtimeunit").val 'day'


    displayTrackers: ->
        @showTrackers()
        @loadTrackers() unless @dataLoaded


    redrawCharts: =>
        $('.chart').html null
        $('.y-axis').html null

        if @$("#zoomtracker").is(":visible")
            @onComparisonChanged()

        else
            @moodTracker.redraw()
            @trackerList.redrawAll()
            @basicTrackerList.redrawAll()

        true


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

        @notes = new DailyNotes
        @notes.fetch
            success: -> console.log 'cool'


    ## Tracker creation widget

    onTrackerButtonClicked: ->
        name = $('#add-tracker-name').val()
        description = $('#add-tracker-description').val()

        if name.length > 0
            @trackerList.collection.create(
                    name: name
                    description: description
                ,
                    success: ->
                    error: ->
                        alert 'A server error occured while saving your tracker'
            )


    loadTrackers: (callback) ->
        @dataLoaded = false
        @moodTracker.reload =>
            @trackerList.collection.fetch
                success: =>
                    @basicTrackerList.collection.fetch
                        success: =>
                            @dataLoaded = true
                            @fillComparisonCombo()
                            callback() if callback?

    ## Zoom widget

    fillComparisonCombo: ->
        combo = @$("#zoomcomparison")
        combo.append "<option value=\"undefined\">Select the tracker to compare</option>"
        combo.append "<option value=\"moods\">Moods</option>"

        for tracker in @trackerList.collection.models
            option = "<option value="
            option += "\"#{tracker.get 'id'}\""
            option += ">#{tracker.get 'name'}</option>"
            combo.append option

        for tracker in @basicTrackerList.collection.models
            option = "<option value="
            option += "\"basic-#{tracker.get 'slug'}\""
            option += ">#{tracker.get 'name'}</option>"
            combo.append option


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
            @$("#zoomtitle").html @$("#moods h2").html()
            @$("#zoomexplaination").html @$("#moods .explaination").html()

            @currentData = @moodTracker.data
            @currentTracker = @moodTracker

            @printZoomGraph @currentData, 'steelblue'

    displayBasicTracker: (slug) ->
        @displayZoomTracker =>
            tracker = @basicTrackerList.collection.findWhere slug: slug
            unless tracker?
                alert "Tracker does not exist"
            else
                @$("#zoomtitle").html tracker.get 'name'
                @$("#zoomexplaination").html tracker.get 'description'

                recWait = =>
                    data = @basicTrackerList.views[tracker.cid]?.data

                    if data?
                        @currentData = data
                        @currentTracker = tracker
                        @printZoomGraph @currentData, tracker.get 'color'
                    else
                        setTimeout recWait, 10
                recWait()

    displayTracker: (id) ->
        @displayZoomTracker =>
            tracker = @trackerList.collection.findWhere id: id
            unless tracker?
                alert "Tracker does not exist"
            else
                @$("#zoomtitle").html tracker.get 'name'
                @$("#zoomexplaination").html tracker.get 'description'

                recWait = =>
                    data = @trackerList.views[tracker.cid]?.data

                    if data?
                        @currentData = data
                        @currentTracker = tracker
                        @printZoomGraph @currentData, tracker.get 'color'
                    else
                        setTimeout recWait, 10
                recWait()

    onComparisonChanged: =>
        val = @$("#zoomcomparison").val()
        timeUnit = $("#zoomtimeunit").val()
        graphStyle = $("#zoomstyle").val()
        data = @currentData
        time = true

        # Define comparison
        if val is 'moods'
            comparisonData = @moodTracker.data

        else if val.indexOf('basic') isnt -1
            tracker = @basicTrackerList.collection.findWhere
                slug: val.substring(6)
            comparisonData = @basicTrackerList.views[tracker.cid]?.data

        else if val isnt "undefined"
            tracker = @trackerList.collection.findWhere id: val
            comparisonData = @trackerList.views[tracker.cid]?.data

        else
            comparisonData = null

        # Define timeUnit
        if timeUnit is 'week'
            data = graphHelper.getWeekData data
            if comparisonData?
                comparisonData = graphHelper.getWeekData comparisonData

        else if timeUnit is 'month'
            data = graphHelper.getMonthData data
            if comparisonData?
                comparisonData = graphHelper.getMonthData comparisonData

        if graphStyle is 'correlation' and comparisonData?
            data = graphHelper.mixData data, comparisonData

            comparisonData = null
            graphStyle = 'scatterplot'
            time = false

        # Normalize data
        if comparisonData?
            comparisonData = graphHelper.normalizeComparisonData(
                data, comparisonData)

        # Chose color
        if comparisonData?
            color = 'black'
        else if @currentTracker is @moodTracker
            color = 'steelblue'
        else
            color = @currentTracker.get 'color'

        @printZoomGraph data, color, graphStyle, comparisonData, time

    printZoomGraph: (data, color, graphStyle='line', comparisonData, time) ->
        width = $(window).width() - 140
        el = @$('#zoom-charts')[0]
        yEl = @$('#zoom-y-axis')[0]

        graphHelper.clear el, yEl
        graph = graphHelper.draw(
            el, yEl, width, color, data, graphStyle, comparisonData, time)

        timelineEl = @$('#timeline')[0]
        console.log timelineEl

        element: @$('#timeline').html(null)
        annotator = new Rickshaw.Graph.Annotate
            graph: graph
            element: @$('#timeline')[0]

        for note in @notes.models
            date = moment(note.get 'date').valueOf() / 1000
            annotator.add date, note.get 'text'

        annotator.update()
