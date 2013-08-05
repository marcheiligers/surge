(function() {
  var Surge,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Surge = {};

  this.Surge = Surge;

  Surge.Controller = (function() {
    function Controller() {
      this.gestures = [];
    }

    Controller.prototype.start = function() {
      var _this = this;
      this.running = true;
      if (this.controller == null) {
        this.controller = new Leap.Controller({
          enableGestures: true
        });
      }
      return this.controller.loop(function(frame) {
        var gesture, _i, _len, _ref, _results;
        document.getElementById("log").innerHTML = frame.dump();
        if (!_this.running) {
          return;
        }
        _ref = _this.gestures;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          gesture = _ref[_i];
          _results.push(_this.handleFrame(gesture, frame));
        }
        return _results;
      });
    };

    Controller.prototype.stop = function() {
      return this.running = false;
    };

    Controller.prototype.register = function(gesture) {
      return this.gestures.push(gesture);
    };

    Controller.prototype.handleFrame = function(gesture, frame) {
      return gesture.onFrame(frame);
    };

    return Controller;

  })();

  Surge.Gesture = (function() {
    function Gesture(name, onCompleted) {
      this.name = name;
      this.onCompleted = onCompleted;
      this.started = false;
    }

    Gesture.prototype.onFrame = function(frame) {
      if (this.started) {
        return this.onStartedFrame(frame);
      } else {
        return this.onUnstartedFrame(frame);
      }
    };

    Gesture.prototype.onStartedFrame = function(frame) {};

    Gesture.prototype.onUnstartedFrame = function(frame) {};

    Gesture.prototype.start = function() {
      return this.started = true;
    };

    Gesture.prototype.unstart = function() {
      return this.started = false;
    };

    Gesture.prototype.complete = function() {
      if (this.onCompleted != null) {
        this.onCompleted(this);
      }
      return this.started = false;
    };

    return Gesture;

  })();

  Surge.Gestures = {};

  Surge.Gestures.Close = (function(_super) {
    __extends(Close, _super);

    function Close(onCompleted) {
      Close.__super__.constructor.call(this, 'close', onCompleted);
      this.fingers = 0;
      this.history = [];
    }

    Close.prototype.onFrame = function(frame) {
      if (frame.fingers.length !== this.history[this.history.length - 1]) {
        this.history.push(frame.fingers.length);
      }
      return Close.__super__.onFrame.apply(this, arguments);
    };

    Close.prototype.onUnstartedFrame = function(frame) {
      if (frame.hands.length === 1 && frame.fingers.length === 5) {
        this.start();
        return this.fingers = 5;
      }
    };

    Close.prototype.onStartedFrame = function(frame) {
      if (frame.hands.length === 1 && frame.fingers.length <= this.fingers) {
        this.fingers = frame.fingers.length;
        if (this.fingers === 0) {
          return this.complete();
        }
      } else {
        return this.unstart();
      }
    };

    Close.prototype.dump = function() {
      return "close: " + (this.started ? 'Started' : 'Not Started') + ": " + this.fingers + " fingers<br>History: " + (this.history.toString());
    };

    return Close;

  })(Surge.Gesture);

  Surge.Gestures.Open = (function(_super) {
    __extends(Open, _super);

    function Open(onCompleted) {
      Open.__super__.constructor.call(this, 'open', onCompleted);
      this.fingers = 0;
      this.history = [];
    }

    Open.prototype.onFrame = function(frame) {
      if (frame.fingers.length !== this.history[this.history.length - 1]) {
        this.history.push(frame.fingers.length);
      }
      return Open.__super__.onFrame.apply(this, arguments);
    };

    Open.prototype.onUnstartedFrame = function(frame) {
      if (frame.hands.length === 1 && frame.fingers.length === 0) {
        this.start();
        return this.fingers = 0;
      }
    };

    Open.prototype.onStartedFrame = function(frame) {
      if (frame.hands.length === 1 && frame.fingers.length >= this.fingers) {
        this.fingers = frame.fingers.length;
        if (this.fingers === 5) {
          return this.complete();
        }
      } else {
        return this.unstart();
      }
    };

    Open.prototype.dump = function() {
      return "open: " + (this.started ? 'Started' : 'Not Started') + ": " + this.fingers + " fingers<br>History: " + (this.history.toString());
    };

    return Open;

  })(Surge.Gesture);

}).call(this);
