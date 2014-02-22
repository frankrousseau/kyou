BaseView = require 'lib/base_view'
request = require 'lib/request'

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
        width = @$(".graph-container").width() - 30
        graph = new Rickshaw.Graph(
            element: @$('.chart')[0]
            width: width - 40
            height: 300
            renderer: 'bar'
            series: [
                color: @model.get 'color'
                data: @data
            ]
        )

        x_axis = new Rickshaw.Graph.Axis.Time graph: graph
        y_axis = new Rickshaw.Graph.Axis.Y
             graph: graph
             orientation: 'left'
             tickFormat: Rickshaw.Fixtures.Number.formatKMBT
             element: @$('.y-axis')[0]

        graph.render()

        hoverDetail = new Rickshaw.Graph.HoverDetail
            graph: graph,
            xFormatter: (x) ->
                moment(x * 1000).format 'MM/DD/YY'
            formatter: (series, x, y) ->
                Math.floor y

        graph
