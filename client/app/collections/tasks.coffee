module.exports = class TaskCollection extends Backbone.Collection
    model: require '../models/task'
    url: 'tasks/'
