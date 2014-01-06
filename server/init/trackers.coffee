fs = require 'fs'
path = require 'path'

moment = require 'moment'
slugify = require 'cozy-slug'
log = require('printit')
    prefix: 'init tracker'
    date: true

normalizeResults = require '../lib/normalizer'
getTrackers = require('../lib/trackers').getTrackers


module.exports = (app) ->

    # Express Controller to be run when given tracker is request through the
    # REST API.
    # It returns 6 months that ends at day given in params
    getController = (tracker) ->
        (req, res, next) ->
            options = group: true

            tracker.model.rawRequest 'nbByDay', options, (err, rows) ->
                if err then next err
                else
                    results = []
                    limitDate = moment req.params.day
                    data = normalizeResults rows, limitDate
                    for date, value of data
                        dateEpoch = new Date(date).getTime() / 1000
                        results.push x: dateEpoch, y: value
                    res.send results

    # For all trackers located in tracker directory, add a route to get
    # its data and created data system request.
    recConfig = ->
        if trackers.length > 0
            tracker = trackers.pop()
            log.info "configure tracker #{tracker.name}"

            slug = slugify tracker.name
            path = "/basic-trackers/#{slug}"
            app.get path, getController tracker
            log.info 'Tracker controller added.'

            tracker.model.defineRequest 'nbByDay', tracker.request, (err) ->
                if err
                    log.error 'Tracker request creation failed.'
                    recConfig()
                else
                    log.info 'Tracker request creation succeeded.'
                    recConfig()

    trackers = getTrackers().reverse()
    recConfig()
