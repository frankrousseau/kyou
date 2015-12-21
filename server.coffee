americano = require 'americano'
initTrackers = require './server/init/trackers'
RealtimeAdapter = require 'cozy-realtime-adapter'

process.env.TZ = 'UTC'

port = process.env.PORT || 9260
americano.start name: 'kyou', port: port, (err, app, server) ->

    realtime = RealtimeAdapter server, [
        'sleep.create'
        'sleep.delete'
        'steps.create'
        'steps.delete'
    ]

    initTrackers app

