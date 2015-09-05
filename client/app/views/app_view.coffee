request = require '../lib/request'
graphHelper = require '../lib/graph'
BaseView = require '../lib/base_view'

Tracker = require '../models/tracker'
Zoom = require '../models/zoom'
DailyNote = require '../models/dailynote'
DailyNotes = require '../collections/dailynotes'

ZoomView = require './zoom'
MoodTracker = require './mood_tracker'
TrackerList = require './tracker_list'
BasicTrackerList = require './basic_tracker_list'
AddBasicTrackerList = require './add_basic_tracker_list'

RawDataTable = require './raw_data_table'

MainState = require '../main_state'

{DATE_FORMAT, DATE_URL_FORMAT} = require '../lib/constants'


module.exports = class AppView extends BaseView

    el: 'body.application'
    template: require('./templates/home')

    events:
        'change #datepicker': 'onDatePickerChanged'
        'blur #dailynote': 'onDailyNoteChanged'
        'click .date-previous': 'onPreviousClicked'
        'click .date-next': 'onNextClicked'
        'click .reload': 'onReloadClicked'
        'click #add-tracker-btn': 'onTrackerButtonClicked'
        'click #show-data-btn': 'onShowDataClicked'


    subscriptions:
        'start-date:change': 'onStartDateChanged'
        'end-date:change': 'onEndDateChanged'
        'tracker:removed': 'onTrackerRemoved'


    constructor: (options) ->
        super

        MainState ?= {}
        {startDate, endDate} = options
        @initDates startDate, endDate


    initDates: (startDate, endDate) ->

        if startDate
            MainState.startDate = moment startDate, DATE_URL_FORMAT
        else
            MainState.startDate = moment()
            MainState.startDate = MainState.startDate.subtract 'month', 6

        if endDate
            MainState.endDate = moment endDate, DATE_URL_FORMAT
        else
            MainState.endDate = moment()

        @currentDate = MainState.endDate


    getRenderData: =>
        return {
            startDate: MainState.startDate.format DATE_FORMAT
            endDate: MainState.endDate.format DATE_FORMAT
        }


    afterRender: ->
        @colors = {}
        @data = {}
        MainState.dataLoaded = false

        $(window).on 'resize',  @redrawCharts
        @initDatePickers()

        @basicTrackerList = new BasicTrackerList()
        @$('#content').append @basicTrackerList.$el
        @basicTrackerList.render()

        zoom = new Zoom
        @zoomView = new ZoomView zoom, @basicTrackerList.collection
        @zoomView.render()
        @zoomView.hide()

        @addBasicTrackerList = new AddBasicTrackerList(
            @basicTrackerList.collection)

        @addTrackerZone = @$ '#add-tracker-zone'
        #@rawDataTable = new RawDataTable()
        #@rawDataTable.render()
        #@$('#raw-data').append @rawDataTable.$el

        #@moodTracker = new MoodTracker()
        #@$('#content').append @moodTracker.$el
        #@moodTracker.render()

        #@trackerList = new TrackerList()
        #@$('#content').append @trackerList.$el
        #@trackerList.render()


    loadTrackers: (callback) ->
        MainState.dataLoaded = false
        #@moodTracker.reload =>
        #@trackerList.collection.fetch
            #success: =>
        @basicTrackerList.load =>
            console.log 'loadTrackers done'
            MainState.dataLoaded = true
            #@fillComparisonCombo()
            callback?()


    initDatePickers: ->
        now = new Date()
        $('#datepicker-start').pikaday
            maxDate: now
            format: DATE_FORMAT
            defaultDate: MainState.startDate.toDate()
            setDefaultDate: true
            onSelect: (value) ->
                Backbone.Mediator.publish 'start-date:change', value

        $('#datepicker-end').pikaday
            maxDate: now
            defaultDate: MainState.endDate.toDate()
            format: DATE_FORMAT
            onSelect: (value) ->
                Backbone.Mediator.publish 'end-date:change', value


    resetRouteHash: ->
        window.app.router.resetHash()


    onStartDateChanged: (date) ->
        MainState.startDate = moment date
        @loadTrackers =>
            @zoomView.reload()
        @resetRouteHash()


    onEndDateChanged: (date) ->
        MainState.endDate = moment date
        @loadTrackers =>
            @zoomView.reload()
        @resetRouteHash()


    onTrackerRemoved: (slug) ->
        @basicTrackerList.remove slug


    reloadAll: ->
        console.log 'start loading data'
        #@moodTracker.reload =>
            #console.log 'end loading data for mood'
        #@trackerList.reloadAll =>
        @basicTrackerList.reloadAll =>
            console.log 'end loading data'
            #if @$("#zoomtracker").is(":visible")
                #if @currentTracker is @moodTracker
                    #@currentData = @moodTracker.data
                #else
                    #tracker = @currentTracker
                    #trackerView = @basicTrackerList.views[tracker.cid]
                    #unless trackerView?
                        #trackerView = @trackerList.views[tracker.cid]
                    #@currentData = trackerView?.data
                #@onComparisonChanged()


    displayBasicTracker: (slug) ->
        MainState.currentView = "basic-trackers/#{slug}"
        @basicTrackerList.hide()
        @addTrackerZone.hide()
        @displayZoomTracker slug, =>


    displayZoomTracker: (slug, callback) ->
        if MainState.dataLoaded
            @zoomView.show slug
            callback?()
        else
            @loadTrackers =>
                @zoomView.show slug
                callback?()


    displayTrackers: ->
        MainState.currentView = 'main'
        @basicTrackerList.show()
        @addTrackerZone.show()
        console.log 'step 1'
        @redrawCharts()
        console.log 'step 2'
        @zoomView.hide()
        console.log 'step 3'
        @loadTrackers() unless MainState.dataLoaded
        console.log 'step 4'


    redrawCharts: =>
        $('.chart').html null
        $('.y-axis').html null

        if @$("#zoomtracker").is(":visible")
            @onComparisonChanged()

        else
            #@moodTracker.redraw()
            #@trackerList.redrawAll()
            @basicTrackerList.redrawAll()

        true


    ## Note Widget

    onDailyNoteChanged: (event) ->
        text = @$("#dailynote").val()
        DailyNote.updateDay @currentDate, text, (err, mood) =>
            if err
                alert "An error occured while saving note of the day"


    loadNote: ->
        DailyNote.getDay @currentDate, (err, dailynote) =>
            if err
                alert "An error occured while retrieving daily note data"
            else if not dailynote?
                @$('#dailynote').val null
            else
                @$('#dailynote').val dailynote.get 'text'

        @notes = new DailyNotes
        @notes.fetch()


    ## Tracker creation widget

    onTrackerButtonClicked: ->
        name = $('#add-tracker-name').val()
        description = $('#add-tracker-description').val()

        if name.length > 0
            @trackerList.collection.create(
                    name: name
                    description: description
                ,
                    success: ->
                    error: ->
                        alert 'A server error occured while saving your tracker'
            )


    ## Zoom widget
    displayMood: ->
        @displayZoomTracker =>
            @$("#remove-btn").hide()
            @$("h2.zoomtitle").html @$("#moods h2").html()
            @$("p.zoomexplaination").html @$("#moods .explaination").html()
            @$("h2.zoomtitle").show()
            @$("p.zoomexplaination").show()
            @$("input.zoomtitle").hide()
            @$("textarea.zoomexplaination").hide()
            @$("#show-data-section").hide()

            @currentData = @moodTracker.data
            @currentTracker = @moodTracker

            @printZoomGraph @currentData, 'steelblue'

    displayTracker: (id) ->
        @displayZoomTracker =>
            @$("#remove-btn").show()
            tracker = @trackerList.collection.findWhere id: id
            unless tracker?
                alert "Tracker does not exist"
            else
                @$("input.zoomtitle").val tracker.get 'name'
                @$("textarea.zoomexplaination").val tracker.get 'description'
                @$("h2.zoomtitle").hide()
                @$("p.zoomexplaination").hide()
                @$("input.zoomtitle").show()
                @$("textarea.zoomexplaination").show()
                @$("#show-data-section").show()
                @$("#show-data-csv").attr 'href', "trackers/#{id}/csv"

                i = 0
                recWait = =>
                    data = @trackerList.views[tracker.cid]?.data

                    if data?
                        @currentData = data
                        @currentTracker = tracker
                        @onComparisonChanged()
                    else
                        setTimeout recWait, 10
                recWait()


    #onRemoveButtonClicked: =>
        #answer = confirm "Are you sure that you want to delete this tracker?"
        #if answer
            #tracker = @currentTracker
            #view = @trackerList.views[tracker.cid]
            #tracker.destroy
                #success: =>
                    #view.remove()
                    #window.app.router.navigate '#', trigger: true
                #error: ->
                    #alert 'something went wrong while removing tracker.'


    onShowDataClicked: =>
        @rawDataTable.show()
        @rawDataTable.load @currentTracker


    onCurrentTrackerChanged: =>
        @currentTracker.set 'name', @$('input.zoomtitle').val()
        @currentTracker.set 'description', @$('textarea.zoomexplaination').val()
        @currentTracker.save()

