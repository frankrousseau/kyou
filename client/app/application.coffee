EventListener = require '../lib/event_listener'

module.exports =

    initialize: ->

        # Routing management
        Router = require 'router'
        @router = new Router()
        Backbone.history.start()

        listener = new EventListener

        # Makes this object immuable.
        Object.freeze this if typeof Object.freeze is 'function'

