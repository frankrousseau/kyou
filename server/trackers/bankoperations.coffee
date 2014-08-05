americano = require 'americano-cozy'

module.exports =
    name: "Bank Operations"
    color: "#297FC8"
    description: """
Sum of every bank operations (all accounts)."""
    model: americano.getModel 'bankoperation', date: Date
    request:
        map: (doc) ->
            emit doc.date.substring(0,10), doc.amount
        reduce: (key, values, rereduce) ->
            sum values
