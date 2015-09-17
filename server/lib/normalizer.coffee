moment = require 'moment'


module.exports =


    filterDates: (rows, start, end) ->
        rows


    normalize: (rows, start, end) ->
        data = {}
        data[start] = 0
        data[row.key] = row.value for row in rows
        data[end] ?= 0


        date = moment start
        normalizedRows = {}
        endDate = moment end
        while date <= endDate
            date = date.add 'days', 1
            dateString = date.format "YYYY-MM-DD"

            if data[dateString]?
                normalizedRows[dateString] = data[dateString]
            else
                normalizedRows[dateString] = 0
        normalizedRows


    toClientFormat: (data) ->
        results = []
        for date, value of data
            dateEpoch = new Date(date).getTime() / 1000
            results.push x: dateEpoch, y: value
        results

