Mood = require '../models/mood'
normalizeResults = require '../lib/normalizer'


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
    Mood.loadTodayMood (err, mood) ->
        if err then next err
        else if mood? then res.send mood
        else res.send {}


# Update mood of the day if it exists or create it either.
module.exports.updateToday = (req, res, next) ->
    Mood.loadTodayMood (err, mood) ->
        console.log mood
        if err then next err
        else if mood?
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
