fs = require 'fs'
{exec} = require 'child_process'

walk = (dir, fileList) ->
    list = fs.readdirSync dir
    if list
        for file in list
            filename = dir + '/' + file
            stat = fs.statSync filename
            if stat and stat.isDirectory()
                walk filename, fileList
            else if filename.substr(-6) is "coffee"
                fileList.push filename
    fileList

task 'convert', 'convert kyou to JS', ->
    files = walk "server", []
    console.log "Convert to JS..."
    command = "coffee -cb server.coffee #{files.join ' '} "
    exec command, (err, stdout, stderr) ->
        console.log stdout
        if err
            console.log "Running compilation caught exception: \n" + err
            process.exit 1
        else
            console.log "Convertion succeeded."
            process.exit 0
