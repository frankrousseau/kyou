americano = require 'americano-cozy'

module.exports =
    mood:
        all: americano.defaultRequests.all
        statusByDay: (doc) ->
            status = 0
            status = 1 if doc.status is "bad"
            status = 2 if doc.status is "neutral"
            status = 3 if doc.status is "good"
            emit doc.date.substring(0,10), status
        byDay: (doc) ->
            emit doc.date.substring(0,10), doc

    tracker:
        all: americano.defaultRequests.all
        byName: (doc) -> emit doc.name, doc

    trackeramount:
        nbByDay: (doc) ->
            emit [doc.tracker, doc.date.substring(0,10)], doc.amount
        byDay: (doc) ->
            emit [doc.tracker, doc.date.substring(0,10)], doc

    dailynote:
        byDay: (doc) ->
            emit doc.date.substring(0,10), doc
