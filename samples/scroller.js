// this is a sample for the `scroller` control. basically, you just set the
// `content` attribute with some box and it can scroll with kinetic behavior.

var uijs = require('..');
var positioning = uijs.positioning;
var scroller = uijs.scroller;
var box = uijs.box;
var bind = uijs.bind;

var app = scroller({ content: stripes() });
module.exports = app;

// --

// returns a huge box with numbered stripes
function stripes() {
  var obj = box({
    width: bind(positioning.parent.width()),
    height: 10000,
    interaction: false,
  });

  obj.ondraw = function(ctx) {
    ctx.strokeStyle = '#666';
    ctx.font = '20px Helvetica';
    ctx.fillStyle = '#aaa';
    ctx.fillRect(0, 0, this.width, this.height);
    var curr_y = 0;
    var h = 100;

    ctx.fillStyle = '#333';
    
    var i = 0;
    while (curr_y < this.height) {
      ctx.strokeRect(0, curr_y, this.width, h);
      ctx.fillText(i.toString(), 20, curr_y + 56);
      curr_y += h;
      i++;
    }
  };

  return obj;
}