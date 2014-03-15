Mood = require '../models/mood'
moment = require 'moment'
normalizer = require '../lib/normalizer'


# Return all moods sorted by date
module.exports.all = (req, res, next) ->
    Mood.rawRequest 'statusByDay', (err, rows) ->
        if err then next err
        else
            data = normalizer.normalize rows, req.day
            res.send normalizer.toClientFormat data


# Return the mood of the day
module.exports.day = (req, res, next) ->
    Mood.getMood req.day, (err, mood) ->
        if err then next err
        else if mood? then res.send mood
        else res.send {}


# Update mood of the day if it exists or create it either.
module.exports.updateDay = (req, res, next) ->
    Mood.getMood req.day, (err, mood) ->
        if err then next err
        else if mood?
            mood.status = req.body.status
            mood.save (err) ->
                if err then next err
                else res.send mood
        else
            data =
                status: req.body.status
                date: req.day
            Mood.create data, (err, mood) ->
                if err then next err
                else res.send mood
