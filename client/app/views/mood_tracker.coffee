BaseView = require 'lib/base_view'
request = require 'lib/request'
graph = require 'lib/graph'

Mood = require '../models/mood'
Moods = require '../collections/moods'

# Item View for the albums list
module.exports = class TrackerItem extends BaseView
    id: 'moods'
    className: 'line'
    template: require './templates/mood'

    events:
        'click #good-mood-btn': 'onGoodMoodClicked'
        'click #neutral-mood-btn': 'onNeutralMoodClicked'
        'click #bad-mood-btn': 'onBadMoodClicked'

    onGoodMoodClicked: -> @updateMood 'good'
    onNeutralMoodClicked: -> @updateMood 'neutral'
    onBadMoodClicked: -> @updateMood 'bad'

    updateMood: (status) ->
        @$('#current-mood').html '&nbsp;'
        @$('#current-mood').spin 'tiny'
        day = window.app.mainView.currentDate
        Mood.updateDay day, status, (err, mood) =>
            @$('#current-mood').spin()
            if err
                alert "An error occured while saving data"
            else
                @$('#current-mood').html status
                graph.clear @$('#moods-charts'), @$('#moods-y-axis')
                @loadAnalytics()

    reload: (callback) ->
        day = window.app.mainView.currentDate
        Mood.getDay day, (err, mood) =>
            if err
                alert "An error occured while retrieving mood data"
            else if not mood?
                @$('#current-mood').html 'Set your mood for current day'
            else
                @$('#current-mood').html mood.get 'status'
            @loadAnalytics()
            callback() if callback?


    loadAnalytics: ->
        day = window.app.mainView.currentDate
        path = "moods/#{day.format 'YYYY-MM-DD'}"

        @$("#moods-charts").html ''
        @$("#moods-y-axis").html ''
        @$("#moods").spin 'tiny'

        request.get path, (err, data) =>
            @$("#moods").spin()
            if err
                alert "An error occured while retrieving moods data"
            else
                @data = data
                @redraw()

    redraw: ->
        @$("#moods-charts").html ''
        @$("#moods-y-axis").html ''
        width = @$("#moods").width() - 70
        el = @$("#moods-charts")[0]
        yEl = @$("#moods-y-axis")[0]
        graph.draw el, yEl, width, 'steelblue', @data
