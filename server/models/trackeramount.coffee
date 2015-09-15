americano = require 'cozydb'
date_helpers = require '../lib/date'

module.exports = TrackerAmount = americano.getModel 'TrackerAmount',
    tracker: String
    date: Date
    amount: Number


TrackerAmount.destroyAll = (tracker, callback) ->
    params = startkey: [tracker.id], endkey: [tracker.id + "0"]
    TrackerAmount.requestDestroy 'byDay', params, callback

