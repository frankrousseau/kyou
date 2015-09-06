americano = require 'cozydb'

module.exports =
    name: "Tweets"
    color: "#E91E63"
    description: "Number of tweets you publish every day"
    model: americano.getModel 'twittertweet', date: Date
    request:
        map: (doc) ->
            emit doc.date.substring(0,10), 1
        reduce: (key, values, rereduce) ->
            sum values
