request = require 'lib/request'

module.exports = class TrackerModel extends Backbone.Model
    rootUrl: "trackers"

    getLast: (callback) ->
        request.get "trackers/#{@get 'id'}/today", (err, tracker) ->
            if err then callback err
            else
                if tracker.amount?
                    callback null, new TrackerModel tracker
                else
                    callback null, null

    updateLast: (amount, callback) ->
        request.put "trackers/#{@get 'id'}/today", amount: amount, callback
