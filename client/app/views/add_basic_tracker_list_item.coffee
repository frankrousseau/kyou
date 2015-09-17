BaseView = require 'lib/base_view'


# Add button for a basic tracker.
module.exports = class AddBasicTrackerItem extends BaseView
    tagName: 'button'
    className: 'btn'
    template: require 'views/templates/add_basic_tracker_list_item'


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
            Backbone.Mediator.pub 'basic-tracker:removed', @model.get 'slug'
        else
            @selected = true
            @$el.addClass 'selected'
            Backbone.Mediator.pub 'basic-tracker:add', @model.get 'slug'

