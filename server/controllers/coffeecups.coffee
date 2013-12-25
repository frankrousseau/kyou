CoffeeCup = require '../models/coffeecup'
normalizeResults = require '../lib/normalizer'


# Return all coffeecups sorted by date
module.exports.all = (req, res, next) ->
    CoffeeCup.rawRequest 'nbByDay', (err, rows) ->
        if err then next err
        else
            results = []
            data = normalizeResults rows
            for date, value of data
                dateEpoch = new Date(date).getTime() / 1000
                results.push x: dateEpoch, y: value
            res.send results, 200


# Return the coffeecup of the day
module.exports.today = (req, res, next) ->
    CoffeeCup.getConsumption new Date, (err, coffeecup) ->
        if err then next err
        else if coffeecup? then res.send coffeecup
        else res.send {}


# Update coffeecup of the day if it exists or create it either.
module.exports.updateToday = (req, res, next) ->
    CoffeeCup.getConsumption new Date, (err, coffeecup) ->
        if err then next err
        else if coffeecup?
            coffeecup.amount = req.body.amount
            coffeecup.save (err) ->
                if err then next err
                else res.send coffeecup
        else
            data =
                amount: req.body.amount
                date: new Date
            CoffeeCup.create data, (err, coffeecup) ->
                if err then next err
                else res.send coffeecup
