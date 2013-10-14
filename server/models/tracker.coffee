americano = require 'americano-cozy'
date_helpers = require '../lib/date'
TrackerAmount = require './trackeramount'

module.exports = Tracker = americano.getModel 'Tracker',
    name: String
    description: String

Tracker::loadTodayAmount = (callback) ->
    params = startkey: [@id], endkey: [@id + "0"], descending: false
    TrackerAmount.request 'byDay', params, (err, trackerAmounts) ->
        date_helpers.getTodayModel err, trackerAmounts, callback
