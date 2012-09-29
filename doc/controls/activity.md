# Activity Control

The 'uijs-controls.activity' used to show that a task is in progress.

## Attributes

Following control attributes which may be passed on initialization.

* __animating__ - Indicates animation enabled/disabled. When 'animating' returns 'false' the control is not visble. Default is 'true'.
* __lineType__ - Indicates the line type. Valid values are 'dot' or 'line', the default is 'line'.

### Note
The width of the animated elements in the control is calculated automaticaly based on the control size.

## Example:

    app.add(activity({
      x: 0,
      y: 0,
      width: 100, // default 50
      height: 100, // default 50
      lineType: 'line', // default 'dot'
      animating: true,
    }));

The result:

![image](line.png)

    app.add(activity({
      x: 0,
      y: 0,
      width: 100, // default 50
      height: 100, // default 50
    }));

The result:

![image](dot.png)
