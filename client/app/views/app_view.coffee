BaseView = require '../lib/base_view'
Mood = require '../models/mood'

module.exports = class AppView extends BaseView

    el: 'body.application'
    template: require('./templates/home')

    events:
        'click #good-mood-btn': 'onGoodMoodClicked'
        'click #neutral-mood-btn': 'onNeutralMoodClicked'
        'click #bad-mood-btn': 'onBadMoodClicked'

    afterRender: ->
        @loadMood()

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

