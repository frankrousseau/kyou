BaseView = require 'lib/base_view'
request = require 'lib/request'
graph = require 'lib/graph'
normalizer = require 'lib/normalizer'
calculus = require 'lib/calculus'

MainState = require '../main_state'
{DATE_FORMAT, DATE_URL_FORMAT} = require '../lib/constants'


# Item View for the albums list
module.exports = class TrackerItem extends BaseView
    className: 'tracker line'
    template: require 'views/templates/tracker_list_item'


    events:
        'click .up-btn': 'onUpClicked'
        'click .down-btn': 'onDownClicked'
        'click .save-tracker-value': 'onSaveClicked'


    afterRender: =>
        @$('.tracker-current-date').pikaday
            maxDate: new Date()
            format: DATE_FORMAT
            defaultDate: MainState.endDate.toDate()
            setDefaultDate: true
            onSelect: (value) =>
                @loadCurrentDay()
        @$('.tracker-new-value').numeric()

        @loadCurrentDay()


    loadCurrentDay: =>
        if @model.get 'id'
            day = moment @$('.tracker-current-date').val()
            @model.getDay day, (err, amount) =>
                if err
                    alert "An error occured while retrieving tracker data"
                else if not amount?
                    @$('.tracker-current-value').html 'no value set'
                else
                    @$('.tracker-current-value').html amount.get 'amount'
        else
            setTimeout @loadCurrentDay, 500


    onSaveClicked: (event) ->
        day = moment @$('.tracker-current-date').val()
        amount = @$('.tracker-new-value').val()
        amount = parseFloat amount

        label = @$('.tracker-current-value')
        label.spin true
        @model.updateDay day, amount, (err) =>
            label.spin false

            if err
                alert 'An error occured while saving tracker amount'
            else
                label.html amount

                if day >= MainState.startDate and day <= MainState.endDate
                    i = 0
                    while i < @data.length and moment(@data[i].x * 1000) < day
                        i++

                    if @data[i]? and moment(@data[i].x * 1000).format('YYYY-MM-DD') is moment(day).format('YYYY-MM-DD')
                        @data[i] = {x: moment(day).toDate().getTime() / 1000, y: amount}
                    else
                        @data.splice i, 0, {x: moment(day).toDate().getTime() / 1000, y: amount}

                    @$('.chart').html null
                    @$('.y-axis').html null
                    @drawCharts()


    load: (callback) ->
        @$(".graph-container").spin true

        path = @model.getPath MainState.startDate, MainState.endDate
        request.get path, (err, data) =>
            if err
                alert "An error occured while retrieving data"
            else
                @$(".graph-container").spin false
                @data = data
                MainState.data[@model.get 'id'] = data

                @drawCharts()
            callback() if callback?


    drawCharts: ->
        if @data?
            width = @$(".graph-container").width() - 70
            el = @$('.chart')[0]
            yEl = @$('.y-axis')[0]
            color = 'black'
            data = MainState.data[@model.get 'id']
            graphStyle = @model.get('metadata').style or 'bar'

            data ?= calculus.getDefaultData()

            graph.draw {el, yEl, width, color, data, graphStyle}


    redrawGraph: ->
        @drawCharts()

