moods = require './moods'
tasks = require './tasks'

module.exports =
    'tasks':
        get: tasks.all
    'moods':
        get: moods.all
    'moods/today':
        get: moods.today
        put: moods.updateToday
