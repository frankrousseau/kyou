moment = require 'moment'

# Build a list of tuple (day, value) for six months from given data.
# If for a given day there is no value, a (day, 0) is inserted.
module.exports =
    normalize: (rows, end=moment()) ->
        normalizedRows = {}
        data = {}
        data[row.key] = row.value for row in rows

        end.hours 0, 0, 0, 0
        date = moment end
        date.subtract 'month', 6

        while date < end
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
