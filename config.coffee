express = require 'express'

config =
    common: [
        express.bodyParser()
        express.methodOverride()
    ]
    development: [
        express.logger 'dev'
    ]
    production: [
        express.logger 'short'
    ]

module.exports = config
