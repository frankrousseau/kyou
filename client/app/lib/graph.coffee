
module.exports =
    draw: (el, yEl, width, color, @data) ->
        graph = new Rickshaw.Graph(
            element: el
            width: width
            height: 300
            renderer: 'bar'
            series: [
                color: color
                data: data
            ]
        )

        x_axis = new Rickshaw.Graph.Axis.Time graph: graph
        y_axis = new Rickshaw.Graph.Axis.Y
             graph: graph
             orientation: 'left'
             tickFormat: Rickshaw.Fixtures.Number.formatKMBT
             element: yEl

        graph.render()

        hoverDetail = new Rickshaw.Graph.HoverDetail
            graph: graph,
            xFormatter: (x) ->
                moment(x * 1000).format 'MM/DD/YY'
            formatter: (series, x, y) ->
                Math.floor y

        graph

    clear: (el, yEl) ->
        $(el).html null
        $(yEl).html null
