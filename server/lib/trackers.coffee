path = require 'path'
fs = require 'fs'
slugify = require 'cozy-slug'
_ = require 'underscore'


isJsFile = (fileName) ->
    extension = fileName.split('.')[1]
    firstChar = fileName[0]
    firstChar isnt '.' and extension is 'js'


# Get all trackers by listing all js files located in the server/trackers
# directory.
getTrackers = ->
    currentPath = path.dirname fs.realpathSync __filename
    modulesPath = path.join currentPath, '..', 'trackers'

    trackers = []
    trackerFiles = fs.readdirSync modulesPath
    for trackerFile in trackerFiles
        if isJsFile trackerFile
            name = trackerFile.split('.')[0]
            modulePath = path.join modulesPath, name
            tracker = require modulePath
            tracker.slug = slugify tracker.name
            tracker.path = "basic-trackers/#{tracker.slug}"
            trackers.push tracker

    trackers.sort (a, b) ->
        nameA = a.name.toLowerCase()
        nameB = b.name.toLowerCase()
        if nameA < nameB then -1
        else if nameA > nameB then 1
        else 0

    trackers


basicTrackers = getTrackers()

cloneTrackers = ->
    trackers = _.map basicTrackers, _.clone
    return trackers

module.exports = cloneTrackers

