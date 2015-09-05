BaseView = require 'lib/base_view'
request = require 'lib/request'
graph = require 'lib/graph'
MainState =  require '../main_state'


# Item View for the albums list.
module.exports = class BasicTrackerItem extends BaseView
    className: 'tracker line'
    template: require 'views/templates/basic_tracker_list_item'


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


    drawCharts: ->
        if @data?
            width = @$(".graph-container").width() - 70
            el = @$('.chart')[0]
            yEl = @$('.y-axis')[0]
            color = @model.get 'color'
            data = MainState.data[@model.get 'slug']

            data ?= [
                x: MainState.startDate.toDate().getTime() / 1000
                y: 0
            ,
                x: MainState.endDate.toDate().getTime() / 1000
                y: 0
            ]

            graph.draw {el, yEl, width, color, data}

