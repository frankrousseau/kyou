americano = require 'americano-cozy'
moment = require 'moment'

JawboneMove = americano.getModel 'JawboneMove',
    date: Date
    activeTime: Number
    activeTimeCalories: Number
    distance: Number
    inactiveTime: Number
    longestActiveTime: Number
    longestIdleTime: Number
    steps: Number
    totalCalories: Number

JawboneSleep = americano.getModel 'JawboneSleep',
    date: Date
    asleepTime: Number
    awakeDuration: Number
    awakeTime: Number
    awakeningCount: Number
    bedTime: Number
    deepSleepDuration: Number
    lightSleepDuration: Number
    sleepDuration: Number
    sleepQuality: Number

TwitterTweet = americano.getModel 'TwitterTweet',
    date: Date
    id_str: String
    text: String
    retweetCount: Number
    favoriteCount: Number
    isReplyTo: Boolean
    isRetweet: Boolean

BankOperation = americano.getModel 'bankoperation',
    date: Date
    bankAccount: String
    title: String
    amount: Number
    raw: String

RescueTimeActivity = americano.getModel 'RescueTimeActivity',
    date: Date
    duration: Number
    description: String
    category: String
    productivity: Number
    people: Number

random = (max) ->
    Math.floor((Math.random() * max) + 1)

now = moment()
start = moment().subtract 'months', 6
end = moment().add 'months', 6

console.log "Create fake data"
console.log "from " + start.format 'YYYYMMDD'
console.log "to " + end.format 'YYYYMMDD'


initJawboneMoves = (callback) ->
    start = moment().subtract 'months', 6
    JawboneMove.requestDestroy 'bydate', ->
        recCreate = ->
            if start < end
                move =
                    date: start
                    activeTime: random 1000
                    activeTimeCalories: random 10000
                    distance: random 20000
                    inactiveTime: random 20000
                    longestActiveTime: random 200
                    longestIdleTime: random 300
                    steps: random 20000
                    totalCalories: random 20000
                JawboneMove.create move, ->
                    start.add 'days', 1
                    recCreate()
            else
                callback()
        recCreate()

initJawboneSleeps = (callback) ->
    start = moment().subtract 'months', 6
    JawboneSleep.requestDestroy 'bydate', ->
        recCreate = ->
            if start < end
                sleep =
                    date: start
                    asleepTime: random 700
                    awakeDuration: random 600
                    awakeTime: random 600
                    awakeningCount: random 7
                    bedTime: random 600
                    deepSleepDuration: random 600
                    lightSleepDuration: random 600
                    sleepDuration: random 600
                    sleepQuality: (random 100) / 100
                JawboneSleep.create sleep, ->
                    start.add 'days', 1
                    recCreate()
            else
                callback()
        recCreate()

initTweets = (callback) ->
    start = moment().subtract 'months', 6
    TwitterTweet.requestDestroy 'bydate', ->
        recCreate = ->
            if start < end
                tweet =
                    date: start
                    id_str: "idstr"
                    text: "blabla"
                    retweetCount: 0
                    favoriteCount: 0
                    isReplyTo: false
                    isRetweet: false

                start.add 'days', 1
                TwitterTweet.create tweet, ->
                    if random(3) % 2 is 0
                        TwitterTweet.create tweet, ->
                            if random(3) % 2 is 0
                                TwitterTweet.create tweet, ->
                                    recCreate()
                            else
                                recCreate()
                    else
                        recCreate()
            else
                callback()
        recCreate()

initExpenses = (callback) ->
    start = moment().subtract 'months', 6
    BankOperation.requestDestroy 'all', ->
        recCreate = ->
            if start < end
                operation =
                    date: start
                    bankAccount: "ahjhzer"
                    title: "ope ope"
                    amount: -1 * random 1000
                    raw: "ope ope"

                start.add 'days', 1
                BankOperation.create operation, ->
                    if random 3 % 2 is 0
                        BankOperation.create operation, ->
                            recCreate()
                    else
                        recCreate()
            else
                callback()
        recCreate()

initRescueTimeActivity = (callback) ->
    start = moment().subtract 'months', 6
    RescueTimeActivity.requestDestroy 'byDate', ->
        recCreate = ->
            if start < end
                activity =
                    date: start
                    duration: random 300
                    description: "demo"
                    category: "democat"
                    productivity: 1
                    people: 1

                start.add 'days', 1
                RescueTimeActivity.create activity, ->
                    recCreate()
            else
                callback()
        recCreate()


    callback()



initJawboneSleeps ->
    console.log "Fake Jawbone Sleeps created"

    initJawboneMoves ->
        console.log "Fake Jawbone Moves created"

        initTweets ->
            console.log "Fake Tweets created"

            initExpenses ->
                console.log "Fake Expenses created"

                initRescueTimeActivity ->
                    console.log "Fake Activities created"
