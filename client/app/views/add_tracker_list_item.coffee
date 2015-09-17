BaseView = require 'lib/base_view'


# Add button for a basic tracker.
module.exports = class AddTrackerItem extends BaseView
    tagName: 'button'
    className: 'btn'
    template: require 'views/templates/add_tracker_list_item'


    events:
        'click': 'clicked'


    afterRender: (callback) =>
        @selected = not @model.get('metadata').hidden
        if @selected
            @$el.addClass 'selected'


    clicked: =>
        if @selected
            @selected = false
            @$el.removeClass 'selected'
            Backbone.Mediator.pub 'tracker:removed', @model.get 'id'
        else
            @selected = true
            @$el.addClass 'selected'
            Backbone.Mediator.pub 'tracker:add', @model.get 'id'

