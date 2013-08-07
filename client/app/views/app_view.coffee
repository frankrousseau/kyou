BaseView = require '../lib/base_view'
Mood = require '../models/mood'
Moods = require '../collections/moods'
request = require '../lib/request'

module.exports = class AppView extends BaseView

    el: 'body.application'
    template: require('./templates/home')

    events:
        'click #good-mood-btn': 'onGoodMoodClicked'
        'click #neutral-mood-btn': 'onNeutralMoodClicked'
        'click #bad-mood-btn': 'onBadMoodClicked'

    afterRender: ->
        @loadMood()
        @loadMoods()
        @loadTasks()

    loadMood: ->
        Mood.getLast (err, mood) =>
            if err
                alert "An error occured while retrieving data"
            else if not mood?
                @$('#current-mood').html 'Set your mood for today'
            else
                @$('#current-mood').html mood.get 'status'

    updateMood: (status) ->
        Mood.updateLast status, (err, mood) =>
            if err
                alert "An error occured while saving data"
            else
                @$('#current-mood').html status

    onGoodMoodClicked: -> @updateMood 'good'
    onNeutralMoodClicked: -> @updateMood 'neutral'
    onBadMoodClicked: -> @updateMood 'bad'

    loadMoods: ->
        moods = new Moods
        moods.fetch
            success: (models) ->
                for model in models.models
                    html = require('./templates/mood') model.attributes
                    $('#moods').append html
            error: ->
                alert "An error occured while retrieving data"

    loadTasks: ->
        request.get 'tasks', (err, data) =>
            if err
                alert "An error occured while retrieving data"
            else
                @drawCharts data, 'tasks-charts', 'tasks-y-axis'

    drawCharts: (data, chartId, yAxisId) ->

        graph = new Rickshaw.Graph(
            element: document.querySelector("##{chartId}")
            width: 580
            height: 250
            renderer: 'bar'
            series: [ {
                color: 'steelblue',
                data: data
            } ]
        )

        x_axis = new Rickshaw.Graph.Axis.Time graph: graph
        y_axis = new Rickshaw.Graph.Axis.Y
             graph: graph
             orientation: 'left'
             tickFormat: Rickshaw.Fixtures.Number.formatKMBT
             element: document.getElementById(yAxisId)

        graph.render()
        graph
