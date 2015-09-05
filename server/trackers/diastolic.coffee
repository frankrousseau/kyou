americano = require 'cozydb'

module.exports =
    name: "Blood Pressure - diastolic"
    color: "#2FAD5B"
    description: """
Your diastolic blood pressure."""
    model: americano.getModel 'BloodPressure', date: Date
    request:
        map: (doc) ->
            emit doc.date.substring(0,10), doc.diastolic
        reduce: (key, values, rereduce) ->
            sum(values) / values.length
