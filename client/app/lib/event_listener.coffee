module.exports = class EventListener extends CozySocketListener

    models:
        'sleep': Backbone.Model
        'steps': Backbone.Model
        'weight': Backbone.Model

    events: [
        'sleep.create'
        'steps.create'
        'weight.create'
        'sleep.delete'
        'steps.delete'
        'weight.delete'
    ]

    onRemoteCreate: (event) ->
        if event.doctype in ['sleep', 'steps']
            Backbone.Mediator.pub 'data:created', event

    onRemoteDelete: (event) ->
        if event.doctype in ['sleep', 'steps']
            Backbone.Mediator.pub 'data:removed', event

