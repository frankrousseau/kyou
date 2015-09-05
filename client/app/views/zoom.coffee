BaseView = require 'lib/base_view'
request = require 'lib/request'
graphHelper = require '../lib/graph'
calculus = require 'lib/calculus'

MainState = require '../main_state'


# Item View for the albums list
module.exports = class ZoomView extends BaseView
    className: ''
    el: '#zoom-view'
    template: require 'views/templates/zoom'


    events:
        'blur input.zoomtitle': 'onCurrentTrackerChanged'
        'blur textarea.zoomexplaination': 'onCurrentTrackerChanged'
        'change #zoomtimeunit': 'onComparisonChanged'
        'change #zoomstyle': 'onStyleChanged'
        'change #zoomcomparison': 'onComparisonChanged'
        'keyup #zoomgoal': 'onGoalChanged'
        'click #remove-btn': 'onRemoveClicked'
        'click #back-trackers-btn': 'onBackTrackersClicked'


    constructor: (@model, @basicTrackers) ->
        super


    afterRender: ->
        @$('#zoom-correlation-option').hide()
        @$('#zoomgoal').numeric()


    show: (slug) ->
        super
        tracker = @basicTrackers.findWhere slug: slug

        unless tracker?
            alert "Tracker does not exist"

        else
            @model.set 'tracker', tracker
            @prefillFields tracker
            @setEditMode()
            @displayData tracker
        @$el.scrollTop()


    prefillFields: (tracker) ->
        @$("h2.zoomtitle").html tracker.get 'name'
        @$("p.zoomexplaination").html tracker.get 'description'
        @$("#zoomstyle").val tracker.get('metadata').style or 'bar'
        @$("#zoomgoal").val tracker.get('metadata').goal or '0'
        @fillComparisonCombo()


    fillComparisonCombo: ->

        if @$("#zoomcomparison option").length < 1
            console.log 'cool'
            combo = @$ "#zoomcomparison"
            combo.append """
    <option value=\"undefined\">no comparison</option>"
    """
#combo.append "<option value=\"moods\">Moods</option>"

        #for tracker in @trackerList.collection.models
            #option = "<option value="
            #option += "\"#{tracker.get 'id'}\""
            #option += ">#{tracker.get 'name'}</option>"
            #combo.append option

            for tracker in @basicTrackers.models
                option = "<option value="
                option += "\"basic-#{tracker.get 'slug'}\""
                option += ">#{tracker.get 'name'}</option>"
                combo.append option


    setEditMode: ->
        @$("h2.zoomtitle").show()
        @$("p.zoomexplaination").show()
        @$("input.zoomtitle").hide()
        @$("textarea.zoomexplaination").hide()
        @$("#show-data-section").hide()


    displayData: (tracker) ->
        data = MainState.data[tracker.get 'slug']
        @showAverage data
        @showEvolution data
        @printZoomGraph data, tracker.get 'color'


    reload: ->
        tracker = @model.get 'tracker'
        if tracker?
            data = MainState.data[tracker.get 'slug']
            @printZoomGraph data, tracker.get 'color'


    showAverage: (data) ->
        @$("#average-value").html calculus.average data


    showEvolution: (data) ->

        evolution = 0
        if data
            if not data.length in [0, 1]
                length = data.length
                if data.length < 14
                    middle = Math.round(length / 2)
                else
                    middle = 7

                newTrend = 0
                i = middle
                while i > 0
                    newTrend += data[length - i - 1].y
                    i--

                oldTrend = 0
                i = middle
                while i > 0
                    oldTrend += data[length - middle - i].y
                    i--

                if oldTrend isnt 0
                    evolution =  (newTrend / oldTrend) * 100 - 100
                else
                    evolution = 0

        evolution = Math.round(evolution * 100) / 100
        @$("#evolution-value").html evolution + " %"


    printZoomGraph: (data, color, graphStyle, comparisonData, time, goal) ->
        if data?
            graphStyle ?= @$("#zoomstyle").val() or 'bar'
            goal ?= @$("#zoomgoal").val() or null

            width = $(window).width() - 140
            el = @$('#zoom-charts')[0]
            yEl = @$('#zoom-y-axis')[0]

            graphHelper.clear el, yEl
            graph = graphHelper.draw {
                el, yEl, width, color, data,
                graphStyle, comparisonData, time, goal
            }
            timelineEl = @$('#timeline')[0]
            @$('#timeline').html null

            annotator = new Rickshaw.Graph.Annotate
                graph: graph
                element: @$('#timeline')[0]

        #for note in @notes.models
            #date = moment(note.get 'date').valueOf() / 1000
            #annotator.add date, note.get 'text'

            #annotator.update()


    onRemoveClicked: =>
        tracker = @model.get('tracker')
        slug = tracker.get 'slug'
        data =
            hidden: true
        request.put "basic-trackers/#{slug}", data, (err) ->

        tracker.setMetadata 'hidden', true
        Backbone.Mediator.pub 'tracker:removed', slug

        window.app.router.navigateHome()


    onBackTrackersClicked: (event) =>
        window.app.router.navigateHome()
        event.preventDefault()


    onStyleChanged: =>
        style = @$("#zoomstyle").val()

        if style in ['bar', 'line', 'scatterplot']
            tracker = @model.get('tracker')
            slug = tracker.get 'slug'
            data =
                style: style
            tracker.setMetadata 'style', data.style
            request.put "basic-trackers/#{slug}", data, (err) ->

        @onComparisonChanged()


    onGoalChanged: =>
        tracker = @model.get('tracker')
        slug = tracker.get 'slug'
        data =
            goal: parseInt @$("#zoomgoal").val()
        tracker.setMetadata 'goal', data.goal

        @onComparisonChanged()
        request.put "basic-trackers/#{slug}", data, (err) ->


    onComparisonChanged: =>
        val = @$("#zoomcomparison").val()
        timeUnit = @$("#zoomtimeunit").val()
        graphStyle = @$("#zoomstyle").val()

        tracker = @model.get 'tracker'
        data = MainState.data[tracker.get 'slug']
        time = true # true if x axis should show dates.

        # Check if it's a comparison.
        if val.indexOf('basic') isnt -1
            slug = val.substring 6
            comparisonData = MainState.data[slug]
            @$('#zoom-bar-option').hide()
            @$('#zoom-correlation-option').show()
            if graphStyle is 'bar'
                graphStyle = 'line'
                @$("#zoomstyle").val 'line'

        else
            @$('#zoom-correlation-option').hide()
            @$('#zoom-bar-option').show()
            if graphStyle is 'correlation'
                graphStyle = 'bar'
                @$("#zoomstyle").val 'line'
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

        # Normalize data
        if comparisonData?
            {data, comparisonData} = graphHelper.normalizeComparisonData(
                data, comparisonData
            )

        if graphStyle is 'correlation' and comparisonData?
            data = graphHelper.mixData data, comparisonData

            comparisonData = null
            graphStyle = 'scatterplot'
            time = false

        # Chose color
        if comparisonData?
            color = 'black'
        else
            color = tracker.get 'color'

        @printZoomGraph data, color, graphStyle, comparisonData, time

