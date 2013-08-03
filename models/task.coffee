db = require '../db/cozy-adapter'

module.exports = db.define 'Task',
    done: Boolean
    completionDate: Date
