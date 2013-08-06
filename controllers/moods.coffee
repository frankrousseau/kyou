Mood = require '../models/mood'

loadTodayMood = (next, callback) ->
    Mood.request 'moodByDay', (err, moods) ->
        if err
            console.log err
            next err
        else if moods.length isnt 0
            mood = moods[0]
            console.log mood
            mood.id = mood._id
            callback mood
        else
            callback null

module.exports.today = (req, res, next) ->
    loadTodayMood next, (mood) ->
        if mood? then res.send mood
        else res.send {}

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
