Mood = require '../models/mood'
moment = require 'moment'
normalizer = require '../lib/normalizer'


# Return all moods sorted by date
module.exports =
    all: (req, res, next) ->

        endDate = req.params.endDate
        startDate = req.params.startDate
        endDate ?= moment().format 'YYYY-MM-DD'
        startDate ?= moment req.endDate, 'YYYY-MM-DD'
            .subtract('month', 6)
            .format 'YYYY-MM-DD'

        options =
            startkey: startDate
            endkey: endDate

        Mood.rawRequest 'statusByDay', options, (err, rows) ->
            if err then next err
            else
                data = normalizer.normalize rows, startDate, endDate
                res.send normalizer.toClientFormat data


    # Return the mood of the day
    day: (req, res, next) ->
        Mood.getMood req.day, (err, mood) ->
            if err then next err
            else if mood? then res.send mood
            else res.send {}


    # Update mood of the day if it exists or create it either.
    updateDay: (req, res, next) ->
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


    export: (req, res, next) ->
        slug = req.params.slug

        Mood.all (err, rows) ->
            return next err if err

            csv = []
            for row in rows
                key = moment(row.date).format 'YYYY-MM-DD'
                value = row.status
                csv.push "#{key},#{value}"
            csvFile = csv.join '\n'

            res.setHeader 'Content-length', csvFile.length
            res.setHeader(
                'Content-disposition',
                "attachment; filename=mood.csv"
            )
            res.setHeader 'Content-type', 'application/csv'
            res.send csvFile

