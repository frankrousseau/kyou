module.exports =

    initialize: ->
        # Initialize spinner tool.
        $.fn.spin = (opts, color) ->
            presets =
                tiny:
                    lines: 8
                    length: 2
                    width: 2
                    radius: 3

                small:
                    lines: 8
                    length: 1
                    width: 2
                    radius: 5

                large:
                    lines: 10
                    length: 8
                    width: 4
                    radius: 8

            if Spinner
                @each ->
                    $this = $(this)
                    spinner = $this.data("spinner")
                    if spinner?
                        spinner.stop()
                        $this.data "spinner", null
                    else if opts isnt false
                        if typeof opts is "string"
                            if opts of presets
                                opts = presets[opts]
                            else
                                opts = {}
                            opts.color = color if color
                        spinner = new Spinner(
                            $.extend(color: $this.css("color"), opts))
                        spinner.spin(this)
                        $this.data "spinner", spinner

            else
                console.log 'Spinner class is not available'

        # Routing management
        Router = require 'router'
        @router = new Router()
        Backbone.history.start()

        # Makes this object immuable.
        Object.freeze this if typeof Object.freeze is 'function'

