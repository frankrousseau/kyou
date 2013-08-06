Task = require '../models/task'


# Return number of tasks completed for every day
module.exports.all = (req, res, next) ->
    options = group: true, descending: true
    Task.rawRequest 'tasksByDay', options, (err, tasks) ->
        if err then next err
        else
            results = []

            for task in tasks
                results.push date: task.key, nbTasks: task.value

            res.send results
