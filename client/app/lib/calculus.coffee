MainState = require '../main_state'

module.exports =

    average: (data) ->
        average = 0
        if data?
            average += amount.y for amount in data
            average = average / data.length
            average = Math.round(average * 100) / 100
        return average


    addDayToDates: (data, nbDays) ->
        for entry in data
            date = moment entry.x * 1000
            date.add 'day', nbDays
            entry.x = date.toDate().getTime() / 1000

        return data


    addYearToDates: (data) ->
        for entry in data
            date = moment entry.x * 1000
            date.add 'year', 1
            entry.x = date.toDate().getTime() / 1000

        return data


    getDefaultData: ->
        [
            x: MainState.startDate.toDate().getTime() / 1000
            y: 0
        ,
            x: MainState.endDate.toDate().getTime() / 1000
            y: 0
        ]


