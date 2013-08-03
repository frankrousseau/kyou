express = require 'express'

module.exports = americano = express

_configure = (app) ->
    config = require './config'
    process.env.NODE_ENV = 'development' unless process.env.NODE_ENV?
    _configureEnv app, env, middlewares for env, middlewares of config

_configureEnv = (app, env, middlewares) ->
    if env is 'common'
        app.use middleware for middleware in middlewares
    else
        app.configure env, =>
            app.use middleware for middleware in middlewares

_setRoutes = (app) ->
    app.get '/', (req, res) -> res.end "Hello coffee drinker!"

_new = ->
    app = americano()
    _configure app
    _setRoutes app
    app

americano.start = (options) ->
    app = _new()
    port = options.port || 3000
    app.listen port
    options.name ?= "Americano"
    console.log "#{options.name} server is listening on port #{port}..."
    console.info "Configuration for #{process.env.NODE_ENV} loaded."

    app

