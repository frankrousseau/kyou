Model = require 'lib/model'
request = require 'lib/request'


module.exports = class Mood extends Model
    urlRoot: 'moods/'


    @getDay: (day, callback) ->
        request.get "moods/mood/#{day.format 'YYYY-MM-DD'}", (err, mood) ->
            if err then callback err
            else
                if mood.status?
                    callback null, new Mood mood
                else
                    callback null, null


    @updateDay: (day, status, callback) ->
        path = "moods/mood/#{day.format 'YYYY-MM-DD'}"
        request.put path, status: status, callback


    getPath: (startDate, endDate) ->
        format = DATE_URL_FORMAT
        path = 'moods'
        "#{path}/#{startDate.format format}/#{endDate.format format}"


    setMetadata: (field, value) ->
        metadata = @get 'metadata'
        metadata[field] = value
        @set 'metadata', metadata


    loadMetadata: (callback) ->
        request.get 'metadata/basic-trackers/mood', (err, metadata) =>
            if err
                alert 'Cannot load metadata for mood'

            else
                @set 'metadata', metadata

            callback metadata

