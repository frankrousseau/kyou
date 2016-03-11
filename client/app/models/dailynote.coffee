Model = require 'lib/model'
request = require 'lib/request'

{DATE_URL_FORMAT} = require 'lib/constants'

module.exports = class DailyNote extends Model
    urlRoot: 'dailynotes/'


    @getDay: (day, callback) ->
        path = "dailynotes/#{day.format DATE_URL_FORMAT}"
        request.get path, (err, dailynote) ->
            if err then callback err
            else if dailynote.text?
                callback null, new DailyNote dailynote
            else
                callback null, null


    @updateDay: (day, text, callback) ->
        path = "dailynotes/#{day.format DATE_URL_FORMAT}"
        request.put path, text: text, callback

