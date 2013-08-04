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

_loadRoutes = (app) ->
    routes = require './controllers/routes'
    for path, controllers of routes
        for verb, controller of controllers
            for name, action of controller
                app[verb] path, require("./controllers/#{name}")[action]

_loadPlugin = (app, plugin, callback) ->
    console.log "add plugin: #{plugin}"
    require("./plugins/#{plugin}") app, callback

_loadPlugins = (app, callback) ->
    pluginList = []

    for plugin in fs.readdirSync './plugins'
        # TODO add support or js files
        if plugin.substring(plugin.length - 7, plugin.length) is '.coffee'
            name = plugin.substring 0, plugin.length - 7
            pluginList.push name

    _loadPluginList = (list) ->
        if list.length > 0
            plugin = list.pop()
            _loadPlugin app, plugin, (err) ->
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
    _loadRoutes app
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
