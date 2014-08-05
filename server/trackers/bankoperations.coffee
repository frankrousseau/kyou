americano = require 'americano-cozy'

module.exports =
    name: "Bank Operations"
    color: "#297FC8"
    description: """
Sum of every bank operations (all accounts)."""
    model: americano.getModel 'bankoperation', date: Date
    request:
        map: (doc) ->
            sign = 1
            if doc.amount < 0
                sign = -1
            emit doc.date.substring(0,10), (sign * doc.amount)
        reduce: (key, values, rereduce) ->
            sum values
