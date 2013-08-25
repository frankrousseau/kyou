americano = require 'americano-cozy'

module.exports = americano.getModel 'Task',
    done: Boolean
    completionDate: Date
