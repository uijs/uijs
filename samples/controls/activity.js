var uijs = require('../..');

var box = uijs.box;
var util = uijs.util;
var positioning = uijs.positioning;
var activity = uijs.activity;
var bind = uijs.bind;

var html = uijs.html;

var app = box();

app.onCalculate = function (){

}

app.onSetContext = function(ctx){
  ctx.fillStyle = 'black';
}

app.ondraw = function(ctx) {
  ctx.fillRect(0, 0, this.width, this.height);
};

var start = Date.now();
app.add(activity.line({
  x: 10,
  y: 10,
  width: 100,
  height: 100,
  animating: true, //bind(function () { return Date.now() - start < 2000 || Date.now() - start > 5000; }),
}));

module.exports = app;