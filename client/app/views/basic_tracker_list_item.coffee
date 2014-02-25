BaseView = require 'lib/base_view'
request = require 'lib/request'
graph = require 'lib/graph'

# Item View for the albums list
module.exports = class BasicTrackerItem extends BaseView
    className: 'tracker line'
    template: require 'views/templates/basic_tracker_list_item'

    afterRender: =>
        day = window.app.mainView.currentDate
        @getAnalytics()

    getAnalytics: ->
        @$(".graph-container").spin 'tiny'
        day = window.app.mainView.currentDate.format "YYYY-MM-DD"
        request.get @model.get('path'), (err, data) =>
            if err
                alert "An error occured while retrieving data"
            else
                @$(".graph-container").spin()
                @data = data
                @drawCharts()

    redrawGraph: ->
        @drawCharts()

    drawCharts: ->
        width = @$(".graph-container").width() - 70
        el = @$('.chart')[0]
        yEl = @$('.y-axis')[0]
        color = @model.get 'color'

        graph.draw el, yEl, width, color, @data
