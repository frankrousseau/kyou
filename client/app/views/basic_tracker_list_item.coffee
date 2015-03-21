BaseView = require 'lib/base_view'
request = require 'lib/request'
graph = require 'lib/graph'
normalizer = require 'lib/normalizer'

# Item View for the albums list
module.exports = class BasicTrackerItem extends BaseView
    className: 'tracker line'
    template: require 'views/templates/basic_tracker_list_item'

    afterRender: (callback) =>
        day = window.app.mainView.currentDate
        @getAnalytics callback

    getAnalytics: (callback) ->
        @$('.graph-container').spin 'tiny'
        day = window.app.mainView.currentDate.format 'YYYY-MM-DD'
        request.get @model.get('path') + '/' + day, (err, data) =>
            if err
                alert 'An error occured while retrieving data'
            else
                @$('.graph-container').spin()
                @data = data
                @drawCharts()
            callback() if callback?

    redrawGraph: ->
        @drawCharts()

    drawCharts: ->
        width = @$('.graph-container').width() - 70
        el = @$('.chart')[0]
        yEl = @$('.y-axis')[0]
        color = @model.get 'color'

        data = normalizer.getSixMonths @data
        #if @$el.is 'visible'
        graph.draw el, yEl, width, color, data
