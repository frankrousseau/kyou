americano = require 'cozydb'
moment = require 'moment'

module.exports = DailyNote = americano.getModel 'DailyNote',
    text: String
    date: Date

# Get note text for given day.
# Return null if there is no value for given day.
DailyNote.getDailyNote = (day, callback) ->
    day = day.format 'YYYY-MM-DD'

    DailyNote.request 'byDay', key: day, (err, dailynotes) ->
        if err
            callback err
        else if dailynotes.length isnt 0
            callback null, dailynotes[0]
        else
            callback()
