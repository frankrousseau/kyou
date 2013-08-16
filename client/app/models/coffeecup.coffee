Model = require 'lib/model'
request = require 'lib/request'

module.exports = class CoffeeCup extends Model
    urlRoot: 'coffeecups/'

    @getLast: (callback) ->
        request.get 'coffecup/today/', (err, coffeecup) ->
            if err then callback err
            else
                if coffeecup.coffeecup?
                    callback null, new CoffeeCup coffeecup
                else
                    callback null, null

    @updateLast: (status, callback) ->
        request.put 'coffeecups/today/', status: status, callback
