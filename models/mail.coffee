db = require '../db/cozy-adapter'

module.exports = db.define 'Mail',
    createdAt: Number
    date: Date
