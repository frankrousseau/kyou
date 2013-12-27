module.exports = class TrackersCollection extends Backbone.Collection
    model: require '../models/basic_tracker'
    url: 'basic-trackers'
