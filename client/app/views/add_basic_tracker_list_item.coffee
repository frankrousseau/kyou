BaseView = require 'lib/base_view'
request = require 'lib/request'
graph = require 'lib/graph'
normalizer = require 'lib/normalizer'


# Item View for the albums list
module.exports = class AddBasicTrackerItem extends BaseView
    tagName: 'button'
    className: 'add-basic-tracker-btn'
    template: require 'views/templates/add_basic_tracker_list_item'


    events:
        'click': 'clicked'


    afterRender: (callback) =>


    clicked: =>
        Backbone.Mediator.pub 'basic-tracker:add', @model.get 'slug'

