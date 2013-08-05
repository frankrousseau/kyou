db = require('americano-cozy').db

module.exports = db.define 'Mood',
    mood: Boolean
    date: Date
