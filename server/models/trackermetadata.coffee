americano = require 'americano-cozy'
date_helpers = require '../lib/date'
TrackerAmount = require './trackeramount'


module.exports = TrackerMetadata = americano.getModel 'TrackerMetadata',
    type: String
    slug: String
    style: String
    goal: Number
    hidden: type: Boolean, default: false


TrackerMetadata.all = (params, callback) ->
    TrackerMetadata.request 'all', params, callback


TrackerMetadata.get = (slug, callback) ->
    TrackerMetadata.request 'bySlug', key: slug, (err, metadatas) ->
        if err
            callback err
        else if metadatas.length is 0
            callback null, null
        else
            callback null, metadatas[0]


TrackerMetadata.allHash = (callback) ->
    TrackerMetadata.all (err, metadatas) ->
        return callback err if err

        metadataHash = {}
        for metadata in metadatas
            metadataHash[metadata.slug] = metadata
        callback null, metadataHash

