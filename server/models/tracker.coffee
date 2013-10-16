americano = require 'americano-cozy'
date_helpers = require '../lib/date'
TrackerAmount = require './trackeramount'

module.exports = Tracker = americano.getModel 'Tracker',
    name: String
    description: String

Tracker::loadTodayAmount = (callback) ->
    params = startkey: [@id + "0"], endkey: [@id], descending: true
    TrackerAmount.request 'byDay', params, (err, trackerAmounts) ->
        date_helpers.getTodayModel err, trackerAmounts, callback
