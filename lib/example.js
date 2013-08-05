(function() {
  var Example;

  Example = (function() {
    function Example() {
      var closeGesture, openGesture,
        _this = this;
      this.state = 'closed';
      this.controller = new Surge.Controller;
      openGesture = new Surge.Gestures.Open(function() {
        return _this.opened();
      });
      this.controller.register(openGesture);
      closeGesture = new Surge.Gestures.Close(function() {
        return _this.closed();
      });
      this.controller.register(closeGesture);
      this.controller.start();
    }

    Example.prototype.opened = function() {
      console.log("Opened: currently " + this.state);
      if (this.state !== 'closed') {
        return;
      }
      document.getElementById('out').innerHTML = 'Opened';
      return this.state = 'opened';
    };

    Example.prototype.closed = function() {
      console.log("Closed: currently " + this.state);
      if (this.state !== 'opened') {
        return;
      }
      document.getElementById('out').innerHTML = 'Closed';
      return this.state = 'closed';
    };

    return Example;

  })();

  new Example;

}).call(this);
