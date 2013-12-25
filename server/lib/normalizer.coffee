date_helpers = require './date'

# Build a list of tuple (day, value) for six months from given data.
# If for a given day there is no value, a (day, 0) is inserted.
module.exports = (rows, end=new Date) ->
    normalizedRows = {}
    data = {}
    data[row.key] = row.value for row in rows
    end.setHours 0, 0, 0, 0
    date = new Date
    date.setDate(end.getDate() - 133)

    while date < end
        date.setDate(date.getDate() + 1)
        dateString = date_helpers.getDateString date

        if data[dateString]?
            normalizedRows[dateString] = data[dateString]
        else
            normalizedRows[dateString] = 0

    normalizedRows
