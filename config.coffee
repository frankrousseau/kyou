express = require 'express'

config =
    common: [
        express.bodyParser()
        express.methodOverride()
        express.errorHandler
            dumpExceptions: true
            showStack: true
        express.static __dirname + '/client/public',
            maxAge: 86400000
    ]
    development: [
        express.logger 'dev'
    ]
    production: [
        express.logger 'short'
    ]

module.exports = config
