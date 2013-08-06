americano = require 'americano-cozy'

module.exports =
    mail:
        mailsByDay:
            map: (doc) -> emit doc.date, doc
            reduce: (key, values, rereduce) ->
                if rereduce then sum values
                else values.length
    task:
        tasksByDay:
            map: (doc) ->
                if doc.completionDate? and doc.done
                    date = new Date doc.completionDate
                    dateString = "#{date.getDate()}#{date.getMonth()}"
                    dateString += "#{date.getFullYear()}"
                    emit dateString, 1
            reduce: (key, values, rereduce) ->
                if rereduce then sum values
                else values.length
    mood:
        all: americano.defaultRequests.all
        moodByDay: (doc) ->
            date = new Date doc.date
            dateString = "#{date.getFullYear()}-"
            dateString += "#{date.getMonth() + 1}-#{date.getDate()}"
            emit dateString, doc
