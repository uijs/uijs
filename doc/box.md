# Box

The `uijs.box` module is the core of _uijs_. A box represents a rectangluarly bound object on the uijs canvas.

 * [Construction](#construction)
 * [Attributes](#attributes)
 * [Events](#events)
 * [Drawing](#drawing)
 * [Hierarchy](#hierarchy)
 * [Animation](#animation)
 * [Derivation](#derivation)

## Construction

A box is created by calling `box(options)`. The return value is a box. `options` may contain values for any of the box's attributes which override any defaults provided by the box.

Example:

    var uijs = require('uijs');
    
    var mybox = uijs.box({
        x: 10,
        y: 20,
        alpha: 0.5,
    });


## Properties

The base box has the following attributes and defaults:

 * `x`, `y`, `width`, `height` - `Number`s for origin and 
    size (default `0,0-100x100`).
 * `children` - an `Array` of child boxes.
 * `visible` - `Boolean` indicating if this box is visible (default `true`).
 * `rotation` - `Number` for rotation of the box in radians (default `0.0`).
 * `alpha` - `Number` for opacity. 
    0.0 is transparent, 1.0 is opaque (default `null` which means that alpha
    value is not changed by child).
 * `clip` - `Boolean` indicating if the drawing should be clipped to the bounds.
    (default `false`).
 * `interaction` - `Boolean` indicating whether the box receives interaction 
    events (see below, default `true`).
 * `autopropagate` - `Boolean` indicating whether interaction events are 
    propagated to child boxes automatically (default `true`).
 * `id` - an identifier for the box (optional). Can be used by `box.get()` and
    `box.query()` later to find the box within the hierarchy.
 * `invalidators` - An `Array` of properties that invalidate the box's appearance. Invalidators are used
    for optimizing box rendering. See more info TBD.
 * `ondraw` - a `function(ctx)` called to draw the contents of the box 
    (default `null`).
 * `debug` - will output `console.log` output for every interaction event.
    
## Binding

A box is an object that supports binding using the uijs binding system. See the [binding documentation](binding.md) for more info on binding functions to any property and watching for changes.

Essentially, this means boxes have:

 * `box.bind(attr, fn)` - binds the property `attr` to the values returned by calling the function `fn`.
 * `box.watch(attr, cb)` - Calls `cb` every time the value returned from `box[attr]` changes.

## Events

A box is also an [`EventEmitter`](#events.md). It emits events and one can subscribe to be called back on events.

Essentially, this means boxes have:

 * `box.on(event, cb)` - calls `cb` every time the event `event` is emitted.
 * `box.emit(event, ...)` - emits the event `event` to all subscribers.

`EventEmitter` has some more useful functions. Check them out.

## Drawing

The most common use case is for a box user to override `box.ondraw(ctx)`. This allows one to render the contents of the box and will also allow child boxes to be rendered.

If you want to disable child box rendering, replace `box.draw(ctx)`.

### box.ondraw(ctx)

When defined (by default it is `null`), called by the system __on each frame__ so that the box may draw its contents. `ctx` is a `CanvasRenderingContext2D` object.

The drawing context is translated (and rotated) to the box's bounds. This means that `0, 0` represents the box's origin (top-left corner) and `this.width()`, `this.height()` represent it's bottom-right corner.

The drawing context is also set with the box's `alpha` attribute. Note that by default child boxes are also affected by this attribute (if their alpha is `null`).

If `box.clip` is `true`, a clipping region is created so that any drawing outside the bounds of the box will not be visible. By default this is `false` for performance reasons. Try to avoid it and use explicit clipping if possible (e.g. do not draw elements that are outside of the box's bounds in the first place).

Note that `ondraw` will __not__ be called if:

 * `box.ondraw` is `null` `:-)`.
 * `box.visible` is `false`
 * Either `box.width` or `box.height` are 0
 * `box.alpha` is 0.0

Example:

    var mybox = box({
        x: constant(10),
        y: constant(10),
        width: constant(30),
        height: constant(30),
        rotation: constant(Math.PI),
    });
    
    mybox.ondraw = function(ctx) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(0, 0, this.width(), this.height())
    };
    
This will draw a blue rectangle rotated by `PI` radians at `10,10-30x30` (respective to the box's parent coordinates of course).


### box.draw(ctx)

Draws the contents of the box and child boxes.

_Usually this is called by the system._

Box drawing consists of the following steps:

 1. Return if `visible` is `false` or `alpha` is `0.0`.
 1. Translate and rotate the canvas context (applies to box and children).
 1. Set the global alpha (applies to box and children).
 1. Draw the current box by calling `box.ondraw(ctx)`.
 1. Draw all the child boxes by iterating through them and invoking 
    their `draw()` function.

Any changes in the canvas context properties are restored.

## Hierarchy

A box may contain child boxes. The following API allows manipulating the box hierarchy.

> TODO: consider moving all these functions under `box.children.xxx` and extracting it to a separate module.

### box({ children: [ box, box, … ] })

When a box is created, the `children` option may be used to add children. This allows creating box trees declaratively.

For example:

    box({
      children: [
        box(),
        box({ 
          children: [
            box(),
            box()
          ]
        }),
      ]
    });

Do not try to modify `box.children` after the box is created. It won't work.

### box.parent

The parent box of this box. It is assigned when the box is `add()`ed to a parent box, so it is `null` until then.

### box.add(child) or box.push(child)

Appends a child to the box. `child` must be another box (`box.isbox(child) === true`).

Returns the child box, so it will be possible to assign it to a variable. For example:

    var child = mybox.add(box(…));
    
### box.remove([ child ]) --> child

Removes the child `child` from the box. Returns the removed child.

### box.all() --> [ box, box, … ]

Returns all the children as an array.

### box.root() --> box

Returns the root of the box hierarchy. If the box was not added to a parent box, or if it is the root, returns the current box. Will never return `null`.

### box.tofront(child) --> this

Moves `child` to the front (visually). Logically it means that the child will be pushed to the end of the children array.

### box.siblings() --> [ box, box, … ]

Returns the siblings of the current box. This is basically the same as `this.parent().all()`.

### box.prev() --> box

Returns the previous sibling box (the one before this box in the box array).

### box.empty() --> this

Removes all child boxes.

### box.get(id)

Returns the direct child box with `box.id()` equals to `id`.

### box.query(id)

Returns a descendent box (either direct or indirect child) with id `id`.

### box.rest(child) --> [ box, box, … ]

Same as `box.all().map(function(x) { return x !== child )`.

### box.first() --> box

Returns the first child.

### box.tree() --> String

Returns a string the represents the tree of boxes. Useful for debugging.

Example:

    var root = box({
      id: c('#1'),
      children: [
        box({ id: c('#1.1') }),
        box({ id: c('#1.2') }),
        box({ id: c('#1.3'), children: [
          box({ id: c('#1.3.1') }),
          box({ id: c('#1.3.2') }),
          box({ id: c('#1.3.3') }),
        ] }),
        box({ id: c('#1.4'), children: [
          box({ id: c('#1.4.1') }),
          box({ id: c('#1.4.2'), children: [
            box({ id: c('#1.4.2.1') }),
            box({ id: c('#1.4.2.2') }),
          ] }),
          box({ id: c('#1.4.2') }),
        ] }),
      ],
    });

Output:

    #1
    #1.1
    #1.2
    #1.3
        #1.3.1
        #1.3.2
        #1.3.3
    #1.4
        #1.4.1
        #1.4.2
        #1.4.2.1
        #1.4.2.2
        #1.4.2

## Interaction

Touch interaction is implemented using events sent to the box using the `on`/`emit` system.

A box will receive interaction events _only_ if it's `interaction` attribute is `true` _and_ if it's parent box has `autopropagate` at `true` as well. 
By default, these are both `true` although this might change in the future as we want to reduce the number of events dancing around the system.

An event handler is in the form `function(e)` where `e.x` and `e.y` are coordinates relative to the box's top-left corner.

A box may request to __capture__ all future events by calling `box.startCapture()`. From this point forward and until `box.stopCapture()` is called, all interaction events will be sent to the box, regardless if they happened within the box's boundaries. Still `e.x` and `e.y` will be in box coordinates (and obviously may exceed them in both directions). A button implementation, for example, would like to capture events so that when `touchend` happens, the button will be visually released, even if the `touchend` occured outside of the button's bounds.

The following events are emitted:

 * `touchstart`
 * `touchmove`
 * `touchend`
 
On devices with a mouse, touch events are simulated using the mouse in the natural way. 

Note that `touchmove` will be emitted in these cases whenever the cursor is moved on the box and not only between `touchstart` and `touchend`. 

> TODO: maybe we don't want `touchmove` to be emitted without `mousedown`?

### box.interaction Attribute

A `Boolean` which indicates if the box will receive interaction events. If this is `false`, the box is "transparent" and events will pass through it to boxes below it. If this is `true`, and the box covers another box (not as a child), events will only be emitted on the covering box.

### box.autopropagate Attribute

This tells the interaction system to automatically propagate events to child boxes (that are hit by the touch coordinates). This is the default, but it may be changed in cases where a container wishes to control exactly when and which events are propagated to its children. For example, a list view implementation may capture drag events and only propagate click events to it's list items.

If a box wants to manually propagate an event, it can use the `box.propagate(event, e)` (see below).

### box.propagate(event, e)

This function allows a box (usually with `autopropagate` at `false`) to manually propagate an event to child boxes. `propagate` will hit test all children and emit the event on the relevant child, passing along `e.x` and `e.y` translated to child coordinates.

### box.startCapture() and box.stopCapture()

When called by a box, registers the box to receive _all_ interaction events until `box.stopCapture()` is called.

During that time, neither `interaction` nor `autopropagate` are tested, so these can be arbitrarily called on any box in the system and from that point forward all interaction events will be emitted on it with coordinates relative to it's origin.

This mechanism is usually used to allow completion of an interaction experience. E.g. start capture on `touchstart` and stop capture on `touchend`.

The capture registry is maintained at the root box level. This means that a box not associated with a parent will not receive any events.

### box.interact(event, e)

If `interaction` is `false` this will do nothing.

 1. Emits event `event` on the current box.
 2. If `autopropagate` is `true`, calls `box.propagate` to propagate
    the event to hit child boxes.

_Usually this is called by the system._

### box.hittest(pt, filterfn) --> { child, child_pt }

Tests on which child `pt` hits (if any). `filterfn` is called on each child and 
may return `false` to filter out a child from the search (e.g. filter out children with `interaction: false`). The return value is either `null` if there is no child hit or a hash with `child` and `child_pt` (where `child_pt` is `pt` in child coordinates).

_Usually this is called by the system._

## Animation

It is easy to animate any box property using the `box.animate` function.

### box.animate(properties, options)

 * `properties` are a hash of property names and target values.
 * `options.duration` is duration of the animation (in ms). Default is 500ms.
 * `options.curve` is the curve function to use. The `uijs.easing` module contains many types of easing functions from [Robert Penner](http://robertpenner.com/easing).
 * `options.ondone` is called when the animation completes.

For example:

    var mybox = box({ x: 0, y: 0 });

    mybox.on('touchstart', function() {
      mybox.animate({ x: 100, y: 100 });
    });

This will bind animation functions to the `x` and `y` properties so that they
will change from their current value (be it `0` on start or any other) to `100`.

## Derivation

In order to derive from `box`, all you need is to call box and extend the resulting object according to your needs.

For example, say we want to create a box with a background fill.

    var box = require('uijs').box;
    
    function rect(options) {
      var obj = box(options);
      obj.ondraw = function(ctx) {
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, this.width(), this.height());
      };
      return obj;
    }
    
This basically defines a new "type" of box that can be reused:

    var myrect = rect({
      x: constant(10),
      y: constant(10),
      width: constant(100),
      height: constant(100),
    });
    
And we got ourselves a `0,0-100x100` red rectangle.

Now say we want to add an attribute `color` that will define the fill style:

    function rect(options) {
      // make sure we have options
      options = options || {};
      
      // make sure we have `options.color`
      options.color = 'color' in options ? options.color : constant('red');

      var obj = box(options);

      obj.ondraw = function(ctx) {
          ctx.fillStyle = this.color();
          ctx.fillRect(0, 0, this.width(), this.height());
      };
      
      return obj;
    }

## Extending

> TODO: Boxes cannot be extended (yet)