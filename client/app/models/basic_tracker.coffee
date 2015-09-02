request = require 'lib/request'

{DATE_FORMAT, DATE_URL_FORMAT} = require '../lib/constants'

module.exports = class TrackerModel extends Backbone.Model
    rootUrl: "basic-trackers"


    getPath: (startDate, endDate) ->

        format = DATE_URL_FORMAT
        "#{@get 'path'}/#{startDate.format format}/#{endDate.format format}"
