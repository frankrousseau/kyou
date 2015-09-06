americano = require 'cozydb'

module.exports =
    name: "Taskies"
    color: "#FF5722"
    description: """
This tracker counts the task from Tasky app marked as done. The date used to
build the graph is the completion date."""
    model: americano.getModel 'Tasky', completionDate: Date
    request:
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
