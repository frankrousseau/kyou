Mood = require '../models/mood'


loadTodayMood = (next, callback) ->
    Mood.request 'moodByDay', (err, moods) ->
        if err
            next err
        else if moods.length isnt 0
            mood = moods[0]
            # TODO big bug
            # ensure that mood is the last of the day

            mood.id = mood._id
            callback mood
        else
            callback null


# Return all moods sorted by date
module.exports.all = (req, res, next) ->
    Mood.request 'moodByDay', (err, moods) ->
        if err then next err
        else res.send moods


# Return the mood of the day
module.exports.today = (req, res, next) ->
    loadTodayMood next, (mood) ->
        if mood? then res.send mood
        else res.send {}


# Update mood of the day if it exists or create it either.
module.exports.updateToday = (req, res, next) ->
    loadTodayMood next, (mood) ->
        if mood?
            mood.status = req.body.status
            mood.save (err) ->
                if err then next err
                else res.send mood
        else
            data =
                status: req.body.status
                date: new Date
            Mood.create data, (err, mood) ->
                if err then next err
                else res.send mood
