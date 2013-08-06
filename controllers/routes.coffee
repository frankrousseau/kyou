moods = require './moods'

module.exports =
    'moods/today':
        get: moods.today
        put: moods.updateToday
