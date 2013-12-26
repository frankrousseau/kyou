americano = require 'americano'

process.env.TZ = 'UTC'

port = process.env.PORT || 9260
americano.start name: 'kyou', port: port
