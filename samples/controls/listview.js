var uijs = require('../..');
var html = uijs.html;
var box = uijs.box;
var util = uijs.util;
var positioning = uijs.positioning;
var listview = uijs.listview;
var rect = uijs.rect;
var label = uijs.label;
var searchBar = uijs.searchBar;
var bind = uijs.bind;

var app = box();

var colors = ['white','blue','green','red','pink','Cyan','yellow','brown','gold','silver','gray'];

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
	y: 0,
	width: bind(function() { return this.parent && this.parent.width / 5; }),
	height: bind(function() { return this.parent && this.parent.height; }),
	onload: function(container) {
	  container.innerHTML += [
    	'<form style="border:5px solid black;">',
      'Initial item number <input type="text" id="itemNumber" size="10" value="10" /> <br />',
    	'<input type="checkbox" id="searchBar" value="searchBar" checked  /> Search Bar <br />',
      '<input type="button" id="createList" value="Create List" /> <br />',
      '<input type="button" id="addItem" value="Add Item"  /> <br />',
      '<input type="button" id="removeItem" value="Remove Item" /> <br />',
      '<input type="button" id="updateItem" value="update Item" />'+
      'Index <input type="text" id="item" size="10" value="1" /> <br />',
		  '<input type="button" id="replaceAll" value="Replace All" /> <br />',
      '</form>'
      ].join('\n');
    },
  });

var right = null;

left.on('load',function(){
  document.getElementById('createList').onclick = function(){
    if(app.children.length == 2){
      app.remove(right);
      //if (right.searchBar) right.searchBar.input.children[1].dispose();
    }
    right = listview({
      x: bind(positioning.prev.right()),
      y: 0,
      width: bind(function() { return this.parent && 4 / 5 * this.parent.width; }),
      height: bind(function() { return this.parent && this.parent.height; }),
      onBindBoxItem: function(boxItem){
        var backround = rect({
          width: boxItem.width,
          height: boxItem.height - 1,
          color: bind(function () { return boxItem.data.color; }),
        });

        var index = label({
          text: bind(function() { return boxItem.data.index; }),
          x:10,
          y:10,
          width:50,
          height:50,
        });

        var seperator = rect({
          x: 0,
          y: boxItem.height - 1,
          width: boxItem.width,
          height: 1,
          color: 'black',
        });

        boxItem.add(backround);
        boxItem.add(index);
        boxItem.add(seperator);
      },
      itemHeight: 68,
      filterCondition: function(data,value){
        return (data.color.toLowerCase().indexOf(value.toLowerCase()) != -1); 
      },
      searchBar: (document.getElementById('searchBar').checked) ?
        searchBar({ height:40, placeholder: 'search color ...'}) : null,
    });

    var itemNumber = document.getElementById('itemNumber').value;
    var items = [];
    for (var i = 0; i < itemNumber ; i++) {
      var randomColor = colors[Math.floor(Math.random()*11)];
      items.push({color:randomColor, index:i+1});
    };
    right.items = items;

    document.getElementById('addItem').onclick = function(){
      var randomColor = colors[Math.floor(Math.random()*11)];
      right.items.push({color:randomColor, index:right.items.length + 1});
    }
    document.getElementById('removeItem').onclick = function(){
      right.items.pop();
    }
    document.getElementById('updateItem').onclick = function(){
      var randomColor = colors[Math.floor(Math.random()*11)];
      right.items[parseInt(document.getElementById('item').value) -1].color = randomColor;
    }
    document.getElementById('replaceAll').onclick = function(){
      var itemNumber = document.getElementById('itemNumber').value;
      var items = [];
      for (var i = 0; i < itemNumber ; i++) {
        var randomColor = colors[Math.floor(Math.random()*11)];
        items.push({color:randomColor, index:i+1});
      };
      right.items = items;
    }

    app.add(right);
  }  
      
});

app.add(left);


module.exports = app;