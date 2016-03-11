BaseView = require 'lib/base_view'
request = require 'lib/request'
graph = require 'lib/graph'
calculus = require 'lib/calculus'

MainState = require '../main_state'
Mood = require '../models/mood'
Moods = require '../collections/moods'
{DATE_FORMAT, DATE_URL_FORMAT} = require '../lib/constants'


# Item View for the albums list
module.exports = class MoodTracker extends BaseView
    id: 'moods-tracker'
    className: 'line'
    template: require './templates/mood'

    events:
        'click #good-mood-btn': 'onGoodMoodClicked'
        'click #neutral-mood-btn': 'onNeutralMoodClicked'
        'click #bad-mood-btn': 'onBadMoodClicked'

    onGoodMoodClicked: -> @updateMood 'good'
    onNeutralMoodClicked: -> @updateMood 'neutral'
    onBadMoodClicked: -> @updateMood 'bad'

    constructor: (@model) ->
        super

    # After template rendering, it loads data and draw graph.
    afterRender: ->
        super

        @$('#mood-current-date').pikaday
            maxDate: new Date()
            format: DATE_FORMAT
            defaultDate: MainState.endDate.toDate()
            setDefaultDate: true
            onSelect: (value) =>
                @loadCurrentDay()


    # Update mood status.
    updateMood: (status) ->
        day = moment @$('#mood-current-date').val()

        @$('#mood-current-value').html '&nbsp;'
        @$('#mood-current-value').spin true

        Mood.updateDay day, status, (err, mood) =>
            @$('#mood-current-value').spin false

            if err
                alert "An error occured while saving data"
            else
                @$('#mood-current-value').html status
                if status is 'good'
                    val = 3
                else if status is 'neutral'
                    val = 2
                else
                    val = 1

                if day >= MainState.startDate and day <= MainState.endDate
                    i = 0
                    while i < @data.length and moment(@data[i].x * 1000) < day
                        i++

                    if @data[i]? and moment(@data[i].x * 1000).format('YYYY-MM-DD') is moment(day).format('YYYY-MM-DD')
                        @data[i] = {x: moment(day).toDate().getTime() / 1000, y: val}
                    else
                        @data.splice i, 0, {x: moment(day).toDate().getTime() / 1000, y: val}

                    @$('.chart').html null
                    @$('.y-axis').html null
                    console.log @data
                    @redraw()


    load: (callback) =>
        @model.loadMetadata =>
            @reload callback


    # Load current day value, display it then loads analytics data.
    reload: (callback) ->
        day = moment @$('#mood-current-date').val()

        @loadCurrentDay =>
            @loadAnalytics =>
                @redraw()
                callback?()


    loadCurrentDay: (callback) =>
        day = moment @$('#mood-current-date').val()

        @$('#mood-current-value').html '&nbsp;'
        @$('#mood-current-value').spin true
        Mood.getDay day, (err, mood) =>
            @$('#mood-current-value').spin false

            if err
                alert "An error occured while retrieving mood data"
            else if not mood? or not mood.get('status')
                @$('#mood-current-value').html 'no mood set'
            else
                @$('#mood-current-value').html mood.get 'status'
            callback?()



    # Load analytics data and redraw current graph.
    loadAnalytics: (callback) ->
        start = MainState.startDate.format 'YYYY-MM-DD'
        end = MainState.endDate.format 'YYYY-MM-DD'
        path = "moods/#{start}/#{end}"

        @showLoading()
        request.get path, (err, data) =>
            @hideLoading()

            if err
                alert "An error occured while retrieving moods data"
            else
                MainState.data['mood'] = @data = data

                if not @data? or @data.length is 0
                    @data = calculus.getDefaultData()

                callback?()


    # Clean and draw grap based on data field.
    redraw: ->
        if @data?
            @$("#moods-charts").html ''
            @$("#moods-y-axis").html ''
            width = @$("#moods").width() - 70
            el = @$("#moods-charts")[0]
            yEl = @$("#moods-y-axis")[0]
            data = @data
            color = '#039BE5'
            graphStyle = @model.get('metadata').style or 'bar'

            graph.draw {el, yEl, width, color, data, graphStyle}


    showLoading: ->
        @$("#moods").spin true


    hideLoading: ->
        @$("#moods").spin false

