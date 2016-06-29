BaseView = require 'lib/base_view'
request = require 'lib/request'
graph = require 'lib/graph'
calculus = require 'lib/calculus'
MainState =  require '../main_state'


# Item View for the albums list.
module.exports = class BasicTrackerItem extends BaseView
    className: 'tracker line'
    template: require 'views/templates/basic_tracker_list_item'

    subscriptions:
        'data:created': 'onDataChanged'
        'data:removed': 'onDataChanged'

    load: (callback) ->
        @$(".graph-container").spin true

        path = @model.getPath MainState.startDate, MainState.endDate
        request.get path, (err, data) =>
            if err
                alert "An error occured while retrieving data"
            else
                @$(".graph-container").spin false
                @data = data
                MainState.data[@model.get 'slug'] = data
                @drawCharts()
                callback() if callback?


    onDataChanged: (event) ->
        slug = @model.get('slug') or ''
        if (event.doctype is 'sleep' and slug is 'sleep-duration') \
        or (event.doctype is 'steps' and slug is 'steps')
            console.log slug

            if not @timeout?
                console.log 'reload'
                @timeout = setTimeout =>
                    @timeout = null
                    @load()
                , 2000


    drawCharts: ->

        if @data?
            width = @$(".graph-container").width()

            el = @$('.chart')[0]
            yEl = @$('.y-axis')[0]
            color = @model.get 'color'
            data = MainState.data[@model.get 'slug']
            metadata = @model.get('metadata') or {}
            graphStyle = metadata.style or 'bar'

            data ?= calculus.getDefaultData()

            graph.clear(el, yEl)
            graph.draw {el, yEl, width, color, data, graphStyle}

