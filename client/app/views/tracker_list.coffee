ViewCollection = require 'lib/view_collection'
TrackerCollection = require 'collections/trackers'

module.exports = class TrackerList extends ViewCollection
    id: 'tracker-list'
    itemView: require 'views/tracker_list_item'
    template: require 'views/templates/tracker_list'
    collection: new TrackerCollection()

    redrawAll: ->
        view.redrawGraph() for id, view of @views

    reloadAll: (callback) ->
        @$(".tracker .chart").html ''
        @$(".tracker .y-axis").html ''

        nbLoaded = 0
        length = 0

        for id, view of @views
            length++

        for id, view of @views
            view.afterRender =>
                nbLoaded++
                if nbLoaded is length
                    callback() if callback?
