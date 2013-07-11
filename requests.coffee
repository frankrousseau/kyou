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
        moodByDay: (doc) ->
            date = new Date doc.completionDate
            dateString = "#{date.getDate()}#{date.getMonth()}"
            dateString += "#{date.getFullYear()}"
            emit dateString, doc.state
