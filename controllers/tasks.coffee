Task = require '../models/task'
normalizeResults = require '../lib/normalizer'

# Return number of tasks completed for every day
module.exports.all = (req, res, next) ->
    options = group: true
    Task.rawRequest 'tasksByDay', options, (err, rows) ->
        if err then next err
        else if rows.length isnt 0
            results = []
            data = normalizeResults rows
            for date, value of data
                dateEpoch = new Date(date).getTime() / 1000
                results.push date: dateEpoch, nbTasks: value

            res.send results
