# HTML Box

The `uijs.html` module is a box that hosts an HTML DOM. It can be used to utilize the power of HTML
whenever it is required in uijs apps/controls (e.g. scrollers, text boxes, etc).

An HTML box is simply a `<div>` element that is layered on top of the canvas and it's position and
size maintained to fit the position and size of the hosting HTML box. It also identifies
mouse/touch events and propogates them to the box hierarchy.

## API

### html(options)

Creates an html box with options. `options.html` will be set as the initial `innerHTML` of
the container. Changing it will _not_ update the contents of the HTML dynamically.

Example:

    var mybox = html({
        html: constant('<p>Initial innerHTML</p>'),
    });
    
### html.onload(container)

If defined, called when the container is created. The container is a `<div>` element that is automatically positioned where the box is.
This is the preferred way to manipulate and maintain the inner HTML content.

Example:

    var mybox = html();
    mybox.on('load', function(container) {
        container.innerHTML = '<h4>This is my box</h4>';
    });
    

### html.container

This is a property that returns the `<div>` container associated with this box. You can use it to alter the `<div>`'s HTML
or make any manipulations that you like. This property can only be called after `onload` has been called. If called beforehand, it will return `null`.

Example:

    var mybox = html();
    
    somebutton.onclick = function() {
      var container = mybox.container;
      if (!container) {
        console.warn('DOM still not loaded');
        return;
      }

      container.innerHTML = '<p>Clicked!</p>'
    };

### html.interaction

As with any box, the `interaction` attribute indicates whether the box receives touch/mouse events. By default, an html
box as `interaction: false` since we usually want regular html interaction. To enable uijs interaction on the box, set 
interaction to `true`:

    var box_with_interaction = html({
      interaction: constant(true),
    });

## Sample

    var uijs = require('uijs');
    var box = uijs.box;
    var positioning = uijs.positioning;
    var constant = uijs.util.constant;
    var animate = uijs.animation;
    
    var html = uijs.html;
    
    var app = box();
    
    // the `color` attribute is a function that returns
    // the color based on the current HTML <option> selection.
    app.color = function() {
      var sel = document.getElementById('color');
    
      // since the inner DOM is not loaded immediately, we must
      // be ready to `sel` to be null.
      if (!sel) return 'red';
    
      return sel.options[sel.selectedIndex].value;
    };
    
    app.ondraw = function(ctx) {
      // just fill with `color()`.
      ctx.fillStyle = this.color();
      ctx.fillRect(0,0,this.width(),this.height());
    };
    
    // This is where we add the `html` box. Pretty much self explainatory.
    app.add(html({
      html: constant('<h1>Select color!</h1>'),
      onload: function(container) {
        container.innerHTML += [
          '<select id="color">',
          '<option value="red">Red</option>',
          '<option value="green">Green</option>',
          '<option value="blue">Blue</option>',
          '<option value="cyan">Cyan</option>',
          '</select>',
          '<button id="butt">Click me!</button>',
        ].join('\n');

        // bind an event handler to the button
        var butt = document.getElementById('butt');
        butt.onclick = function() {
          alert('you clicked me man!');
        };
      },
      x: animate(0, 200, { duration:constant(1000) }),
      y: animate(0, 100, { duration:constant(1000) }),
      width: constant(200),
      height: constant(200),
    }));
    
    module.exports = app;

The result:

![image](https://github.com/eladb/uijs/raw/master/doc/html-1.png)

 > When you open the browser, you will see the HTML box animating from `0, 0` towards `200, 100`
and when you select a different options, the app's background will change accordingly. Pretty cool.