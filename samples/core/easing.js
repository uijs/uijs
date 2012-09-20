// this sample allows playing around with the various easing functions built into uijs
// it shows a select box with an option per easing function and when selected, it animates
// a small red box on screen from 10 to 500 using that easing function for 5s forward 
// and then 0.5s backwards.

var uijs = require('../..');

var app = uijs.box();

var b = app.add(uijs.box({
  x: 10, y: 10, width: 20, height: 20,
}));

b.ondraw = function(ctx) {
  ctx.fillStyle = 'red';
  ctx.fillRect(0, 0, this.width, this.height);
};

// construct an html form with an `option` for each easing function
var h = '<form><select id="combo">';
for (var k in uijs.easing) h += '<option name="' + k + '">' + k + '</option>';
h += '</select></form>';

var form = app.add(uijs.html({
  html: h,
  x: 10, y: 50,
  width: 200, height: 50,
}));

form.on('load', function(div) {
  var select = document.getElementById('combo');
  select.onchange = function(x) {
    // animate x to 500...
    b.animate({ x: 500 }, {
      duration: 5000,
      curve: uijs.easing[select.value],
      ondone: function() {
        // ...and back to 10
        b.animate({ x: 10 }, {
          duration: 500,
          curve: uijs.easing[select.value]
        });
      },
    });
  };
});

module.exports = app;