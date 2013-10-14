americano = require 'americano-cozy'
date_helpers = require '../lib/date'
TrackerAmount = require './trackeramount'

module.exports = Tracker = americano.getModel 'Tracker',
    name: String
    description: String

Tracker::loadTodayAmount = (callback) ->
    console.log @id
    params = startkey: [@id], endkey: [@id + "0"], descending: false
    TrackerAmount.request 'byDay', params, (err, trackerAmounts) ->
        console.log trackerAmounts
        date_helpers.getTodayModel err, trackerAmounts, callback
