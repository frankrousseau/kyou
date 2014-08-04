moment = require 'moment'
slugify = require 'cozy-slug'

Tracker = require '../models/tracker'
TrackerAmount = require '../models/trackeramount'
normalizer = require '../lib/normalizer'
trackerUtils = require '../lib/trackers'


# Return number of tasks completed for every day
module.exports =

    # Transform data given in rul in a data without hours
    loadDay: (req, res, next, day) ->
        req.day = moment req.params.day
        req.day.hours 0, 0, 0, 0
        next()

    # Load tracker before processing request.
    loadTracker: (req, res, next, trackerId) ->
        Tracker.request 'all', key: trackerId, (err, trackers) ->
            if err then next err
            else if trackers.length is 0
                console.log 'Tracker not found'
                res.send error: 'not found', 404
            else
                req.tracker = trackers[0]
                next()

    # Load tracker before processing request.
    loadTrackerAmount: (req, res, next, trackerAmountId) ->
        TrackerAmount.request 'all', key: trackerAmountId, (err, amounts) ->
            if err then next err
            else if amounts.length is 0
                console.log 'AmounT not found'
                res.send error: 'not found', 404
            else
                req.amount = amounts[0]
                next()

    # Get all trackers described in the KYou code, from the trackers folder.
    allBasicTrackers: (req, res, next) ->
        trackers = trackerUtils.getTrackers()
        for tracker in trackers
            tracker.slug = slugify tracker.name
            tracker.path = "basic-trackers/#{tracker.slug}"
            delete tracker.request
        res.send trackers

    # Return all user custom trackers.
    all: (req, res, next) ->
        Tracker.request 'byName', (err, trackers) ->
            if err then next err
            else
                res.send trackers

    # Create a user custom tracker.
    create: (req, res, next) ->
        Tracker.create req.body, (err, tracker) ->
            if err then next err
            else
                res.send tracker

    # Update given user custom tracker.
    update: (req, res, next) ->
        req.tracker.updateAttributes req.body, (err) ->
            if err then next err
            else
                res.send success: true


    # Destroy given user custom tracker with value linked to it.
    destroy: (req, res, next) ->
        TrackerAmount.destroyAll req.tracker, (err) ->
            if err then next err
            else
                req.tracker.destroy (err) ->
                    if err then next err
                    else
                        res.send success: true

    # Get value for given day and given custom tracker.
    day: (req, res, next) ->
        req.tracker.getAmount req.day, (err, trackerAmount) ->
            if err then next err
            else if trackerAmount? then res.send trackerAmount
            else res.send {}

    # Set value for given day and given custom tracker.
    updateDayValue: (req, res, next) ->
        req.tracker.getAmount req.day, (err, trackerAmount) ->
            if err then next err
            else if trackerAmount?
                trackerAmount.amount = req.body.amount
                trackerAmount.save (err) ->
                    if err then next err
                    else res.send trackerAmount
            else
                data =
                    amount: req.body.amount
                    date: req.day
                    tracker: req.tracker.id
                TrackerAmount.create data, (err, trackerAmount) ->
                    if err then next err
                    else res.send trackerAmount

    # Return 6 month of data for given custom tracker.
    amounts: (req, res, next) ->
        id = req.tracker.id
        day = moment req.day
        params = startkey: [id], endkey: [id + "0"], descending: false
        TrackerAmount.rawRequest 'nbByDay', params, (err, rows) ->
            if err then next err
            else
                tmpRows = []
                for row in rows
                    tmpRows.push key: row['key'][1], value: row['value']

                data = normalizer.normalize tmpRows, day
                res.send normalizer.toClientFormat data

    # Returns all stored data for a given tracker.
    rawData: (req, res, next) ->
        req.tracker.getAmounts (err, trackerAmounts) ->
            if err then next err
            else res.send trackerAmounts

    # Returns all stored data for a given tracker as a CSV file.
    rawDataCsv: (req, res, next) ->
        req.tracker.getAmounts (err, trackerAmounts) ->
            if err then next err
            else
                # CSV Headers
                data = "#{req.tracker.name},\n"
                data = 'date,amount\n'

                # Data
                for amount in trackerAmounts
                    date = moment(amount.date).format 'YYYY-MM-DD'
                    data += "#{date},#{amount.amount}"

                # Request headers
                res.setHeader 'content-type', 'application/csv'
                contentHeader = "inline; filename=#{req.tracker.name}.csv"
                res.setHeader 'Content-Disposition', contentHeader
                res.setHeader 'Content-Length', data.length

                res.send data

    # Delete given raw data
    rawDataDelete: (req, res, next) ->
        req.amount.destroy (err) ->
            if err then next err
            else res.send success: true, 204
