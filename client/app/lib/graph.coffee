module.exports =

    # Draw a graph following the Risckshaw lib conventions.
    draw: (el, yEl, width, color, data, graphStyle, comparisonData, time) ->
        graphStyle = "bar" unless graphStyle?

        # Build graph options depending of if there is something to compare.
        if comparisonData?
            series = [
                    color: color
                    data: data
                ,
                    color: 'red'
                    data: comparisonData
            ]
            renderer = graphStyle
        else
            series = [
                color: color
                data: data
            ]
            renderer = graphStyle

        # Build rickshaw object
        graph = new Rickshaw.Graph(
            element: el
            width: width
            height: 300
            renderer: renderer
            series: series
            interpolation: 'linear'
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
        hoverDetail = new Rickshaw.Graph.HoverDetail
            graph: graph,
            xFormatter: (x) ->
                moment(x * 1000).format 'MM/DD/YY'
            formatter: (series, x, y) ->
                Math.floor y

        graph

    # Graph cleaning based on given elements.
    clear: (el, yEl) ->
        $(el).html null
        $(yEl).html null

    getWeekData: (data) ->
        graphData = {}

        for entry in data
            date = moment new Date(entry.x * 1000)
            date = date.day 1
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

        return graphDataArray

    getMonthData: (data) ->
        graphData = {}

        for entry in data
            date = moment new Date(entry.x * 1000)
            date = date.date 1
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

    normalizeComparisonData: (data, comparisonData) ->
        maxData = 0
        for entry in data
            maxData = entry.y if entry.y > maxData

        maxComparisonData = 0
        for entry in comparisonData
            maxComparisonData = entry.y if entry.y > maxComparisonData

        factor = maxData / maxComparisonData

        newComparisonData = []
        for entry in comparisonData
            max = entry.y if entry.y > max
            newComparisonData.push
                x: entry.x
                y: entry.y * factor

        return newComparisonData

    mixData: (data, comparisonData) ->

        dataHash = {}
        for entry in data
            dataHash[entry.x] = entry.y

        newData = []
        for entry in comparisonData
            newData.push
                x: entry.y
                y: dataHash[entry.x]

        newData = _.sortBy newData, (entry) -> entry.x

        newData






