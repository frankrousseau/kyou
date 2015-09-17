request = require 'lib/request'


module.exports = class TrackerModel extends Backbone.Model

    constructor: (data) ->
        super

        date = @get 'date'
        @set 'displayDate', moment(date).format 'YYYY MM DD'

