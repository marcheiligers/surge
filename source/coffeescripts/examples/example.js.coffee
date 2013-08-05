class Example
  constructor: ->
    @state = 'closed'

    @controller = new Surge.Controller

    openGesture = new Surge.Gestures.Open => @opened()
    @controller.register openGesture
    closeGesture = new Surge.Gestures.Close => @closed()
    @controller.register closeGesture

    @controller.start()

  opened: ->
    console.log "Opened: currently #{@state}"
    return unless @state == 'closed'
    document.getElementById('out').innerHTML = 'Opened'
    @state = 'opened'

  closed: ->
    console.log "Closed: currently #{@state}"
    return unless @state == 'opened'
    document.getElementById('out').innerHTML = 'Closed'
    @state = 'closed'

new Example