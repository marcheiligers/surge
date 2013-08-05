Surge = {}
this.Surge = Surge

class Surge.Controller
  constructor: ->
    @gestures = []

  start: ->
    @running = true
    @controller = new Leap.Controller(enableGestures: true) unless @controller?
    @controller.loop (frame) =>
      document.getElementById("log").innerHTML = frame.dump()
      return unless @running
      @handleFrame gesture, frame for gesture in @gestures

  stop: ->
    @running = false

  register: (gesture) ->
    @gestures.push(gesture)

  handleFrame: (gesture, frame) ->
    # console.log "handling #{gesture.name}"
    gesture.onFrame frame

class Surge.Gesture
  constructor: (@name, @onCompleted) ->
    @started = false

  onFrame: (frame) ->
    if @started
      @onStartedFrame(frame)
    else
      @onUnstartedFrame(frame)

  onStartedFrame: (frame) ->

  onUnstartedFrame: (frame) ->

  start: ->
    @started = true

  unstart: ->
    @started = false

  complete: ->
    @onCompleted(@) if @onCompleted?
    @started = false

Surge.Gestures = {}

class Surge.Gestures.Close extends Surge.Gesture
  constructor: (onCompleted) ->
    super 'close', onCompleted
    @fingers = 0
    @history = []

  onFrame: (frame) ->
    @history.push frame.fingers.length if frame.fingers.length != @history[@history.length - 1]
    super
    # console.log @dump()

  onUnstartedFrame: (frame) ->
    if frame.hands.length == 1 && frame.fingers.length == 5
      @start()
      @fingers = 5

  onStartedFrame: (frame) ->
    if frame.hands.length == 1 && frame.fingers.length <= @fingers
      @fingers = frame.fingers.length
      if @fingers == 0
        @complete()
    else
      @unstart()

  dump: ->
    "close: #{if @started then 'Started' else 'Not Started'}: #{@fingers} fingers<br>History: #{@history.toString()}"

class Surge.Gestures.Open extends Surge.Gesture
  constructor: (onCompleted) ->
    super 'open', onCompleted
    @fingers = 0
    @history = []

  onFrame: (frame) ->
    @history.push frame.fingers.length if frame.fingers.length != @history[@history.length - 1]
    super
    # console.log @dump()

  onUnstartedFrame: (frame) ->
    if frame.hands.length == 1 && frame.fingers.length == 0
      @start()
      @fingers = 0

  onStartedFrame: (frame) ->
    if frame.hands.length == 1 && frame.fingers.length >= @fingers
      @fingers = frame.fingers.length
      if @fingers == 5
        @complete()
    else
      @unstart()

  dump: ->
    "open: #{if @started then 'Started' else 'Not Started'}: #{@fingers} fingers<br>History: #{@history.toString()}"
