BaseView = require '../lib/base_view'
Mood = require '../models/mood'
Moods = require '../collections/moods'
Task = require '../models/task'
Tasks = require '../collections/tasks'

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
        tasks = new Tasks
        tasks.fetch
            success: (models) ->
                for model in models.models
                    html = require('./templates/task') model.attributes
                    $('#tasks').append html
            error: ->
                alert "An error occured while retrieving data"
