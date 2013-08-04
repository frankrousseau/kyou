express = require 'express'
fs = require 'fs'

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

_loadPlugins = (app, callback) ->
    pluginList = []
    for plugin in fs.readdirSync './plugins'
        # TODO add support or js files
        if plugin.substring(plugin.length - 7, plugin.length) is '.coffee'
            name = plugin.substring 0, plugin.length - 7
            pluginList.push name

    _loadPlugin = (plugin, cb) ->
        console.log "add plugin: #{plugin}"
        require("./plugins/#{plugin}") app, cb

    _loadPluginList = (list) ->
        if list.length > 0
            _loadPlugin list.pop(), (err) ->
                if err
                    console.log "#{plugin} failed to load."
                else
                    console.log "#{plugin} loaded."
                _loadPluginList list
        else
            callback()

    _loadPluginList pluginList

_new = (callback) ->
    app = americano()
    _configure app
    _setRoutes app
    _loadPlugins app, ->
        callback app

americano.start = (options, callback) ->
    port = options.port || 3000
    _new (app) ->
        app.listen port
        options.name ?= "Americano"
        console.log "#{options.name} server is listening on port #{port}..."
        console.info "Configuration for #{process.env.NODE_ENV} loaded."

        callback app if callback?
