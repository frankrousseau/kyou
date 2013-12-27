ViewCollection = require 'lib/view_collection'
BasicTrackerCollection = require 'collections/basic_trackers'

module.exports = class TrackerList extends ViewCollection
    id: 'basic-tracker-list'
    itemView: require 'views/basic_tracker_list_item'
    template: require 'views/templates/basic_tracker_list'
    collection: new BasicTrackerCollection()

    redrawAll: ->
        view.redrawGraph() for id, view of @views

    reloadAll: ->
        @$(".tracker .chart").html ''
        @$(".tracker .y-axis").html ''
        view.afterRender() for id, view of @views
