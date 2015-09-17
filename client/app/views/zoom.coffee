BaseView = require 'lib/base_view'
request = require 'lib/request'
graphHelper = require '../lib/graph'
calculus = require 'lib/calculus'

Tracker = require '../models/tracker'
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
        'change #import-input': 'onImportFileChanged'
        'click #import-button': 'onImportClicked'


    constructor: (@model, @basicTrackers, @moodTracker, @trackers) ->
        super


    afterRender: ->
        @$('#zoom-correlation-option').hide()
        @$('#zoomgoal').numeric()


    getTracker: ->
        return @model.get 'tracker'


    show: (slug) ->
        super

        if slug is 'mood'
            tracker = @moodTracker

            @$("#export-btn").attr(
                "href", "moods/export/mood.csv"
            )
            @$("#remove-section").hide()
            @$("#import-section").hide()
            @$("#import-info").hide()

        else if slug.length is 32
            tracker = @trackers.findWhere id: slug
            console.log tracker
            tracker.set 'slug', slug

            @$("#export-btn").attr(
                "href", "trackers/export/#{slug}/export.csv"
            )
            @$("#remove-section").show()
            @$("#import-section").show()
            @$("#import-info").show()

        else
            tracker = @basicTrackers.findWhere slug: slug

            @$("#export-btn").attr(
                "href", "basic-trackers/export/#{slug}.csv"
            )
            @$("#remove-section").hide()
            @$("#import-section").hide()
            @$("#import-info").hide()

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

        combo = @$ "#zoomcomparison"
        combo.html null
        combo.append """
<option value=\"undefined\">no comparison</option>"
"""
        combo.append """
<option value=\"last-year\">previous year</option>"
"""
        combo.append """
<option value=\"previous\">previous period</option>"
"""
        combo.append "<option value=\"moods\">Moods</option>"

        for tracker in @trackers.models
            unless tracker.get('metadata').hidden
                option = "<option value="
                option += "\"#{tracker.get 'id'}\""
                option += ">#{tracker.get 'name'}</option>"
                combo.append option

        for tracker in @basicTrackers.models
            unless tracker.get('metadata').hidden
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
        @printZoomGraph data, @getColor()


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

            length = data.length
            middle = 7

            newTrend = 0
            i = middle
            while i > 0
                newTrend += data[length - i - 1].y
                i--

            oldTrend = 0
            i = middle
            while i > 0
                oldTrend += data[length - middle - i - 1].y
                i--

            if oldTrend isnt 0
                evolution =  (newTrend / oldTrend) * 100 - 100
            else
                evolution = 0
            ###
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
            ###

        evolution = Math.round(evolution * 100) / 100
        @$("#evolution-value").html evolution + " %"


    printZoomGraph: (data, color, graphStyle, comparisonData, time, goal) ->
        if data?
            graphStyle ?= @$("#zoomstyle").val() or 'bar'
            goal ?= @$("#zoomgoal").val() or null
            color ?= 'black'

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
        answer = confirm "Are you sure that you want to delete this tracker?"
        if answer
            tracker = @getTracker()
            id = tracker.get 'id'
            tracker.destroy
                success: =>
                    window.app.router.navigateHome()

                error: ->
                    alert 'something went wrong while removing tracker.'


    getMetadataPath: ->
        tracker = @getTracker()
        slug = tracker.get 'slug'

        return "metadata/basic-trackers/#{slug}"


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
            request.put @getMetadataPath(), data, (err) ->

        @onComparisonChanged()


    onGoalChanged: =>
        tracker = @model.get('tracker')
        slug = tracker.get 'slug'
        data =
            goal: parseInt @$("#zoomgoal").val()
        tracker.setMetadata 'goal', data.goal

        @onComparisonChanged()
        request.put @getMetadataPath(), data, (err) ->


    onComparisonChanged: =>
        val = @$("#zoomcomparison").val()
        timeUnit = @$("#zoomtimeunit").val()
        graphStyle = @$("#zoomstyle").val()

        tracker = @model.get 'tracker'

        if tracker?
            data = MainState.data[tracker.get 'slug']
            toNormalize = false

            # Check if it's a comparison.
            if val.indexOf('basic') isnt -1 or val in ['last-year', 'previous', 'moods'] or val.length is 32
                @$('#zoom-bar-option').hide()
                @$('#zoom-correlation-option').show()
                if graphStyle is 'bar'
                    graphStyle = 'line'
                    @$("#zoomstyle").val 'line'

                @getComparisonData val, (err, comparisonData) =>
                    toNormalize = not (val in ['last-year', 'previous'])
                    @displayGraph {
                       timeUnit, data, comparisonData, graphStyle, toNormalize
                    }

            else
                @$('#zoom-correlation-option').hide()
                @$('#zoom-bar-option').show()
                if graphStyle is 'correlation'
                    graphStyle = 'bar'
                    @$("#zoomstyle").val 'line'
                comparisonData = null
                @displayGraph {timeUnit, data, graphStyle, toNormalize}


    displayGraph: (options) ->
        {timeUnit, data, comparisonData, graphStyle, toNormalize} = options
        time = true # true if x axis should show dates.

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
        if toNormalize
            {data, comparisonData} = graphHelper.normalizeComparisonData(
                data, comparisonData
            )

        if graphStyle is 'correlation' and comparisonData?
            data = graphHelper.mixData data, comparisonData

            comparisonData = null
            graphStyle = 'scatterplot'
            time = false

        color = @getColor comparisonData isnt null
        @printZoomGraph data, color, graphStyle, comparisonData, time


    getColor: (isComparison) ->

        if isComparison
            color = 'black'
        else
            color = @getTracker().get 'color'

        return color


    getComparisonData: (slug, callback) ->

        if slug in ['last-year', 'previous']

            startDate = moment MainState.startDate
            endDate = moment MainState.endDate
            if slug is 'last-year'
                startDate.subtract 'year', 1
                endDate.subtract 'year', 1

            if slug is 'previous'
                length = endDate.diff startDate, 'days'
                length++
                startDate.subtract 'day', length
                endDate.subtract 'day', length

            path = @getTracker().getPath startDate, endDate
            request.get path, (err, data) =>
                if err
                    alert "An error occured while retrieving previous data"
                    callback null, {}

                else
                    if slug is 'last-year'
                        calculus.addYearToDates data

                    if slug is 'previous'
                        calculus.addDayToDates data, length

                    callback null, data

        else
            if slug.length isnt 32 and slug isnt 'moods'
                slug = slug.substring 6
            else if slug is 'moods'
                slug = 'mood'
            callback null, MainState.data[slug]


    onImportFileChanged: (event) ->
        file = event.target.files[0]
        @reader = new FileReader()
        @reader.readAsText file


    onImportClicked: ->
        tracker = @getTracker()
        data = csv: @reader.result
        request.post "trackers/#{tracker.get 'id'}/csv", data, (err) =>
            console.log err
            if err
                alert 'An error occured during the import.'
            else
                alert 'Your import was successfully completed.'

                window.app.mainView.trackerList.reloadAll =>
                    @reload()

    reload: ->
        tracker = @model.get 'tracker'
        if tracker?
            data = MainState.data[tracker.get 'slug']
            @printZoomGraph data, tracker.get 'color'


