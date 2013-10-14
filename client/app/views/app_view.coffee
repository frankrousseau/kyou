request = require '../lib/request'
BaseView = require '../lib/base_view'

Mood = require '../models/mood'
CoffeeCup = require '../models/coffeecup'
Moods = require '../collections/moods'

TrackerList = require './tracker_list'

module.exports = class AppView extends BaseView

    el: 'body.application'
    template: require('./templates/home')

    events:
        'click #good-mood-btn': 'onGoodMoodClicked'
        'click #neutral-mood-btn': 'onNeutralMoodClicked'
        'click #bad-mood-btn': 'onBadMoodClicked'
        'click #coffeecup button': 'onCoffeeButtonClicked'
        'click #add-tracker-btn': 'onTrackerButtonClicked'


    onGoodMoodClicked: -> @updateMood 'good'
    onNeutralMoodClicked: -> @updateMood 'neutral'
    onBadMoodClicked: -> @updateMood 'bad'

    updateMood: (status) ->
        @$('#current-mood').html '&nbsp;'
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

    onCoffeeButtonClicked: (event) ->
        label = @$('#current-coffeecup')
        button = $(event.target)
        val = parseInt button.html()

        label.css 'color', 'transparent'
        label.spin 'tiny', color: '#444'
        CoffeeCup.updateLast val, (err, coffeecup) =>
            label.spin()
            label.css 'color', '#444'
            if err
                alert 'An error occured while saving data'
            else
                label.html val
                @$('#coffeecups-charts').html ''
                @$('#coffeecups-y-axis').html ''
                @getAnalytics 'coffeecups', 'yellow'

    afterRender: ->
        @data = {}
        @colors = {}

        @loadMood()
        @loadCoffeeCup()
        @getAnalytics 'moods', 'steelblue'
        @getAnalytics 'tasks', 'maroon'
        @getAnalytics 'mails', 'green'
        @getAnalytics 'coffeecups', 'yellow'

        $(window).on 'resize',  @redrawCharts

        @trackerList = new TrackerList()
        @$('#content').append @trackerList.$el
        @trackerList.render()
        @trackerList.collection.fetch()

    loadMood: ->
        Mood.getLast (err, mood) =>
            if err
                alert "An error occured while retrieving mood data"
            else if not mood?
                @$('#current-mood').html 'Set your mood for today'
            else
                @$('#current-mood').html mood.get 'status'

    loadCoffeeCup: ->
        CoffeeCup.getLast (err, coffeecup) =>
            if err
                alert "An error occured while retrieving coffee cup data"
            else if not coffeecup?
                @$('#current-coffeecup').html(
                    'Set your coffee consumption for today')
            else
                @$('#current-coffeecup').html coffeecup.get 'amount'

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

    redrawCharts: =>
        $('.chart').html null
        $('.y-axis').html null
        for dataType, data of @data
            width = $("##{dataType}").width() - 30
            chartId = "#{dataType}-charts"
            yAxisId = "#{dataType}-y-axis"
            color = @colors[dataType]
            @drawCharts data, chartId, yAxisId, color, width
        true


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
