americano = require 'cozydb'

module.exports =
    name: "Steps"
    color: "#D35400"
    description: """
Number of steps you walked."""
    model: americano.getModel 'steps', date: Date
    request:
        map: (doc) ->
            emit doc.date.substring(0,10), doc.steps
        reduce: (key, values, rereduce) ->
            sum values
