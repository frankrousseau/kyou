americano = require 'cozydb'

module.exports =
    name: "Events"
    color: "#1565C0"
    description: """
Number of events registered in your Calendar for each day.
"""
    model: americano.getModel 'Event', date: Date
    request:
        map: (doc) ->
            if doc.start
                date = new Date doc.start
                yyyy = date.getFullYear().toString()
                mm = (date.getMonth() + 1).toString()
                mm = "0" + mm if mm.length is 1
                dd  = date.getDate().toString()
                dd = "0" + dd if dd.length is 1
                dateString = yyyy + '-' + mm + '-' + dd
                emit dateString, 1
        reduce: (key, values, rereduce) ->
            sum values
