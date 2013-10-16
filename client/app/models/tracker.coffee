request = require 'lib/request'

module.exports = class TrackerModel extends Backbone.Model
    rootUrl: "trackers"

    getLast: (callback) ->
        id = @get 'id'
        id = @id unless id?
        request.get "trackers/#{id}/today", (err, tracker) ->
            if err then callback err
            else
                if tracker.amount?
                    callback null, new TrackerModel tracker
                else
                    callback null, null

    updateLast: (amount, callback) ->
        id = @get 'id'
        id = @id unless id?
        request.put "trackers/#{id}/today", amount: amount, callback
