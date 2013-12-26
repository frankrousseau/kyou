americano = require 'americano-cozy'

module.exports =
    mail:
        nbByDay:
            map: (doc) ->
                if doc.date?
                    emit doc.date.substring(0, 10), 1
            reduce: (key, values, rereduce) ->
                sum values

    task:
        nbByDay:
            map: (doc) ->
                if doc.completionDate? and doc.done
                    date = new Date doc.completionDate
                    yyyy = date.getFullYear().toString()
                    mm = (date.getMonth() + 1).toString()
                    mm = "0" + mm if mm.length is 1
                    dd  = date.getDate().toString()
                    dd = "0" + dd if dd.length is 1
                    dateString = yyyy + '-' + mm + '-' + dd
                    emit dateString, 1
            reduce: (key, values, rereduce) ->
                sum values

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

    trackeramount:
        nbByDay: (doc) ->
            emit [doc.tracker, doc.date.substring(0,10)], doc.amount
        byDay: (doc) ->
            emit [doc.tracker, doc.date.substring(0,10)], doc
