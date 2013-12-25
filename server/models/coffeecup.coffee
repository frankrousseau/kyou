americano = require 'americano-cozy'
date_helpers = require '../lib/date'

module.exports = CoffeeCup = americano.getModel 'CoffeeCup',
    date: Date
    amount: Number

CoffeeCup.loadTodayConsumption = (callback) ->
    CoffeeCup.request 'byDay', descending: true, (err, coffeeCups) ->
        date_helpers.getTodayModel err, coffeeCups, callback
