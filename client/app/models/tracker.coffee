request = require 'lib/request'

{DATE_FORMAT, DATE_URL_FORMAT} = require '../lib/constants'

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


    getPath: (startDate, endDate) ->
        format = DATE_URL_FORMAT
        slug = @get 'slug'

        if slug is 'mood'
            path = 'moods'
        else
            path = slug
        "#{path}/#{startDate.format format}/#{endDate.format format}"


    setMetadata: (field, value) ->
        metadata = @get 'metadata'
        metadata[field] = value
        @set 'metadata', metadata

