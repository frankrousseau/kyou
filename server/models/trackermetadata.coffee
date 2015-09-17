americano = require 'cozydb'
date_helpers = require '../lib/date'
TrackerAmount = require './trackeramount'


# Additional information related to user configuration.
module.exports = TrackerMetadata = americano.getModel 'TrackerMetadata',
    type: String
    slug: String
    style: String
    goal: Number
    hidden: type: Boolean, default: false


# Get all tracker metadata.
TrackerMetadata.all = (params, callback) ->
    TrackerMetadata.request 'all', params, callback


# Get tracker metadata from its slug.
TrackerMetadata.get = (slug, callback) ->
    TrackerMetadata.request 'bySlug', key: slug, (err, metadatas) ->
        if err
            callback err
        else if metadatas.length is 0
            callback null, null
        else
            callback null, metadatas[0]


# Build an hash to get a tracker from its slug. Its make tracker and metadata
# linking easier.
TrackerMetadata.allHash = (callback) ->
    TrackerMetadata.all (err, metadatas) ->
        return callback err if err

        metadataHash = {}
        for metadata in metadatas
            metadataHash[metadata.slug] = metadata
        callback null, metadataHash

