fs = require 'fs'
async = require 'async'
Task = require './models/task'
Mail = require './models/mail'

# MapReduce's map for "all" request
allMap = (doc) -> emit doc._id, doc

mailsByDay =
    map: (doc) -> emit doc.date, doc
    reduce: (key, values, rereduce) ->
        if rereduce then sum values
        else values.length

tasksByDay =
    map: (doc) ->
        if doc.completionDate? and doc.done
            date = new Date doc.completionDate
            dateString = "#{date.getDate()}#{date.getMonth()}"
            dateString += "#{date.getFullYear()}"
            emit dateString, 1
    reduce: (key, values, rereduce) ->
        if rereduce then sum values
        else values.length


# Create all requests and upload directory
module.exports = (callback) ->
    async.parallel [
        (cb) -> Mail.defineRequest 'mailsByDay', mailsByDay, cb
        (cb) -> Task.defineRequest 'tasksByDay', tasksByDay, cb
    ], (err) ->
        if err and err.code isnt 'EEXIST'
            console.log "Something went wrong"
            console.log err
            console.log '-----'
            console.log err.stack
            callback() if callback?
        else
            console.log "Requests have been created"

            callback(err) if callback?
