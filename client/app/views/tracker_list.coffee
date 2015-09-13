normalizer = require 'lib/normalizer'
ViewCollection = require 'lib/view_collection'
TrackerCollection = require 'collections/trackers'

module.exports = class TrackerList extends ViewCollection
    id: 'tracker-list'
    itemView: require 'views/tracker_list_item'
    template: require 'views/templates/tracker_list'
    collection: new TrackerCollection()


    # Load tracker list. Then load data to display for each trackers.
    load: (callback) ->
        @collection.fetch
            success: =>
                @reloadAll ->
                    console.log 'load done'
                    callback?()
            error: =>
                alert 'Cannot load basic trackers'
                callback?()


    # Reload data for each tracker. Perform it one by one.
    reloadAll: (callback) ->
        @$(".tracker .chart").html ''
        @$(".tracker .y-axis").html ''

        trackers = []
        trackers.push view for id, view of @views

        async.eachSeries trackers, (tracker, next) ->
            unless tracker.model.get('metadata').hidden
                tracker.load next
            else
                next()
        , (err) ->
            console.log 'reloadAll done'
            callback() if callback?


    redrawAll: ->
        view.redrawGraph() for id, view of @views


    refreshCurrentValue: ->
        for id, view of @views
            view.refreshCurrentValue()

