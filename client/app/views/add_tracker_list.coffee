ViewCollection = require 'lib/view_collection'
TrackerCollection = require 'collections/trackers'


# List of buttons for a basic tracker.
module.exports = class AddTrackerList extends ViewCollection
    el: '#add-tracker-list'
    collectionEl: '#add-tracker-list'
    itemView: require 'views/add_tracker_list_item'
    template: require 'views/templates/add_tracker_list'


    constructor: (@collection) ->
        super
        @$collectionEl = $ @collectionEl


    afterRender: ->
        super


    getView: (id) ->
        tracker = @collection.findWhere id: id
        view = @views[tracker.cid]
        return view

