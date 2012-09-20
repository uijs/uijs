var uijs = require('../..');
var box = uijs.box;
var bind = uijs.bind;
var searchBar = uijs.searchBar;

var app = box();

var searchbar = searchBar({
	width:bind(function(){return app.width; }),
	height:40,
});

app.add(searchbar);

module.exports = app;