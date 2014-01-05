moment = require 'moment'
slugify = require 'cozy-slug'

Tracker = require '../models/tracker'
TrackerAmount = require '../models/trackeramount'
normalizeResults = require '../lib/normalizer'
trackerUtils = require '../lib/trackers'


# Return number of tasks completed for every day
module.exports =

    loadTracker: (req, res, next, trackerId) ->
        Tracker.request 'all', key: trackerId, (err, trackers) ->
            if err then next err
            else if trackers.length is 0
                console.log 'Tracker not found'
                res.send error: 'not found', 404
            else
                req.tracker = trackers[0]
                next()

    allBasicTrackers: (req, res, next) ->
        trackers = trackerUtils.getTrackers()
        for tracker in trackers
            tracker.slug = slugify tracker.name
            tracker.path = "basic-trackers/#{tracker.slug}"
            delete tracker.request
        res.send trackers

    all: (req, res, next) ->
        Tracker.all (err, trackers) ->
            if err then next err
            else
                res.send trackers

    create: (req, res, next) ->
        Tracker.create req.body, (err, tracker) ->
            if err then next err
            else
                res.send tracker

    update: (req, res, next) ->
        res.send error: 'not implemented yet', 500

    destroy: (req, res, next) ->
        TrackerAmount.destroyAll req.tracker, (err) ->
            if err then next err
            else
                req.tracker.destroy (err) ->
                    if err then next err
                    else
                        res.send success: true

    day: (req, res, next) ->
        day = moment req.params.day
        day.hours 0, 0, 0, 0
        req.tracker.getAmount day, (err, trackerAmount) ->
            if err then next err
            else if trackerAmount? then res.send trackerAmount
            else res.send {}

    updateDayValue: (req, res, next) ->
        day = moment req.params.day
        day.hours 0, 0, 0, 0
        req.tracker.getAmount day, (err, trackerAmount) ->
            if err then next err
            else if trackerAmount?
                trackerAmount.amount = req.body.amount
                trackerAmount.save (err) ->
                    if err then next err
                    else res.send trackerAmount
            else
                data =
                    amount: req.body.amount
                    date: day
                    tracker: req.tracker.id
                TrackerAmount.create data, (err, trackerAmount) ->
                    if err then next err
                    else res.send trackerAmount

    amounts: (req, res, next) ->
        id = req.tracker.id
        day = moment req.params.day
        params = startkey: [id], endkey: [id + "0"], descending: false
        TrackerAmount.rawRequest 'nbByDay', params, (err, rows) ->
            if err then next err
            else
                results = []
                tmpRows = []
                for row in rows
                    tmpRows.push key: row['key'][1], value: row['value']

                data = normalizeResults tmpRows, day
                for date, value of data
                    dateEpoch = new Date(date).getTime() / 1000
                    results.push x: dateEpoch, y: value
                res.send results, 200
