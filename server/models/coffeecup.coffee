americano = require 'americano-cozy'
moment = require 'moment'

module.exports = CoffeeCup = americano.getModel 'CoffeeCup',
    date: Date
    amount: Number

CoffeeCup.getConsumption = (day, callback) ->
    day = moment(day).format 'YYYY-MM-DD'
    CoffeeCup.request 'byDay', key: day, (err, coffeeCups) ->
        if err
            callback err
        else if moods.length isnt 0
            callback null, moods[0]
        else
            callback()
