ViewCollection = require 'lib/view_collection'
TrackerCollection = require 'collections/trackers'
request = require 'lib/request'


module.exports = class TrackerList extends ViewCollection
    id: 'tracker-list'
    itemView: require 'views/tracker_list_item'
    template: require 'views/templates/tracker_list'
    collection: new TrackerCollection()

    subscriptions:
        'tracker:add': 'onAddTracker'
        'tracker:removed': 'onTrackerRemoved'


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


    # Hides if the metadata marks it as hidden.
    appendView: (view) ->
        @$collectionEl.append view.el
        if view.model.get('metadata').hidden
            view.$el.addClass 'hidden'


    refreshCurrentValue: ->
        for id, view of @views
            view.refreshCurrentValue()


    remove: (id) ->
        view = @getView id
        view.remove()


    getView: (id) ->
        tracker = @collection.findWhere id: id
        view = @views[tracker.cid]
        return view


    # When a tracker is added, add it to the list and loads its data.
    # Then, it saves the hidden status change so it remembers it for further
    # loading.
    onAddTracker: (id) ->
        view = @getView id
        view.$el.removeClass 'hidden'
        view.load()
        data =
            hidden: false
        request.put "metadata/basic-trackers/#{id}", data, (err) ->


    onTrackerRemoved: (id) ->
        @remove id
        data =
            hidden: true
        request.put "metadata/basic-trackers/#{id}", data, (err) ->


    isEmpty: ->
        result = @collection.models.find (tracker) ->
            not tracker.get('metadata').hidden

        return not(result?)

