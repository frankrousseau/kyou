BaseView = require 'lib/base_view'
request = require '../lib/request'

# Item View for the tracker amount list
module.exports = class TrackerAmountItem extends BaseView
    className: 'tracker-amount'
    template: require 'views/templates/tracker_amount_item'

    events:
        'click .amount-delete button': 'onDeleteClicked'

    afterRender: (callback) =>

    onDeleteClicked: ->
        @$el.addClass 'deleted'
        @model.state = 'deleted'
        request.del "trackers/#{@model.get 'tracker'}/raw-data/#{@model.get 'id'}", (err) ->
            alert 'An error occured while deleting selected amount' if err

