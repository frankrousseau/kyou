db = require('americano-cozy').db

module.exports = db.define 'Task',
    done: Boolean
    completionDate: Date
