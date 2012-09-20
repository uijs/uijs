// demonstrates attributes related to box interaction
// when you touch one of the boxes in this sample you will see which
// boxes receive events. the colored box that is 'dragged' with the touchpoint
// represents the colors of the boxes currently capturing events.

var uijs = require('..');
var box = uijs.box;
var defaults = uijs.util.defaults;
var html = uijs.html;
var positioning = uijs.positioning;
var bind = uijs.bind;

function demobox(options) {
  var demobox = uijs.rect(defaults(options, {
    label: '',
    touching: false,
    color: '#ccc',
    invalidators: [ 'alpha', 'touching' ]
  }));

  // label at top-left
  demobox.add(uijs.label({
    x: 5, 
    y: 5, 
    height: 16,
    width: bind(function() { return this.parent.width - 10 }),
    text: bind(function() { return this.parent.label }),
    size: 14,
    align: 'left',
    verticalAlign: 'top',
  }));

  // boxid at bottom-right
  demobox.add(uijs.label({
    x: bind(function() { return this.parent.width - this.width - 5 }), 
    y: bind(function() { return this.parent.height - this.height - 5 }),
    adjustsBoxSizeToFitFontSize: true,
    text: bind(function() { return this.parent._id }),
    color: '#333',
    size: 10,
    align: 'left',
    verticalAlign: 'top',
  }));

  demobox.add(uijs.frame({
    width: bind(function() { return this.parent.width }),
    height: bind(function() { return this.parent.height }),
    visible: bind(function() { return demobox.touching; }),
  }));

  demobox.on('touchstart', function(e) {
    this.touching = true;
    this.startCapture();
  });

  demobox.on('touchend', function(e) {
    this.touching = false;
    this.stopCapture();
  });

  return demobox;
}

var app = demobox();

var with_capture = app.add(demobox({
  id: '#anchor1',
  x: 50,
  y: 50,
  width: 300,
  height: 400,
  color: '#BF0C43',
  interaction: true,
  label: 'interaction=true',
}));

with_capture.add(demobox({
  x: 50,
  y: 50,
  width: 100,
  height: 100,
  color: '#127A97',
  interaction: true,
  label: 'child+interaction',
}));

var without_capture = app.add(demobox({
  x: 100,
  y: 250,
  width: 350,
  height: 100,
  color: '#F9BA15',
  interaction: false,
  label: 'interaction = false (see through)',
}));

var noprop = app.add(demobox({
  id: '#anchor2',
  x: 250,
  y: 100,
  width: 300,
  height: 100,
  color: '#8EAC00',
  interaction: true,
  autopropagate: false,
  label: 'interaction = true, autopropagate = false',
}));

noprop.add(demobox({
  color: '#452B72',
  x: 20,
  y: 50,
  width: 150,
  height: 30,
  label: 'will not receive events',
}));

module.exports = app;