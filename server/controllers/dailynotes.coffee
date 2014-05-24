DailyNote = require '../models/dailynote'
moment = require 'moment'


# Return the note of the day
module.exports.day = (req, res, next) ->
    DailyNote.getDailyNote req.day, (err, dailynote) ->
        if err then next err
        else if dailynote? then res.send dailynote
        else res.send {}


# Update note of the day if it exists or create it either.
module.exports.updateDay = (req, res, next) ->
    DailyNote.getDailyNote req.day, (err, dailynote) ->
        if err then next err
        else if dailynote?
            dailynote.text = req.body.text
            dailynote.save (err) ->
                if err then next err
                else res.send dailynote
        else
            data =
                text: req.body.text
                date: req.day
            DailyNote.create data, (err, dailynote) ->
                if err then next err
                else res.send dailynote

# Send all notes
module.exports.all = (req, res, next) ->
    DailyNote.request 'byDay', (err, dailynotes) ->
        if err then next err
        else res.send dailynotes
