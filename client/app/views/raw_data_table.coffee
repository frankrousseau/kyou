ViewCollection = require 'lib/view_collection'
TrackerAmountCollection = require 'collections/tracker_amounts'


module.exports = class RawDataTable extends ViewCollection
    id: 'raw-data-table'
    itemView: require 'views/tracker_amount_item'
    template: require 'views/templates/tracker_amount_list'
    collection: new TrackerAmountCollection()
    tagName: 'table'
    className: 'table'


    show: ->
        @$el.show()


    load: (tracker) ->
        if tracker?
            @tracker = tracker
            @collection.url = "trackers/#{tracker.get 'id'}/raw-data"
            @collection.fetch()

