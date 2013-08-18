Model = require 'lib/model'
request = require 'lib/request'

module.exports = class CoffeeCup extends Model
    urlRoot: 'coffeecups/'

    @getLast: (callback) ->
        request.get 'coffeecups/today/', (err, coffeecup) ->
            if err then callback err
            else
                if coffeecup.amount?
                    callback null, new CoffeeCup coffeecup
                else
                    callback null, null

    @updateLast: (amount, callback) ->
        request.put 'coffeecups/today/', amount: amount, callback
