# Return set of data that always look the same.

module.exports =

    # Extract 6 months of data until endDate from a set of data built for
    # rickshaw.
    getSixMonths: (data, endDate) ->
        endDate ?= window.app.mainView.currentDate
        result = []
        endDate = moment(endDate)
        beginDate = moment endDate
        beginDate = beginDate.subtract 6, 'months'

        for point in data
            currentDate = moment point.x * 1000
            if currentDate? and (currentDate >= beginDate) and (currentDate <= endDate)
                result.push point
        result
