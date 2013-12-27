americano = require 'americano'
initTrackers = require './server/init/trackers'

process.env.TZ = 'UTC'

port = process.env.PORT || 9260
americano.start name: 'kyou', port: port, (app) ->
    initTrackers app
