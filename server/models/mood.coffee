americano = require 'americano-cozy'
moment = require 'moment'

module.exports = Mood = americano.getModel 'Mood',
    status: type: String
    date: type: Date

# Get Mood value for given day.
# Return null if there is no value for given day.
Mood.getMood = (day, callback) ->
    day = day.format 'YYYY-MM-DD'

    Mood.request 'byDay', key: day, (err, moods) ->
        if err
            callback err
        else if moods.length isnt 0
            callback null, moods[0]
        else
            callback()
