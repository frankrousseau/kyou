BaseView = require 'lib/base_view'
AddBasicTrackerList = require './add_basic_tracker_list'
AddTrackerList = require './add_tracker_list'
request = require 'lib/request'
graphHelper = require '../lib/graph'
calculus = require 'lib/calculus'

Tracker = require '../models/tracker'
MainState = require '../main_state'


# Item View for the albums list
module.exports = class AddTrackerView extends BaseView
    className: ''
    el: '#add-tracker-zone'
    template: require 'views/templates/add_tracker'

    events:
        'click #add-tracker-btn': 'onTrackerButtonClicked'


    constructor: (@model, @basicTrackers, @moodTracker, @trackers) ->
        super


    afterRender: ->
        @addBasicTrackerList = new AddBasicTrackerList @basicTrackers
        @addTrackerList = new AddTrackerList @trackers


    onTrackerButtonClicked: ->
        name = @$('#add-tracker-name').val()
        description = @$('#add-tracker-description').val()

        if name.length > 0
            data =
                name: name
                description: description
            @trackers.create data,
                success: (model) =>
                error: ->
                    alert 'A server error occured while saving your tracker'

