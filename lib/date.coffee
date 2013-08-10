# Date formatter
module.exports.getDateString = (date) ->
    yyyy = date.getFullYear().toString()
    mm = (date.getMonth() + 1).toString()
    mm = "0" + mm if mm.length is 1
    dd  = date.getDate().toString()
    dd = "0" + dd if dd.length is 1
    dateString = yyyy + '-' + mm + '-' + dd
    dateString

