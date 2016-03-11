request = require 'lib/request'

{DATE_FORMAT, DATE_URL_FORMAT} = require '../lib/constants'


module.exports = class TrackerModel extends Backbone.Model
    rootUrl: "trackers"


    constructor: ->
        super

        @set 'metadata', {} if not @get('metadata')?


    getDay: (day, callback) ->
        id = @get 'id'
        id = @id unless id?
        path = "trackers/#{id}/day/#{day.format 'YYYY-MM-DD'}"
        request.get path, (err, tracker) ->
            if err then callback err
            else if tracker.amount?
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
        id = @get 'id'

        start = startDate.format format
        end = endDate.format format
        "trackers/#{id}/amounts/#{start}/#{end}"


    setMetadata: (field, value) ->
        metadata = @get 'metadata'
        metadata[field] = value
        @set 'metadata', metadata

