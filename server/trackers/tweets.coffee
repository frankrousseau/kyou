americano = require 'americano-cozy'

module.exports =
    name: "Tweets"
    color: "#96A4A5"
    description: "Number of tweets you publish every day"
    model: americano.getModel 'TwitterTweet', date: Date
    request:
        map: (doc) ->
            emit doc.date.substring(0,10), 1
        reduce: (key, values, rereduce) ->
            sum values
