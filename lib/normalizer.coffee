
module.exports = (rows) ->
    normalizedRows = {}
    data = {}
    data[row.key] = row.value for row in rows
    now = new Date
    now.setHours 0, 0, 0, 0
    date = new Date
    date.setDate(date.getDate() - 133)

    while date < now
        date.setDate(date.getDate() + 1)
        dateString = "#{date.getFullYear()}-"
        dateString += "#{date.getMonth() + 1}-#{date.getDate()}"

        if data[dateString]?
            normalizedRows[dateString] = data[dateString]
        else
            normalizedRows[dateString] = 0

    normalizedRows


