americano = require 'cozydb'

module.exports =
    name: "Emails"
    color: "#D35400"
    description: """
Number of emails stored in your Cozy."""
    model: americano.getModel 'message', date: Date
    request:
        map: (doc) ->
            emit doc.date.substring(0,10), 1
        reduce: (key, values, rereduce) ->
            sum values
