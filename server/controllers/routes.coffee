moods = require './moods'
tasks = require './tasks'
mails = require './mails'
coffeecups = require './coffeecups'
trackers = require './trackers'

module.exports =
    'trackerId': param: trackers.loadTracker
    'tasks':
        get: tasks.all
    'mails':
        get: mails.all
    'moods':
        get: moods.all
    'moods/today':
        get: moods.today
        put: moods.updateToday
    'coffeecups':
        get: coffeecups.all
    'coffeecups/today':
        get: coffeecups.today
        put: coffeecups.updateToday
    'trackers':
        get: trackers.all
        post: trackers.create
    'trackers/:trackerId':
        put: trackers.update
        del: trackers.destroy
    'trackers/:trackerId/today':
        get: trackers.today
        put: trackers.updateTodayValue
