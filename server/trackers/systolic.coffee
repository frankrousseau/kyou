americano = require 'cozydb'

module.exports =
    name: "Blood Pressure - systolic"
    color: "#2FAD5B"
    description: """
Your systolic blood pressure."""
    model: americano.getModel 'BloodPressure', date: Date
    request:
        map: (doc) ->
            emit doc.date.substring(0,10), doc.systolic
        reduce: (key, values, rereduce) ->
            sum(values) / values.length
