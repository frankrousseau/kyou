Mood = require '../models/mood'
moment = require 'moment'
normalizeResults = require '../lib/normalizer'


# Return all moods sorted by date
module.exports.all = (req, res, next) ->
    Mood.rawRequest 'statusByDay', (err, rows) ->
        if err then next err
        else
            results = []
            limitDate = moment req.params.day
            data = normalizeResults rows, limitDate
            for date, value of data
                dateEpoch = new Date(date).getTime() / 1000
                results.push x: dateEpoch, y: value
            res.send results, 200


# Return the mood of the day
module.exports.day = (req, res, next) ->
    day = moment req.params.day
    day.hours 0, 0, 0, 0
    Mood.getMood day, (err, mood) ->
        if err then next err
        else if mood? then res.send mood
        else res.send {}


# Update mood of the day if it exists or create it either.
module.exports.updateDay = (req, res, next) ->
    day = moment req.params.day
    day.hours 0, 0, 0, 0
    Mood.getMood day, (err, mood) ->
        if err then next err
        else if mood?
            mood.status = req.body.status
            mood.save (err) ->
                if err then next err
                else res.send mood
        else
            data =
                status: req.body.status
                date: day
            Mood.create data, (err, mood) ->
                if err then next err
                else res.send mood
