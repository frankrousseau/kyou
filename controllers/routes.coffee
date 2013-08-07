moods = require './moods'
tasks = require './tasks'
mails = require './mails'

module.exports =
    'tasks':
        get: tasks.all
    'mails':
        get: mails.all
    'moods':
        get: moods.all
    'moods/today':
        get: moods.today
        put: moods.updateToday
