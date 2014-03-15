fs = require 'fs'
path = require 'path'

moment = require 'moment'
slugify = require 'cozy-slug'
log = require('printit')
    prefix: 'init tracker'
    date: true

normalizer = require '../lib/normalizer'
getTrackers = require('../lib/trackers').getTrackers


module.exports = (app) ->

    # Express Controller to be run when given tracker is requested through the
    # REST API.
    # It returns 6 months that ends at day given in params
    getController = (tracker) ->
        (req, res, next) ->
            options = group: true
            options.startKey = req.day if req.day?

            tracker.model.rawRequest 'nbByDay', options, (err, rows) ->
                if err then next err
                else
                    data = normalizer.normalize rows, req.day
                    res.send normalizer.toClientFormat data

    # For all trackers located in tracker directory, add a route to get
    # its data and created data system request.
    recConfig = (trackers) ->
        if trackers.length > 0
            tracker = trackers.pop()

            log.info "configure tracker #{tracker.name}"
            slug = slugify tracker.name
            path = "/basic-trackers/#{slug}"
            app.get "#{path}/:day", getController tracker
            log.info 'Tracker controller added.'

            tracker.model.defineRequest 'nbByDay', tracker.request, (err) ->
                if err
                    log.error 'Tracker request creation failed.'
                    recConfig()
                else
                    log.info 'Tracker request creation succeeded.'
                    recConfig trackers

    recConfig getTrackers().reverse()
