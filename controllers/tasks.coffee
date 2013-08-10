Task = require '../models/task'
normalizeResults = require '../lib/normalizer'


# Return number of tasks completed for every day
module.exports.all = (req, res, next) ->
    options = group: true
    Task.rawRequest 'nbByDay', options, (err, rows) ->
        if err then next err
        else
            results = []
            data = normalizeResults rows
            for date, value of data
                dateEpoch = new Date(date).getTime() / 1000
                results.push x: dateEpoch, y: value

            res.send results
