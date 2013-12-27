americano = require 'americano-cozy'

module.exports =
    name: "Sleep Duration - Jawbone"
    color: "#2D3E50"
    description: """
Number of minutes you sleep every day. Data should be imported from Jawbone
Konnector."""
    model: americano.getModel 'JawboneSleep', date: Date
    request:
        map: (doc) ->
            emit doc.date.substring(0,10), (doc.sleepDuration / 60)
        reduce: (key, values, rereduce) ->
            sum values
