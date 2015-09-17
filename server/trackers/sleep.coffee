americano = require 'cozydb'

module.exports =
    name: "Sleep Duration"
    color: "#2196F3"
    description: """
Number of minutes you sleep every day. Data should be imported from Jawbone
Konnector."""
    model: americano.getModel 'sleep', date: Date
    request:
        map: (doc) ->
            emit doc.date.substring(0,10), (doc.sleepDuration / 60)
        reduce: (key, values, rereduce) ->
            sum values
