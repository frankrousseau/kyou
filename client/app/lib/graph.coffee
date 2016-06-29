module.exports = graphUtils =

    # Draw a graph following the Risckshaw lib conventions.
    #
    # Options required:
    #
    # * el: DOM element to draw the graph
    # * yEl: DOM element for ordinates
    # * width: width of the graph
    # * color: color of the displayed bars/lines/points
    # * data: the data to build the graph with
    # * graphStyle: bars, lines or points.
    # * comparisonData: second graph to draw (useful to compare two sets of
    # data).
    # * time: ?
    # * goal: add a horizontal line to show the user's goal.
    #
    draw: (opts) ->
        {
            el, yEl, width, color, data, graphStyle, comparisonData, time, goal
        } = opts

        # Default graph style is bar.
        graphStyle = "bar" unless graphStyle?

        # Build graph options depending of if there is something to compare.
        if comparisonData?
            series = [
                    color: color
                    data: data
                    renderer: graphStyle
                ,
                    color: 'red'
                    data: comparisonData
                    renderer: graphStyle
            ]
        else
            series = [
                color: color
                data: data
                renderer: graphStyle
            ]

        # Add the goal for every where there is data.
        # TODO: simplify it to only have two points.
        if goal?
            goal = parseInt goal
            goalData = []
            for point in data
                goalData.push
                    x: point.x
                    y: goal
            series.push
                color: 'rgba(200, 200, 220, 0.8)'
                renderer: 'line'
                data: goalData


        # Build rickshaw object
        unless graphUtils.isSmallScreen()
            width -= 130
        else
            width -= 20

        graph = new Rickshaw.Graph(
            element: el
            width: width
            height: 300
            series: series
            interpolation: 'linear'
            renderer: 'multi'
            min: 'auto'
        )

        # Add axis
        if not time? or time
            x_axis = new Rickshaw.Graph.Axis.Time graph: graph
        else
            x_axis = new Rickshaw.Graph.Axis.X graph: graph
        y_axis = new Rickshaw.Graph.Axis.Y
             graph: graph
             orientation: 'left'
             tickFormat: Rickshaw.Fixtures.Number.formatKMBT
             element: yEl

        # Render Graph
        graph.render()

        # Add fancy stuff
        unless graphUtils.isSmallScreen()
            hoverDetail = new Rickshaw.Graph.HoverDetail
                graph: graph,
                xFormatter: (x) ->
                    moment(x * 1000).format 'MM/DD/YY'
                formatter: (series, x, y) ->
                    "#{moment(x * 1000).format 'MM/DD/YY'}: #{y}"

        graph


    # Graph cleaning based on DOM elements given for grap and ordinate axis.
    clear: (el, yEl) ->
        $(el).html null
        $(yEl).html null


    getWeekData: (data) ->
        @getAggregateData data, 'day'


    getMonthData: (data) ->
        @getAggregateData data, 'date'


    getAggregateData: (data, timeFunc) ->
        graphData = {}

        for entry in data
            date = moment new Date(entry.x * 1000)
            date = date[timeFunc] 1
            epoch = date.unix()

            if graphData[epoch]?
                graphData[epoch] += entry.y
            else
                graphData[epoch] = entry.y

        graphDataArray = []
        for epoch, value of graphData
            graphDataArray.push
                x: parseInt(epoch)
                y: value

        graphDataArray = _.sortBy graphDataArray, (entry) -> entry.x

        return graphDataArray


    # Ensure that the two sets of compared data are on the same scale for the
    # ordinate axis.
    normalizeComparisonData: (data, comparisonData) ->

        # Get max.
        maxData = 0
        for entry in data
            maxData = entry.y if entry.y > maxData

        maxComparisonData = 0
        for entry in comparisonData
            maxComparisonData = entry.y if entry.y > maxComparisonData

        # Calculus for normalizer
        if maxComparisonData > 0
            factor = maxData / maxComparisonData
        else
            factor = 1

        # Add an entry if there is no match (required by rickshaw)
        dataDict = {}
        comparisonDataDict = {}

        for entry in data
            dataDict[entry.x] = entry
            comparisonDataDict[entry.x] ?=
                x: entry.x
                y: 0

        for entry in comparisonData
            comparisonDataDict[entry.x] = entry
            dataDict[entry.x] ?=
                x: entry.x
                y: 0

        # Build results
        newData = []
        newComparisonData = []
        newData.push entry for x, entry of dataDict when entry?

        # normalize
        for x, entry of comparisonDataDict
            newComparisonData.push
                x: entry.x
                y: entry.y * factor

        return {
            data: newData
            comparisonData: newComparisonData
        }



    # The aim is to find correlation through a point graph.
    # So the compared data are displayed depending on the initial data.
    # So we can see easily if there is a linear or cubic or whatever
    # correlation between the two sets of data.
    mixData: (data, comparisonData) ->

        dataDict = {}
        for entry in data
            dataDict[entry.x] = entry.y

        newData = []
        for entry in comparisonData
            newData.push
                x: entry.y
                y: dataDict[entry.x]

        newData = _.sortBy newData, (entry) -> entry.x

        newData


    isSmallScreen: ->
        return $(window).width() < 700

