DailyNote = require '../models/dailynote'
moment = require 'moment'


# Return the note of the day
module.exports.day = (req, res, next) ->
    day = moment req.params.day
    day.hours 0, 0, 0, 0
    DailyNote.getDailyNote day, (err, dailynote) ->
        if err then next err
        else if dailynote? then res.send dailynote
        else res.send {}


# Update note of the day if it exists or create it either.
module.exports.updateDay = (req, res, next) ->
    day = moment req.params.day
    day.hours 0, 0, 0, 0
    DailyNote.getDailyNote day, (err, dailynote) ->
        if err then next err
        else if dailynote?
            dailynote.text = req.body.text
            dailynote.save (err) ->
                if err then next err
                else res.send dailynote
        else
            data =
                text: req.body.text
                date: day
            DailyNote.create data, (err, dailynote) ->
                if err then next err
                else res.send dailynote
