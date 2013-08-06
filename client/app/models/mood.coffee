Model = require 'lib/model'
request = require 'lib/request'

module.exports = class Mood extends Model
    urlRoot: 'moods/'

    @getLast: (callback) ->
        request.get 'moods/today/', (err, mood) ->
            if err then callback err
            else
                if mood.status?
                    callback null, new Mood mood
                else
                    callback null, null

    @updateLast: (status, callback) ->
        request.put 'moods/today/', status: status, callback
