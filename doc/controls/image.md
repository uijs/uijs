# Image Control

The `uijs-control.Image` module is a box that hosts an image.

## Attributes

The following functions return a `function()` that represents the relevant
attribute.

 * __image__ - Returns a `function()` that returns a canvas image object.
 * __stretchWidth__ - Returns a `function()` that returns a boolean value which
 indecates whether to stretch the width of the image to the box width (it will try to keep 
 the original image ratio if possible).
 * __stretchHeight__ - Returns a `function()` that returns a boolean value which
 indecates whether to stretch the height of the image to the box height (it will try to keep 
 the original image ratio if possible).
 * __fit__ - Returns a `function()` that returns a boolean value which
 indecates whether to fit the image to the box dimention while keeping the original image ratio.
 * __horizontalAlign__ - Returns a `function()` that returns the horizontal alignment of the
 image in the box - optional values :center, left and right.
 * __verticalAlign__ - Returns a `function()` that returns the vertical alignment of the
 image in the box - optional values :middle, top and bottom.

### Note

 * In case both the fit and stretch options are enabled, the image will be fitted and not stretched.
 * When an image is being stretched on one dimention, its other dimention will be changed as well in order to keep the original image ratio as much as possible.

Examples:

    image({
        image: uijs.util.loadimage('ImagePath.jpg'),
        stretchWidth: uijs.util.constant('false'),
        stretchHeight: uijs.util.constant('false'),
        fit: uijs.util.constant('false'),
        horizontalAlign: uijs.util.constant('center'),
        verticalAlign: uijs.util.constant('middle'),
    })

    box size - 100,100
    image size - 50,50

    +---------------------------+
    |                           |
    |           25px            |
    |      +-------------+      |
    |      |             |      |
    | 25px |             | 25px |
    |      |    50X50    |      |
    |      +-------------+      |
    |           25px            |
    |                           |
    +---------------------------+

    horizontalAlign:uijs.util.constanct('left')
    verticalAlign:uijs.util.constanct('top')

    ++------------+-------------+
    ||            |             |
    ||    50X50   |     50px    |
    ||            |             |
    ||            |             |
    |+------------+             |
    |                           |
    |   50px                    |
    |                           |
    |                           |
    +---------------------------+

    box size - 100,50
    image size - 25,25

    stretchWidth:uijs.util.constanct('true')

    ++-------------------------++
    ||                         ||
    ||         100X50          ||
    ||                         ||
    ||                         || 
    ++-------------------------++

    stretchHeight:uijs.util.constanct('true')

    +------+-------------+------+
    |      |             |      |
    | 25px |    50X50    | 25px |
    |      |             |      |
    |      |             |      | 
    +------+-------------+------+ 

    fit:uijs.util.constanct('true')

    +------+-------------+------+
    |      |             |      |
    | 25px |    50X50    | 25px |
    |      |             |      |
    |      |             |      | 
    +------+-------------+------+
