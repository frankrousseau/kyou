ViewCollection = require 'lib/view_collection'
BasicTrackerCollection = require 'collections/basic_trackers'


# List of buttons for a basic tracker.
module.exports = class AddBasicTrackerList extends ViewCollection
    el: '#add-basic-tracker-list'
    collectionEl: '#add-basic-tracker-list'
    itemView: require 'views/add_basic_tracker_list_item'
    template: require 'views/templates/add_basic_tracker_list'


    constructor: (@collection) ->
        super
        @$collectionEl = $ @collectionEl


    afterRender: ->
        super


    appendView: (view) ->
        @$collectionEl.append view.el
        view.$el.addClass 'hidden' unless view.model.get('metadata').hidden

