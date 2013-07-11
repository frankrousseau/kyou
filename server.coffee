{Americano} = require './americano'

init = require './init'
server = new Americano()

init ->
    server.start port: 3000, name: "kyou"
