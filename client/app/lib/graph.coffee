
module.exports =

    # Draw a graph following the Risckshaw lib conventions.
    draw: (el, yEl, width, color, data, graphStyle, comparisonData) ->
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
        x_axis = new Rickshaw.Graph.Axis.Time graph: graph
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
