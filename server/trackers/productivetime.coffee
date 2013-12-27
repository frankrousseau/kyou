americano = require 'americano-cozy'

module.exports =
    name: "Productive Time - Rescue Time"
    color: "#27AE61"
    description: """
Number of minutes spent on apps and websites with productiviy rating superior to
0 in Rescue Time. Data should be imported from Rescue Time konnector"""
    model: americano.getModel 'RescueTimeActivity', date: Date
    request:
        map: (doc) ->
            if doc.productivity > 0
                emit doc.date.substring(0,10), (doc.duration / 60)
        reduce: (key, values, rereduce) ->
            sum values
