module.exports = class TrackersCollection extends Backbone.Collection
    model: require '../models/tracker'
    url: 'trackers'
