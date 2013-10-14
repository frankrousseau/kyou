Tracker = require '../models/tracker'
TrackerAmount = require '../models/trackeramount'


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

    today: (req, res, next) ->
        req.tracker.loadTodayAmount (err, trackerAmount) ->
            console.log trackerAmount
            if err then next err
            else if trackerAmount? then res.send trackerAmount
            else res.send {}

    updateTodayValue: (req, res, next) ->
        req.tracker.loadTodayAmount (err, trackerAmount) ->
            if err then next err
            else if trackerAmount?
                trackerAmount.amount = req.body.amount
                trackerAmount.save (err) ->
                    if err then next err
                    else res.send trackerAmount
            else
                data =
                    amount: req.body.amount
                    date: new Date
                    tracker: req.tracker.id
                TrackerAmount.create data, (err, trackerAmount) ->
                    if err then next err
                    else res.send trackerAmount

    destroy: (req, res, next) ->
        TrackerAmount.destroyAll req.tracker (err) ->
            if err then next err
            else
                req.tracker.destroy (err) ->
                    if err then next err
                    else
                        res.send success: true
