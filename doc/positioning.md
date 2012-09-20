# Positioning

The `uijs.positioning` module provides a set of utility functions to aid in positioning boxes.

It exports two types of functions:

 1. __Attribute functions__ : `top`, `left`, `width`, `height`, `right`, `bottom`, `centerx`, `centery`
 2. __Relation functions__: `parent.xxx`, `prev.xxx` where `xxx` is one of the attribute function.

A common usage would be to bind one of the relation functions to a box's attribute
so that it will be positioning in relation to it's parent box or some sibling.
For example:

	var box = uijs.box;
	var positioning = uijs.positioning;
	var bind = uijs.bind;
	
	box({
	  width: 300,
	  height: 300,
	  children: [
	    box({
	      id: '#b1',
	      x: bind(positioning.prev.x()),
	      y: bind(positioning.prev.bottom(+5))
	      width: bind(positioning.parent.width()),
	      height: 100,
	    }),
	    box({
	      id: '#b2',
	      x: bind(positioning.prev.x()),
	      y: bind(positioning.prev.bottom(+5)),
	      width: bind(positioning.parent.width()),
	      height: 150,
	    }),
	]})

This will create a box with two children like this:

	+---------------------------+
	|            5px            |
	|+-------------------------+|
	||                         ||
	||           #b1           ||
	||         300x100         ||
	|+-------------------------+|
	|            5px            |
	|+-------------------------+|
	||                         ||
	||                         ||
	||           #b2           ||
	||         300x150         ||
	|+-------------------------+|
	|                           |
	|                           |
	|                           |
	|          300x300          |
	+---------------------------+

Both `#b1` and `#b2` use `positioning.prev.x()` for their `x` attribute. In this case, 
this will position both at `0`.

Also, they both use `positioning.prev.bottom(+5)` as their `y` attribute. This will position `#b2` five pixels from the bottom of `#b1`. `#b1` will be 5px from `0` because it is the first child.

Both children use `positioning.parent.width()` for their `width` attribute, which will stretch 
them to fill whatever width the parent has at any given time.

## Attributes

The following functions return a `function()` that represents the relevant
attribute of the passed in `box` (with an optional delta value).

 * __left(box, [delta])__ or __x(box, [delta])__ - Returns a `function()` that 
   returns the `x` position of the box.
 * __top(box, [delta])__ or __y(box, [delta])__ - Returns a `function()` that 
   returns the `y` position of the box.
 * __right(box, [delta])__ - Returns a `function()` that returns the right side of 
   the box (x + width).
 * __bottom(box, [delta])__ - Returns a `function()` that returns the bottom side of 
   the box (y + height).
 * __width(box, [delta])__ - Returns a `function()` that returns the width of the box.
 * __height(box, [delta])__ - Returns a `function()` that returns the height of the box.
 * __centerx(box, [delta])__ - Returns a `function` that returns the center 
   x-coord between `box` and `this`.
 * __centery(box, [delta])__ - Returns a `function` that returns the center
   y-coord between `box` and `this`.

Example:

    var mybox = box({
        x: 40,
        y: 50,
        width: 100,
        height: 200,
    });
    
    assert(positioning.left(mybox)() === 40); // notice the function call
    assert(positioning.y(mybox)() === 50);
    assert(positioning.bottom(mybox)() === 50 + 200);
    
## Relations

Relation functions bind one of the positional attributes to a box related to the
box that this function is attached to.

For an example, see top of page.

### positioning.parent.{ left | top | . . . }([delta])

Returns a `function()` bound to the parent's attributed position.

For example: `positioning.parent.right()` will return a function that returns the
current right coordinate of the box's parent.

Example:

    // put `mybox` at the center of it's parent
    mybox.bind('x', positioning.parent.centerx());
    mybox.bind('y', positioning.parent.centery());


### positioning.prev.{ left | top | . . . }([delta])

Returns an attributed positional `function()` bound to the previous child's attribute.

If this function is attached to the first child, it will use `0, 0 - 0 x 0` as the bounds of 
the "previous" (non existing) child. See the example above for an example.

Example:

    // put `mybox` 5 pixels south of the previous child
    mybox.bind('y', positioning.prev.bottom(+5));

### positioning.relative(id).{ left | top | . . . }([delta])

Returns an attributed positional `function()` bound to a relative with ID `id`.

Example:

    box({
      box({ id: '#hello' }),
      box({ x: bind(positioning.relative('#hello').bottom()) )})
    });

This will cause the 2nd child to be located at the bottom of the first child.