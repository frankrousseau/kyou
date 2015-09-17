module.exports =


    # Draw a graph following the Risckshaw lib conventions.
    draw: (opts) ->
        {
            el, yEl, width, color, data, graphStyle, comparisonData, time, goal
        } = opts

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

        hoverDetail = new Rickshaw.Graph.HoverDetail
            graph: graph,
            xFormatter: (x) ->
                moment(x * 1000).format 'MM/DD/YY'
            formatter: (series, x, y) ->
        # Add fancy stuff
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

        # Get max
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
        dataHash = {}
        comparisonDataHash = {}
        for entry in data
            dataHash[entry.x] = entry

        for entry in comparisonData
            comparisonDataHash[entry.x] = entry
        for entry in data

            comparisonDataHash[entry.x] ?=
                x: entry.x
                y: 0

        for entry in comparisonData
            dataHash[entry.x] ?=
                x: entry.x
                y: 0


        # Build results
        newData = []
        newComparisonData = []

        for x, entry of dataHash
            if entry?
                newData.push entry


        # normalize
        for x, entry of comparisonDataHash
            newComparisonData.push
                x: entry.x
                y: entry.y * factor

        return {
            data: newData
            comparisonData: newComparisonData
        }


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

