# events

## events.EventEmitter

Borrows from the node.js `EventEmitter`, this is a simple pub/sub system that allows anyone to subscribe and publish arbitrary events on an object.

Example:

    var myee = new EventEmitter();
    
    myee.on('myevent', function(a, b) {
      console.log('myevent', a, b);
    });
    
    myee.emit('myevent', 20, 30);
    myee.emit('myevent', 30, 40);

Output will be:

    myevent 20 30
    myevent 30 40

### emitter.emit(event, ..args..)

Calls all handlers subscribed to `event`. All arguments are passed to the handler. Handler is called with `this` bound to the object.

### emitter.on(event, fn)

Subscribes a handler function `fn` to be called when the event `event` is emitted.

### emitter.removeListener(event, fn)

Removes the function `fn` as a handler for event `event`. Note that you should pass along the same function passed to `on(event, fn)`.

 > TODO: maybe return a cookie from `on` and allow passing it here as well to avoid the need to pass the same function?

### emitter.removeAllListeners(event)

Clears all the handlers for the event `event`. After this call, no handler will be invoked when `event` is emitted.

### emitter.once(event, fn)

_Not implemented (yet)_

Calls `fn` only the next time the event `event` is emitted. This is useful for one-off handling.