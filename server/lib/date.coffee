# Date formatter to format data without depency.
# format: yyyy-mm-dd
module.exports.getDateString = getDateString = (date) ->
    yyyy = date.getFullYear().toString()
    mm = (date.getMonth() + 1).toString()
    mm = "0" + mm if mm.length is 1
    dd  = date.getDate().toString()
    dd = "0" + dd if dd.length is 1
    dateString = yyyy + '-' + mm + '-' + dd
    dateString

# Get first model of the list. If its date is today, it returns ity
# else it returns null.
module.exports.getTodayModel = (err, models, callback) ->
    if err
        callback err
    else if models.length isnt 0
        model = models[0]
        now = getDateString new Date
        date = getDateString model.date

        if now is date
            model.id = model._id
            callback null, model
        else
            callback()
    else
        callback()
