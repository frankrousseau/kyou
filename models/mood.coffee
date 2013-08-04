db = require './cozy-adapter'

module.exports = db.define 'Mood',
    mood: Boolean
    date: Date
