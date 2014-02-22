Model = require 'lib/model'
request = require 'lib/request'

module.exports = class DailyNote extends Model
    urlRoot: 'dailynotes/'

    @getDay: (day, callback) ->
        request.get "dailynotes/#{day.format 'YYYY-MM-DD'}", (err, dailynote) ->
            if err then callback err
            else
                if dailynote.text?
                    callback null, new DailyNote dailynote
                else
                    callback null, null

    @updateDay: (day, text, callback) ->
        path = "dailynotes/#{day.format 'YYYY-MM-DD'}"
        request.put path, text: text, callback
