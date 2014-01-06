path = require 'path'
fs = require 'fs'

isJsFile = (fileName) ->
    extension = fileName.split('.')[1]
    firstChar = fileName[0]
    firstChar isnt '.' and extension is 'js'

module.exports =

    # Get all trackers by listing all js files located in the server/trackers
    # directory.
    getTrackers: ->
        currentPath = path.dirname fs.realpathSync __filename
        modulesPath = path.join currentPath, '..', 'trackers'

        trackers = []
        trackerFiles = fs.readdirSync modulesPath
        for trackerFile in trackerFiles
            if isJsFile trackerFile
                name = trackerFile.split('.')[0]
                modulePath = path.join modulesPath, name
                trackers.push require modulePath

        trackers.sort (a, b) ->
            nameA = a.name.toLowerCase()
            nameB = b.name.toLowerCase()
            if nameA < nameB then -1
            else if nameA > nameB then 1
            else 0

        trackers
