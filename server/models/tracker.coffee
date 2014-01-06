americano = require 'americano-cozy'

date_helpers = require '../lib/date'
TrackerAmount = require './trackeramount'

module.exports = Tracker = americano.getModel 'Tracker',
    name: String
    description: String

# Get amount for given and curren tracker.
# Null is return is no amount exit for given day.
Tracker::getAmount = (day, callback) ->
    params = key: [@id, day.format 'YYYY-MM-DD']
    TrackerAmount.request 'byDay', params, (err, trackerAmounts) ->
        if err
            callback err
        else if trackerAmounts.length isnt 0
            callback null, trackerAmounts[0]
        else
            callback()
