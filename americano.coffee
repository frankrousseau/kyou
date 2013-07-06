express = require 'express'

class exports.Americano

    constructor: ->
        @app = express()

        @_configure()
        @_setRoutes()

    start: (options) ->
        @app.listen options.port
        console.log "Americano server is listening on port 3000..."
        console.info "Configuration for #{process.env.NODE_ENV} loaded."

    _configure: ->
        config = require './config'
        process.env.NODE_ENV = 'development' unless process.env.NODE_ENV?
        @_configureEnv env, middlewares for env, middlewares of config

    _setRoutes: ->
        @app.get '/', (req, res) -> res.end "Hello coffee drinker"

    _configureEnv: (env, middlewares) ->
        if env is 'common'
            @app.use middleware for middleware in middlewares
        else
            @app.configure env, =>
                @app.use middleware for middleware in middlewares
