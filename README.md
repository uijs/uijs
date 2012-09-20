# Welcome to uijs

[![Build Status](https://secure.travis-ci.org/uijs/uijs.png)](http://travis-ci.org/uijs/uijs)

__uijs__ is (yet another) cross platform mobile UI toolkit for apps.

Our goal is to create a UI software stack for mobile apps that looks and behaves like native mobile UI. Current stacks like [jQuery Mobile](http://jquerymobile.com/), [jQTouch](http://www.jqtouch.com) and [Sencha Touch](http://www.sencha.com/products/touch) are doing an excellent job with HTML5. We thought it would be interesting to try out something a little different and use the HTML5 canvas as our basis for the entire UI system.

Our thesis, which is yet to be proven, is that since we have almost full control on both rendering and behavior we might be able to create a great experience, which mobile users are accustomed to in native apps today.

uijs's codebase is maintained on [github](https://github.com) (of course) and published via [npm](npmjs.org) as [CommonJS](http://www.commonjs.org) modules. See [Getting Started](#getting-started) for more information on how to install uijs and build uijs apps.

We believe in the ["batteries are not included"](https://github.com/joyent/node/wiki/node-core-vs-userland) philosophy employed in projects like [node.js](http://nodejs.org). For frontend libraries, this is even more critical because one would want to keep the footprint of their app as small as possible, so we didn't want to put too much into the core library.

#### Stability

[Stability](http://nodejs.org/api/documentation.html#documentation_stability_index) index: 1 - Experimental.

__uijs__ is in early stages of development. It is still not mature enough for building actual apps with but we are looking for awesome hackers to join in and solve all those crazy problems. At this point (v0.0.1), uijs is not yet usable. We are building it as you read this (yes!). If you are interested in contributing or trying it out, you are more then welcome. Ping us at the [uijs google group](mailto:uijs@googlegroups.com).

# Hello, uijs!

## Installing uijs-devtools

You'll need [node](nodejs.org), which comes bundled with [npm](npmjs.org).

To installl the [development tools](https://github.com/uijs/uijs-devtools) globally, type:

    $ npm install -g uijs-devtools

Verify that they work:

    $ uijs
    Development tools for uijs apps and modules (version 0.0.1)
    ...

Now, create a directory for your app/module and install uijs there:

    $ cd hello-uijs
    $ npm install uijs

> __Contributors__: Instead of using `npm install` you can use `npm link` to reference a local copy of a the `uijs` module. Git clone [https://github.com/uijs/uijs](https://github.com/eladb/uijs) into a local directory, run `npm link` within that directory and then you can use `npm link uijs` to install the `uijs` module as a link. You will see that `node_modules/uijs` will be a symlink instead of a real directory. You might also want to do the same for `uijs-core` and `uijs-controls` within the `uijs` repo. Loving npm!

This will create a `node_modules/uijs` directory with the uijs core module.

## Create app.js

__uijs__ apps/modules are [CommonJS](commonjs.org) libraries (`require`, `module.exports`) which export a uijs [box](doc/box.md). A box is a visual rectanglurly-bound element that can draw itself and may have child boxes. In uijs everything is a box.

Let's create a simple box that prints 'hello, uijs!'.

Create a file named `hello.js`:

    var uijs = require('uijs');

    var app = uijs.box();

    app.add(uijs.label({
      x: 10, y: 10, width: 200, height: 50,
      text: 'Hello, uijs!',
      color: '#1c8bdc',
      size: 30,
      bold: true,
      shadowColor: '#ccc',
      shadowOffsetX: 2,
      shadowOffsetY: 2,
      shadowBlur: 5,
    }));

    module.exports = app;

Basically what we did here is create an app box with a single child label (which is also a box). The label box has some properties like bounds (`x`, `y`, `width` and `height`), which is common to all boxes and some label-specific properties (`text`, `color`, etc). The function `box.add(child)` is used to add a child box to the app.

Notice that we do not specify any bounds for the app because by default it will be stretched to fill the entire browser window.

## Building
    
Now, build and open the resulting html file:

    $ uijs build hello.js
    dist/hello.uijs.js created
    dist/hello.uijs.html created

The `uijs` program is the entry point for the [devtools](https://github.com/uijs/uijs-devtools). We use the `build` command, passing it `hello.js` as the input. Type `uijs -h` for usage.

`build` created two outputs: `dist/hello.uijs.js` and `dist/hello.uijs.html`:

 * The .`js` file is our app bundled using 
   [Browserify](https://github.com/substack/node-browserify). It basically allows 
   including a uijs app using a `<script>` tag within any HTML document.
 * The `.html` file is a standard uijs HTML shim with the bundled app
   embedded and contains the uijs bootstrapping code. In most 
   cases, you will only need this file to serve your app to clients via CDN or 
   some other static file server.

Open `dist/hello.uijs.html` with a web browser and you should see something like this:

![image](https://raw.github.com/uijs/uijs/master/doc/hello1.png)

Yeah!

## Working iteratively

Passing `-w` to `uijs build` will start a file watch on the directory and automatically rebuild when your code changes, so you can work iteratively and refresh the browser window.

    $ uijs build hello.js -w
    Watching /Users/eladb/hello-uijs exclude: [ 'dist', 'node_modules', '.git', /\.tmp.+/ ]
    dist/hello.uijs.js created
    dist/hello.uijs.html created    
    ...
    /Users/eladb/hello-uijs/hello.js changed. rebuilding
    dist/hello.uijs.js created
    dist/hello.uijs.html created    
    ...

Pretty useful!

## Binding attributes to functions

One of uijs's freakingly awesome features is it's binding system. You can read more about 
it [here](doc/binding.md). Simply put, you can `bind` any box property to a function 
and `watch` any property for changes (even if they are bound to functions (hell, yeah!)).

Let's edit `hello.js` and bind the label's text to something useful:

Replace this:

      text: 'Hello, uijs!',

With this:

      text: uijs.bind(function() { return window.innerWidth + 'x' + window.innerHeight; }),

Now you should see something like this:

![image](https://raw.github.com/uijs/uijs/master/doc/hello2.png)

If you change the browser window dimensions, you should see these values change immediately.

## Running on a mobile device

uijs is all about mobile apps, so we are trying to make it super easy to serve your app for development and access it through the local network via your mobile browser.

Execute:

    $ uijs debug hello.js -w
    Watching /Users/eladb/hello-uijs exclude: [ 'dist', 'node_modules', '.git', /\.tmp.+/ ]
    dist/hello.uijs.js created
    dist/hello.uijs.html created
    starting debugger for /Users/eladb/hello-uijs/dist/hello.uijs.js
    uijs debugger listening on port 5000

As you can see, the debugger is listening on port 5000. Now all you need to do is point your mobile device to `http://<your-machine-ip-address>:5000` and your app should show up.

Since most mobile browsers do not have a console window, if you use `console.log` in your codebase, those logs will be outputed on the console of your host machine, making your life so much better.

Since we used `-w`, the file watch will also work in this mode.

# Samples

Samples are simple uijs apps. In order to open a sample, use `uijs build` (or `uijs debug`) with the sample file:

For example:

    $ cd samples
    $ uijs build interaction-sample.js
    dist/interaction-sample.uijs.js created
    dist/interaction-sample.uijs.html created
    $ open dist/interaction-sample.uijs.html

# Tests

`npm test` will run all tests. These are the regression tests that should be executed before commiting code into the repository.

We have two types of tests:

 1. Functional tests are located under `test/*.test.js`. __Functional tests__ 
    are simply node.js scripts. If they exit with a non zero exit code, the test 
    failed.
 2. _This is broken_: Visual tests are located under `test/*.cantest.{js|png}`. __Visual tests__ 
    use [node-canvas](https://github.com/learnboost/node-canvas) and 
    [cantest](https://github.com/eladb/node-cantest) and can be executed 
    using `cantest xxx.cantest.js`. Read more about visual tests in the 
    [cantest README](https://github.com/eladb/node-cantest/blob/master/README.md) 
    file. To run visual tests, you will have to install [cairo](http://cairographics.org/). On a mac with [homebrew](http://mxcl.github.com/homebrew/) just type `brew install cairo`.

Running all tests:

    $ npm test
    > uijs@0.0.1 test
    > cd test && ./run.sh
    
    Running catest tests
    Running functional tests

# Benchmarks

Benchmarks are uijs apps (export a `box`). All benchmarks are under the `benchmarks` directory.
To run a benchmark, use the uijs devtool `bench` or `prof` commands. By default the benchmark will run for 5 seconds. If `prof` is used, it will show a profiler output.

    $ cd benchmarks
    $ uijs bench the-box.js
    the-box.js 34303.2fps
    $ uijs prof the-box.js
    ...
    ... # benchmark results
    ...
    the-box.js 36176.4fps

Note that since benchmarks are regular uijs apps, they can usually be also opened from the browser. The fps measurements will be outputed to the console.

    $ cd benchmarks
    $ uijs debug the-jumping-box.js
    http://localhost:5000

#### Results

_All results are from MacBook Air 1.8 GHz i7 4GB_

    +---------------------------------+-------------------+
    | test               | b87c5582d2 | 8119a6f096        |
    +--------------------+------------+-------------------+
    | the-box.js         | 13,592fps  | 66,870fps (+491%) |
    | the-jumping-box.js | 141.4fps   | 1,398fps (+988%)  |
    +---------------------------------+-------------------+

## License

(The MIT License)

Copyright (c) 2012 uijs.org and other uijs contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.