// this sample merely shows a rect 320x480 (iOS 3")
// it can be used to calibrate web apps/phonegap for the proper resolution and pixel ratio

var uijs = require('../..');

var app = uijs.box();

var rect = app.add(uijs.rect({
  x: 5, 
  y: 5,
  width: 320 - 10,
  height: 480 - 20 - 10,
  color: '#aa0000',
}));

rect.add(uijs.label({
  width: uijs.bind(function() { return this.parent.width }),
  height: uijs.bind(function() { return this.parent.height }),
  text: uijs.bind(function() { return (this.width+10) + 'x' + (this.height+10); }),
  color: 'white',
}));



module.exports = app;
