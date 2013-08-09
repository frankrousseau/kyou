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
        @$('#current-mood').html null
        @$('#current-mood').spin 'tiny'
        Mood.updateLast status, (err, mood) =>
            if err
                @$('#current-mood').spin()
                alert "An error occured while saving data"
            else
                @$('#current-mood').spin()
                @$('#current-mood').html status
                @$('#moods-charts').html ''
                @$('#moods-y-axis').html ''
                @getAnalytics 'moods', 'steelblue'

    afterRender: ->
        @data = {}
        @colors = {}

        @loadMood()
        @getAnalytics 'moods', 'steelblue'
        @getAnalytics 'tasks', 'maroon'
        @getAnalytics 'mails', 'green'

        $(window).on 'resize',  @redrawCharts

    loadMood: ->
        Mood.getLast (err, mood) =>
            if err
                alert "An error occured while retrieving data"
            else if not mood?
                @$('#current-mood').html 'Set your mood for today'
            else
                @$('#current-mood').html mood.get 'status'

    getAnalytics: (dataType, color) ->
        $("##{dataType}").spin 'tiny'
        request.get dataType, (err, data) =>
            if err
                alert "An error occured while retrieving #{dataType} data"
            else
                $("##{dataType}").spin()
                width = $("##{dataType}").width() - 30
                chartId = "#{dataType}-charts"
                yAxisId = "#{dataType}-y-axis"
                @data[dataType] = data
                @colors[dataType] = color
                @drawCharts data, chartId, yAxisId, color, width

    redrawCharts: ->
        console.log 'do nothing'
        #for dataType, data of @data
        #    width = $("##{dataType}").width() - 30
        #    chartId = "#{dataType}-charts"
        #    yAxisId = "#{dataType}-y-axis"
        #    $(chartId).html null
        #    $(yAxisId).html null
        #    color = @colors[dataType]
        #    @drawCharts data, chartId, yAxisId, color, width


    drawCharts: (data, chartId, yAxisId, color, width) ->
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
