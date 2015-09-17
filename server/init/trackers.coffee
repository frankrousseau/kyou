fs = require 'fs'
path = require 'path'

moment = require 'moment'
log = require('printit')
    prefix: 'init tracker'
    date: true

normalizer = require '../lib/normalizer'
trackers = require('../lib/trackers')()


module.exports = (app) ->


    # Express Controller to be run when given tracker is requested through the
    # REST API.
    getController = (tracker) ->
        (req, res, next) ->

            endDate = req.params.endDate
            startDate = req.params.startDate
            endDate ?= moment().format 'YYYY-MM-DD'
            startDate ?= moment(req.endDate, 'YYYY-MM-DD')
                .subtract('month', 6)
                .format 'YYYY-MM-DD'

            options = group: true
            options.startkey = startDate
            options.endkey = endDate

            tracker.model.rawRequest tracker.requestName, options, (err, rows) ->
                if err then next err
                else
                    data = normalizer.normalize rows, startDate, endDate
                    res.send normalizer.toClientFormat data


    # For all trackers located in tracker directory, add a route to get
    # its data and created data system request.
    recConfig = (trackers) ->
        if trackers.length > 0
            tracker = trackers.pop()

            log.info "configure tracker #{tracker.name}"
            slug = tracker.slug
            path = "/basic-trackers/#{slug}"
            tracker.requestName ?= 'nbByDay'
            app.get "#{path}/:startDate/:endDate", getController tracker
            log.info 'Tracker controller added.'

            name = tracker.requestName
            tracker.model.defineRequest name, tracker.request, (err) ->
                if err
                    log.error 'Tracker request creation failed.'
                    recConfig()
                else
                    log.info 'Tracker request creation succeeded.'
                    recConfig trackers

    recConfig trackers.reverse()

