BaseView = require 'lib/base_view'
request = require 'lib/request'

# Item View for the albums list
module.exports = class TrackerItem extends BaseView
    className: 'tracker line'
    template: require 'views/templates/tracker_list_item'

    events:
        'click .remove-btn': 'onRemoveClicked'
        'click .up-btn': 'onUpClicked'
        'click .down-btn': 'onDownClicked'

    onRemoveClicked: =>
        answer = confirm "Are you sure that you want to delete this tracker?"
        if answer
            @model.destroy
                success: =>
                    @remove()
                error: ->
                    alert 'something went wrong while removing tracker.'

    afterRender: =>
        getData = =>
            @model.getLast (err, amount) =>
                if err
                    alert "An error occured while retrieving tracker data"
                else if not amount?
                    @$('.current-amount').html(
                        'Set value for today')
                else
                    @$('.current-amount').html amount.get 'amount'
                @getAnalytics()

        if @model.id?
            getData()
        else
            setTimeout getData, 1000

    onUpClicked: (event) ->
        @model.getLast (err, amount) =>
            if err
                alert 'An error occured while retrieving data'
                return
            else if amount? and amount.get('amount')?
                amount = amount.get 'amount'
            else
                amount = 0

            amount++
            label = @$('.current-amount')

            button = $(event.target)
            label.css 'color', 'transparent'
            label.spin 'tiny', color: '#444'
            @model.updateLast amount, (err) =>
                label.spin()
                label.css 'color', '#444'
                if err
                    alert 'An error occured while saving data'
                else
                    label.html amount
                    @data[@data.length - 1]['y'] = amount
                    @$('.chart').html null
                    @$('.y-axis').html null
                    @redrawGraph()


    onDownClicked: (event) ->
        @model.getLast (err, amount) =>
            if err then alert 'An error occured while retrieving data'
            if amount? and amount.get('amount')?
                amount = amount.get 'amount'
            else
                amount = 0

            amount-- if amount > 0
            label = @$('.current-amount')

            button = $(event.target)
            label.css 'color', 'transparent'
            label.spin 'tiny', color: '#444'
            @model.updateLast amount, (err) =>
                label.spin()
                label.css 'color', '#444'
                if err
                    alert 'An error occured while saving data'
                else
                    label.html amount
                    @data[@data.length - 1]['y'] = amount
                    @$('.chart').html null
                    @$('.y-axis').html null
                    @redrawGraph()


    getAnalytics: ->
        @$(".graph-container").spin 'tiny'
        request.get "trackers/#{@model.get 'id'}/amounts", (err, data) =>
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
            width: width
            height: 300
            renderer: 'bar'
            series: [
                color: "black"
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
        graph