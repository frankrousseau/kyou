module.exports = class MoodsCollection extends Backbone.Collection
    model: require '../models/mood'
    url: 'moods/'
