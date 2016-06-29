americano = require 'americano'
initTrackers = require './server/init/trackers'
RealtimeAdapter = require 'cozy-realtime-adapter'

process.env.TZ = 'UTC'

port = process.env.PORT || 9260
host = process.env.HOST || '127.0.0.1'
americano.start name: 'kyou', port: port, host: host, (err, app, server) ->

    realtime = RealtimeAdapter server, [
        'sleep.create'
        'sleep.delete'
        'steps.create'
        'steps.delete'
    ]

    initTrackers app

