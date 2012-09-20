var uijs = require('../..');
var box = uijs.box;
var bind = uijs.bind;
var textbox = uijs.textbox;

var app = box();

var textBox = textbox({
	x:bind(function(){return ((app.width - this.width)/2); }),
	y:bind(function(){return app.height/2; }),
	width:bind(function(){return app.width/3; }),
	height:50,
	_id: 'app',
});

textBox.onCalculate = function(){

}

textBox.onSetContext = function(ctx){
	ctx.fillStyle = 'blue';
}

textBox.ondraw = function(ctx){
  	ctx.fillRect(0, 0, this.width, this.height);
}

app.add(textBox);

module.exports = app;