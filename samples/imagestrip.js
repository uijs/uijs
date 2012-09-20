// this sample shows a springy image carousel. pretty awesome.
// source can be found here ./imagestrip

var uijs = require('..');
var loadimage = uijs.util.loadimage;
var carousel = require('./imagestrip/carousel');
var images = require('./imagestrip/data');

var app = uijs.box();

app.add(carousel({
  images: images.map(function(url) { return loadimage(url) }),
}));

module.exports = app;