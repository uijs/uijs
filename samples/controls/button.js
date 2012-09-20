var uijs = require('../..');

var box = uijs.box;
var util = uijs.util;
var positioning = uijs.positioning;
var button = uijs.button;
var label = uijs.label;
var bind = uijs.bind;

var app = box();

var mybutton = app.add(button({
  x: 10, y: 10, width: 300, height: 50,
  background: '#a3e433',
  color: 'black',
  text: 'Yo',
  image: null,
  size: 20,
}));

app.add(label({
  x: 10, y: 100, width: 300, height: 50,
  color: 'black',
  text: bind(function() { return mybutton.highlighted ? 'highlighted' : 'not highlighted'; }),
  align: 'left',
}));

mybutton.on('click', function() {
  // alert('hey, you clicked me you!');
});

module.exports = app;