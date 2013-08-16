# Date formatter
module.exports.getDateString = (date) ->
    yyyy = date.getFullYear().toString()
    mm = (date.getMonth() + 1).toString()
    mm = "0" + mm if mm.length is 1
    dd  = date.getDate().toString()
    dd = "0" + dd if dd.length is 1
    dateString = yyyy + '-' + mm + '-' + dd
    dateString

module.exports.getTodayModel = (err, models, callback) ->
    if err
        callback err
    else if models.length isnt 0
        models = models[0]
        now = date_helpers.getDateString new Date
        date = date_helpers.getDateString mood.models

        if now is date
            model.id = model._id
            callback null, model
        else
            callback()
    else
        callback()
