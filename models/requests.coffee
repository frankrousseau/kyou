americano = require 'americano-cozy'

module.exports =
    mail:
        analytics:
            map: (doc) ->
                if doc.date?
                    date = new Date doc.date
                    dateString = "#{date.getFullYear()}-"
                    dateString += "#{date.getMonth() + 1}-#{date.getDate()}"
                    emit dateString, 1
            reduce: (key, values, rereduce) ->
                sum values

    task:
        analytics:
            map: (doc) ->
                if doc.completionDate? and doc.done
                    date = new Date doc.completionDate
                    dateString = "#{date.getFullYear()}-"
                    dateString += "#{date.getMonth() + 1}-#{date.getDate()}"
                    emit dateString, 1
            reduce: (key, values, rereduce) ->
                sum values

    mood:
        all: americano.defaultRequests.all
        analytics: (doc) ->
            date = new Date doc.date
            dateString = "#{date.getFullYear()}-"
            dateString += "#{date.getMonth() + 1}-#{date.getDate()}"
            status = 0
            status = 1 if doc.status is "bad"
            status = 2 if doc.status is "neutral"
            status = 3 if doc.status is "good"
            emit dateString, status
        byDay: (doc) ->
            date = new Date doc.date
            dateString = "#{date.getFullYear()}-"
            dateString += "#{date.getMonth() + 1}-#{date.getDate()}"
            emit dateString, doc
