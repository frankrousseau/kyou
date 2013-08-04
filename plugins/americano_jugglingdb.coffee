async = require 'async'

_loadModels = (requests) ->
    models = []
    for docType, docRequests of requests
        models[docType] = require "../models/#{docType}"
    models


_getRequestCreator = (models, docType, requestName, request) ->
    (cb) ->
        console.log "#{docType} - #{requestName} request creation..."
        models[docType].defineRequest requestName, request, (err) ->
            if err then console.log "... fail"
            else console.log "... ok"
            cb err

_loadRequestCreators = (models, requests) ->
    requestsToSave = []
    for docType, docRequests of requests
        for requestName, docRequest of docRequests
            requestsToSave.push(
                _getRequestCreator(models, docType, requestName, docRequest))
    requestsToSave

module.exports = (app, callback) ->
    requests = require '../models/requests'
    models = _loadModels requests
    requestsToSave = _loadRequestCreators models, requests

    async.series requestsToSave, (err) ->
        if err and err.code isnt 'EEXIST'
            console.log "A request creation failed, abandon."
            console.log err
            callback err if callback?
        else
            console.log "All requests have been created"
            callback() if callback?
