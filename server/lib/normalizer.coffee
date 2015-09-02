moment = require 'moment'


module.exports =


    normalize: (rows, start, end) ->
        data = {}
        data[start] = 0
        data[row.key] = row.value for row in rows
        data[end] ?= 0
        data


    toClientFormat: (data) ->
        results = []
        for date, value of data
            dateEpoch = new Date(date).getTime() / 1000
            results.push x: dateEpoch, y: value
        results

