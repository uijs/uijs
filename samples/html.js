// this example shows the use of the `html` control. this control basically allows you to
// embed any html content into a uijs box. 
// a BIG caveat for html boxes is that the dom element will is overlayed on top of the uijs
// canvas, which will fuck z-index.

var uijs = require('..');
var animate = uijs.animation;
var bind = uijs.bind;

// our app is a filled rectable. it has a `color` attribute
var app = uijs.rect();

// This is where we add the `html` box. Pretty much self explainatory.
var agetiemel = app.add(uijs.html({
  html: '<h1>select color!</h1>',
  x: bind(animate(0, 200, { duration:1000 })),
  y: bind(animate(0, 100, { duration:1000 })),
  width: 200,
  height: 200,
}));

// the `load` event is emitted once the dom is popualted with the
// html container. this will be a <div> element that contains the <h1> above.
agetiemel.on('load', function(container) {
  
  // append a select box to the div
  container.innerHTML += [
    '<select id="color">',
    '<option value="red">Red</option>',
    '<option value="green">Green</option>',
    '<option value="blue">Blue</option>',
    '<option value="cyan">Cyan</option>',
    '</select>',
    '<button id="butt">Click me!</button>',
  ].join('\n');

  var butt = document.getElementById('butt');
  butt.onclick = function() {
    alert('you clicked me man!')
  };

  // we bind the `color` attribute to a function that returns
  // the color based on the current HTML <option> selection.
  // the reason this is done after `load` is that the `#color` element
  // will not exist before that, so we bind the color attribute only after
  // we know we have the color select ready
  app.bind('color', function() {
    var sel = document.getElementById('color');
    return sel.options[sel.selectedIndex].value;
  });

});

module.exports = app;
