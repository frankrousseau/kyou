americano = require 'cozydb'

module.exports =
    name: "Commits"
    color: "#408000"
    description: """
This tracker counts your amount of commits on a daily basis.
"""
    model: americano.getModel 'commit', date: Date
    request:
        map: (doc) ->
            emit doc.date.substring(0,10), 1
        reduce: (key, values, rereduce) ->
            sum values
