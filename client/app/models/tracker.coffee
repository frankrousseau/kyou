request = require 'lib/request'


module.exports = class TrackerModel extends Backbone.Model
    rootUrl: "trackers"


    getDay: (day, callback) ->
        id = @get 'id'
        id = @id unless id?
        path = "trackers/#{id}/day/#{day.format 'YYYY-MM-DD'}"
        request.get path, (err, tracker) ->
            if err then callback err
            else
                if tracker.amount?
                    callback null, new TrackerModel tracker
                else
                    callback null, null


    updateDay: (day, amount, callback) ->
        id = @get 'id'
        id = @id unless id?
        path = "trackers/#{id}/day/#{day.format 'YYYY-MM-DD'}"
        request.put path, amount: amount, callback

