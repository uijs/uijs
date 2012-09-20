# Binding

The uijs binding system allows:

 1. Attaching functions to Javascript object attributes.
 2. Watching for changes on attributes, even if they are bound to functions.
 3. Do awesome stuff.

The binding system is exported under `uijs.bind`.

### Instrumenting objects for bindings

In order to instrument an object to support binding, one should call `bind(obj)`.

Once called, the binding system adds two functions to `obj`:

 * `obj.bind(attr, fn)` - binds `attr` to the values returned by the 
    function `fn`.
 * `obj.watch(attr, cb)` - watches for changes in the values returned by 
    `attr`.

For example:

    var obj = {};
    bind(obj); // instrument `obj` with binding magic
    obj.y = 10;
    obj.bind(x, function() { return this.y * 2; });
    assert(obj.x === 20);

### Object literals

We love object literals (who doesn't?). In order to support literals, just use `bind(fn)` as the right-hand side of the attribute assignment. After a call to `bind(obj)`, these attributes will turn into actual bindings:

    var obj = {
      y: 10,
      x: bind(function() { return this.y * 2; }) // <-- bind promise
    };

    assert(obj.x === { $bind: [function] }); // <-- bind promise
    bind(obj); // promise fullfilled
    assert(obj.x === 20);

> __Caveat__: this special promise sugar introduces a caveat. You can't do something like `obj.x = bind(fn)`. This will result in `obj.x` returning `{ $bind: [function] }`, which is the bind promise.

### Watch

Watching for changes is straightforward:

    obj.watch('y', function(val) {
      console.log('y = ' + val);
    });

    bind.tick(); 
    obj.y = 99;
    bind.tick();

Output:

    y = 10
    y = 99

### bind.tick ?

At the heart of the uijs binding system there lies `bind.tick()`. [TODO]

