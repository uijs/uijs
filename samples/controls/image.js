var uijs = require('../..');

var box = uijs.box;
var util = uijs.util;
var positioning = uijs.positioning;
var image = uijs.image;
var bind = uijs.bind;

var html = uijs.html;

var app = box();
app.onCalculate = function (){

}

app.onSetContext = function(ctx){
  ctx.fillStyle = 'gray';
}
app.ondraw = function(ctx) {
  ctx.fillRect(0, 0, this.width, this.height);
}

var left = html({
	x:0,
	y: bind(function() { return this.parent && this.parent.height/2 - 100; }),
	width: bind(function() { return this.parent && this.parent.width/4; } ),
	height: bind(function() { return this.parent && this.parent.height; }),
	onload: function(container) {
	    container.innerHTML += [
	    	'<form style="border:5px solid black;">',
	    	'Enter image path <input type="text" id="image" size="26" value="http://www.ynet.co.il/PicServer2/04062007/1163265/D485-119_wa.jpg"> <br />',
	    	'Enter image box width  <input type="text" size="10" id="boxWidth" value="'+3/4 * this.parent.width+'"> <br />',
	    	'Enter image box height <input type="text" size="10" id="boxHeight" value="'+this.parent.height+'"> <br />',
			'<input type="checkbox" id="stretchWidth" value="StretchWidth" />Stretch Width <br />',
			'<input type="checkbox" id="stretchHeight" value="StretchHeight" />Stretch Height  <br />',
		    '<input type="checkbox" id="fit" value="Fit" /> Fit <br />',
		    'HorizontalAlign <select id="horizontalAlign" >',
		    '<option>center</option>',
		  	'<option>right</option>',
		  	'<option>left</option>',
		  	'</select>  <br />',
		  	'VerticalAlign <select id="verticalAlign">',
		    '<option>middle</option>',
		  	'<option>bottom</option>',
		  	'<option>top</option>',
		  	'</select> <br />',
		    '</form>',
	    ].join('\n');
    },
  })

var right = image({
  x: bind(positioning.prev.right()),
  y: 0,
  width: bind(function() {
  	var bw = document.getElementById('boxWidth');
  	if (!bw) { return 3/4 * this.parent.width(); }

  	return bw.value;
  }),
  height: bind(function() {
  	var bh = document.getElementById('boxHeight');
  	if (!bh) { return this.parent.height(); }

  	return bh.value;
  }),
  image: bind(function() {
  	var imgElement = document.getElementById('image');
  	if (imgElement.value !== '') { src = imgElement.value; }

  	var img = new Image();
  	img.src = src;
  	img.onload = function() { };

  	return img;
  }),
  stretchWidth: bind(function() {
  	var sw = document.getElementById('stretchWidth');
  	if (!sw) { return false; }

  	return sw.checked;
  }),
  stretchHeight: bind(function() {
  	var sh = document.getElementById('stretchHeight');
  	if (!sh) { return false; }
  	return sh.checked;
  }),
  fit: bind(function() {
  	var f = document.getElementById('fit');
  	if (!f) { return false; }

  	return f.checked;
  }),
  horizontalAlign: bind(function() {
	  var hsel = document.getElementById('horizontalAlign');
	  if (!hsel) return 'center';

	  return hsel.options[hsel.selectedIndex].value;
  }),
  verticalAlign: bind(function() {
	 var vsel = document.getElementById('verticalAlign');
	  if (!vsel) return 'middle';

	  return vsel.options[vsel.selectedIndex].value;
  }),
});

var base_ondraw = right.ondraw;
right.ondraw = function(ctx, scale, oppositeScale) {
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 5;
  ctx.strokeRect(0, 0, this.width, this.height);
  base_ondraw.call(this, ctx, scale, oppositeScale);
};

app.add(left);
app.add(right);

module.exports = app;