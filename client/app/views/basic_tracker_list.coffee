ViewCollection = require 'lib/view_collection'
BasicTrackerCollection = require 'collections/basic_trackers'

module.exports = class BasicTrackerList extends ViewCollection
    id: 'basic-tracker-list'
    itemView: require 'views/basic_tracker_list_item'
    template: require 'views/templates/basic_tracker_list'
    collection: new BasicTrackerCollection()

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
