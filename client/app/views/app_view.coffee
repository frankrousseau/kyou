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

    onGoodMoodClicked: -> @updateMood 'good'
    onNeutralMoodClicked: -> @updateMood 'neutral'
    onBadMoodClicked: -> @updateMood 'bad'

    updateMood: (status) ->
        Mood.updateLast status, (err, mood) =>
            if err
                alert "An error occured while saving data"
            else
                @$('#current-mood').html status

    afterRender: ->
        @data = {}
        @colors = {}

        @loadMood()
        @getAnalytics 'moods', 'steelblue'
        @getAnalytics 'tasks', 'maroon'
        @getAnalytics 'mails', 'green'

        $(window).on "resize", @redrawCharts()

    loadMood: ->
        Mood.getLast (err, mood) =>
            if err
                alert "An error occured while retrieving data"
            else if not mood?
                @$('#current-mood').html 'Set your mood for today'
            else
                @$('#current-mood').html mood.get 'status'

    getAnalytics: (dataType, color) ->
        request.get dataType, (err, data) =>
            if err
                alert "An error occured while retrieving #{dataType} data"
            else
                width = $("##{dataType}").width() - 30
                chartId = "#{dataType}-charts"
                yAxisId = "#{dataType}-y-axis"
                @data[dataType] = data
                @colors[dataType] = color
                @drawCharts data, chartId, yAxisId, color, width

    redrawCharts: ->
        for dataType, data of @data
            width = $("##{dataType}").width() - 30
            chartId = "#{dataType}-charts"
            yAxisId = "#{dataType}-y-axis"
            color = @colors[dataType]
            $("#{dataType}").html ''
            @drawCharts data, chartId, yAxisId, color, width


    drawCharts: (data, chartId, yAxisId, color, width) ->
        console.log width
        graph = new Rickshaw.Graph(
            element: document.querySelector("##{chartId}")
            width: width
            height: 300
            renderer: 'bar'
            series: [
                color: color
                data: data
            ]
        )

        x_axis = new Rickshaw.Graph.Axis.Time graph: graph
        y_axis = new Rickshaw.Graph.Axis.Y
             graph: graph
             orientation: 'left'
             tickFormat: Rickshaw.Fixtures.Number.formatKMBT
             element: document.getElementById(yAxisId)

        graph.render()
        graph
