var uijs = require('../..');

var app = uijs.box();

app.add(uijs.frame({
  x: 10,
  y: 10,
  width: 100,
  height: 100,
}));

module.exports = app;