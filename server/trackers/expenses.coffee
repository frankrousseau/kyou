americano = require 'americano-cozy'

module.exports =
    name: "Expenses"
    color: "#297FB8"
    description: """
Sum of every bank operations below 0 (all accounts)."""
    model: americano.getModel 'BankOperation', date: Date
    request:
        map: (doc) ->
            if doc.amount > 0
                emit doc.date.substring(0,10), -1 * doc.amount
        reduce: (key, values, rereduce) ->
            sum values
