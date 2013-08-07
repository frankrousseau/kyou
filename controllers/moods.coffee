Mood = require '../models/mood'
normalizeResults = require '../lib/normalizer'

getDateString = (date) ->
    dateString = "#{date.getFullYear()}-"
    dateString += "#{date.getMonth() + 1}-#{date.getDate()}"
    dateString

loadTodayMood = (next, callback) ->
    Mood.request 'byDay', (err, moods) ->
        if err
            next err
        else if moods.length isnt 0
            mood = moods[0]
            now = getDateString new Date
            date = getDateString mood.date

            if now is date
                mood.id = mood._id
                callback mood
            else
                callback null
        else
            callback null


# Return all moods sorted by date
module.exports.all = (req, res, next) ->
    Mood.rawRequest 'analytics', (err, rows) ->
        if err then next err
        else
            results = []
            data = normalizeResults rows
            for date, value of data
                dateEpoch = new Date(date).getTime() / 1000
                results.push x: dateEpoch, y: value
            res.send results


# Return the mood of the day
module.exports.today = (req, res, next) ->
    loadTodayMood next, (mood) ->
        if mood? then res.send mood
        else res.send {}


# Update mood of the day if it exists or create it either.
module.exports.updateToday = (req, res, next) ->
    loadTodayMood next, (mood) ->
        if mood?
            mood.status = req.body.status
            mood.save (err) ->
                if err then next err
                else res.send mood
        else
            data =
                status: req.body.status
                date: new Date
            Mood.create data, (err, mood) ->
                if err then next err
                else res.send mood
