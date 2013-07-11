
module.exports = (callback) ->
    requests = require './requests'
    requestsToSave = []
    for docType, docRequests of requests
        for requestName, docRequest of docRequests
            requestsToSave.push (cb) -
                require('./models/#{requestName}').defineRequest requestName, docRequest, cb


    async.parallel reuqestsToSave, (err) ->
        if err and err.code isnt 'EEXIST'
            console.log "Something went wrong"
            console.log err
            console.log '-----'
            console.log err.stack
            callback() if callback?
        else
            console.log "Requests have been created"

            callback(err) if callback?
