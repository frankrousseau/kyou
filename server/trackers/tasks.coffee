americano = require 'cozydb'

module.exports =
    name: "Tasks"
    color: "#FF5722"
    description: """
This tracker counts the tasks marked as done in your Cozy. The date used to
build the graph is the completion date."""
    model: americano.getModel 'Task', completionDate: Date
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
