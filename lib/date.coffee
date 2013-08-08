# Date formatter
module.exports.getDateString = (date) ->
    dateString = "#{date.getFullYear()}-"
    dateString += "#{date.getMonth() + 1}-#{date.getDate()}"
    dateString

