americano = require('americano-cozy')
date_helpers = require '../lib/date'

module.exports = Mood = americano.getModel 'Mood',
    status: type: String
    date: type: Date

Mood.loadTodayMood = (callback) ->
    Mood.request 'byDay', descending: true, (err, moods) ->
        if err
            callback err
        else if moods.length isnt 0
            mood = moods[0]
            now = date_helpers.getDateString new Date
            date = date_helpers.getDateString mood.date

            if now is date
                mood.id = mood._id
                callback null, mood
            else
                callback()
        else
            callback()
