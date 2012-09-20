var uijs = require('../../..');
var defaults = uijs.util.defaults;
var min = uijs.util.min;
var max = uijs.util.max;
var positioning = uijs.positioning;
var box = uijs.box;
var carouselBehavior = uijs.kinetics.carouselBehavior;
var bind = uijs.bind;

function c(x) { return function() { return x; }; }

module.exports = function(options) {
  var eventHistoryX = [];
  var eventHistoryY = [];

  var blackStrip = box({
    clip: true,
    fillStyle: 'black',
    width: bind(function() {
      var self = this;
      return self.parent.width;
    }),
    height: 100,
    x: 0,
    y: bind(function() {
      var self = this;
      return (self.parent.height / 2) - (self.height / 2);
    }),
  });

  var i = 0;
  var imageStrip = box({
    images: options.images,
    fillStyle: 'black',
    width: bind(positioning.parent.width()),
    height: 100,
    invalidators: ['invalidator'],
    invalidator: bind(function() { return i++; }),
  });

  imageStrip.last_x = 0;
  
  imageStrip.last_x_left_offset = 0;

  imageStrip.getPictureIndexFromParentCoords = function(x) {
    var self = this;
    var x_on_image_strip = -self.last_x + x;
    var base_index = 0;
    var x = -self.last_x_left_offset;
    for (var i = 0; i < self.images.length; i++){
      var image = self.images[i];
      x += image.widthh;
      if (x > x_on_image_strip) {
        base_index = i;
        break;
      };
    }
    return base_index;
  };

  imageStrip.enlarged_image_index = 0;
  imageStrip.enlargement_size = 0;

  imageStrip.onClick = function(position, self) {
    self.images[self.enlarged_image_index].unselect();
    self.enlarged_image_index = self.getPictureIndexFromParentCoords(position);
    self.images[self.enlarged_image_index].select();
    self.enlargement_size = 1;
  };
    
  imageStrip.calculateNewX = function() {
    var self = this;
    self.calculateNewX = carouselBehavior(c(self.imageStripBuff.x), c(self.width - self.imageStripBuff.width), c(300), eventHistoryX, self.onClick);
    return self.calculateNewX();
  };

  imageStrip.bind('x', function(){
    var self = this;
    self.last_x = self.calculateNewX();
    return self.last_x;
  });

  imageStrip.calculateNewY = function() {
    var self = this;
    self.calculateNewY = carouselBehavior(c(self.imageStripBuff.y), c(self.height - self.imageStripBuff.height), c(300), eventHistoryY, function() {});
    return self.calculateNewY();
  };

  imageStrip.bind('y', function() {
    var self = this;
    self.last_y = self.calculateNewY();
    return self.last_y;
  });

  var base = {
    ondraw: blackStrip.ondraw
  };

  imageStrip.setupImages = function(){
    var self = this;
    self.images.forEach(function(img) {
      self = this;
      var i = img;
      i.growing = false;
      i.shrinking = false;
      i.selectedd = false;
      i.maxGrowth = 100;
      i.maxShrink = 50;
      i.growthRate = 0.75; //In pixels per frame
      i.shrinkRate = 0.75; //In pixels per frame
      i.yy = 25;
      i.widthh = 50;
      i.heightt = 50;
      i.shrink = function(){
        self = this;
        self.growing = false;
        self.shrinking = true;
      };
      i.grow = function(){
        self = this;
        self.growing = true;
        self.shrinking = false;
      };
      i.select = function(){
        self = this;
        self.selectedd = true;
        if (self.widthh >= self.maxGrowth) {
          self.shrink();
        }
        else if (self.widthh <= self.maxShrink){
          self.grow();
        }
      };
      i.unselect = function(){
        self = this;
        self.selectedd = false;
        if (self.widthh >= self.maxGrowth) {
          self.shrink();
        }
      };
      i.animate_width = function(){
        self = this;
        if (!self.selectedd && self.widthh >= self.maxGrowth) {
          self.shrink();
        };
        if (self.growing && self.widthh < self.maxGrowth) {
          self.widthh += (self.growthRate * 2);
        }
        else if (self.shrinking && self.widthh > self.maxShrink) {
          self.widthh -= (self.shrinkRate * 2);
        }
        return self.widthh; 
      };
      i.animate_height = function(){
        self = this;
        if (!self.selectedd && self.heightt >= self.maxGrowth) {
          self.shrink();
        };
        if (self.growing && self.heightt < self.maxGrowth) {
          self.heightt += (self.growthRate * 2);
        }
        else if (self.shrinking && self.heightt > self.maxShrink) {
          self.heightt -= (self.shrinkRate * 2);
        }
        return self.heightt; 
      };
      i.animate_x = function(){
        self = this;
        if (!self.selectedd && self.widthh >= self.maxGrowth) {
          self.shrink();
        };
        if (self.growing && self.widthh < self.maxGrowth) {
          self.x -= self.growthRate;
        }
        else if (self.shrinking && self.widthh > self.maxShrink) {
          self.y += self.shrinkRate;
        }
        return self.x;
      };
      i.animate_y = function(){
        self = this;
        if (!self.selectedd && self.heightt >= self.maxGrowth) {
          self.shrink();
        };
        if (self.growing && self.heightt < self.maxGrowth) {
          self.yy -= self.growthRate;
        }
        else if (self.shrinking && self.heightt > self.maxShrink) {
          self.yy += self.shrinkRate;
        }
        return self.yy;
      };
      i.animate = function() {
        self = this;
        self.animate_width();
        self.animate_height();
        self.animate_x();
        self.animate_y();
      };
    });
  };

  imageStrip.setupImages();

  imageStrip.createBuffer = function(){
    var self = this;

    if (!self.imageStripBuff) {
      self.imageStripBuff = document.createElement("canvas");
      self.imageStripBuff.x = 0;
      self.imageStripBuff.y = 0;
      self.imageStripBuff.width = self.images.length * 50;
      self.imageStripBuff.height = 100;
    };
    
    var ctx = self.imageStripBuff.getContext('2d');
    ctx.fillRect(0,0, ctx.canvas.width, ctx.canvas.height);

    var index = 0;
    var x_left_offset = 0;

    //Calculate the left x offset for each image and also animate all the images
    // TODO: there has got to be a better way to do this
    self.images.forEach(function(img) {
      var i = img;
      i.animate();
      x_left_offset += (i.widthh - 50) / 2;
    });
    
    self.last_x_left_offset = x_left_offset; 
    var x = -x_left_offset;
    
    self.images.forEach(function(img) {
      var i = img;
      ctx.drawImage(i, x, i.yy, i.widthh, i.heightt);
      index++;
      x += i.widthh;
    });
  };

  imageStrip.createBuffer();

  blackStrip.onCalculate = function (){

  }

  blackStrip.onSetContext = function(ctx){

  }

  blackStrip.ondraw = function(ctx) {
    var self = this;
    ctx.fillRect(0, 0, self.width, self.height);
  };

  imageStrip.onCalculate = function (){

  }

  imageStrip.onSetContext = function(ctx){

  }
  
  imageStrip.ondraw = function(ctx) {
    var self = this;
    
    self.createBuffer();
    ctx.drawImage(self.imageStripBuff, 0, 0);
  };

  blackStrip.on('touchstart', function(coords) {
    this.startCapture();
    eventHistoryX.push({name: 'touchstart', position: coords.x, timestamp: Date.now()});
    eventHistoryY.push({name: 'touchstart', position: coords.y, timestamp: Date.now()});
  });

  blackStrip.on('touchmove', function(coords) {
    if (!this.capturing()) return;
    eventHistoryX.push({name: 'touchmove', position: coords.x, timestamp: Date.now()});
    eventHistoryY.push({name: 'touchmove', position: coords.y, timestamp: Date.now()});
  });

  blackStrip.on('touchend', function(coords) {
    this.stopCapture();
    eventHistoryX.push({name: 'touchend', position: coords.x ? coords.x : 0, timestamp: Date.now()});
    eventHistoryY.push({name: 'touchend', position: coords.y ? coords.y : 0, timestamp: Date.now()});
  });

  blackStrip.add(imageStrip);

  return blackStrip;
}
