americano = require 'americano-cozy'
date_helpers = require '../lib/date'

module.exports = americano.getModel 'TrackerAmount',
    tracker: String
    date: Date
    amount: Number
