americano = require 'cozydb'

module.exports =
    name: "Bank Operations"
    color: "#4CAF50"
    description: """
Sum of every bank operations (all accounts)."""
    model: americano.getModel 'bankoperation', date: Date
    requestName: 'allOpsByDay'
    request:
        map: (doc) ->
            emit doc.date.substring(0,10), doc.amount
        reduce: (key, values, rereduce) ->
            sum values
