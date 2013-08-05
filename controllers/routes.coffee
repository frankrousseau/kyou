module.exports =
    'moods':
        get: moods: 'all'
        post: moods: 'create'
    'moods/:id':
        put: moods: 'modify'
        delete: moods: 'delete'
