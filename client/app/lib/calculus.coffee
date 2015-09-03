
module.exports =

    average: (data) ->
        average = 0
        average += amount.y for amount in data
        average = average / data.length
        average = Math.round(average * 100) / 100

