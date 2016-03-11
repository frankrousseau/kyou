Model = require 'lib/model'
request = require 'lib/request'

{DATE_URL_FORMAT} = require 'lib/constants'

module.exports = class Mood extends Model
    urlRoot: 'moods/'


    @getDay: (day, callback) ->
        request.get "moods/mood/#{day.format DATE_URL_FORMAT}", (err, mood) ->
            if err then callback err
            else if mood.status?
                callback null, new Mood mood
            else
                callback null, null


    @updateDay: (day, status, callback) ->
        path = "moods/mood/#{day.format DATE_URL_FORMAT}"
        request.put path, status: status, callback

