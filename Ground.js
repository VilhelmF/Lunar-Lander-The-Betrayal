// ==============
// Ground Stuff
// ==============

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */


// A generic contructor which accepts an arbitrary descriptor object
function Ground(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.rememberResets();
    
    // Set normal drawing scale, and warp state off
    this._scale = 1;
};

Ground.prototype = new Entity();

Ground.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_firstX = this.firstX;
    this.reset_firstY = this.firstY;
    this.reset_latterX = this.latterX;
    this.reset_latterY = this.latterY;
};

// Initial, inheritable, default values
Ground.prototype.firstX = 0;
Ground.prototype.firstY = 570;
Ground.prototype.latterX = 800;
Ground.prototype.latterY = 500;

Ground.prototype.update = function (du) {

    //Any Update?
    spatialManager.unregisterGround(this);




    spatialManager.registerGround(this);

};


Ground.prototype.takeBulletHit = function () {
    // Destructible ground?
};

Ground.prototype.reset = function () {
    this.firstX = this.reset_firstX;
    this.firstY = this.reset_firstY;
    this.latterX = this.reset_latterX;
    this.latterY = this.reset_latterY;
};

Ground.prototype.getSlope = function () {
    var x = this.latterX - this.firstX;
    var y = this.latterY - this.firstY;
    var slope = y/x;
    return slope;
}


Ground.prototype.render = function (ctx) {
    //var origScale = this.sprite.scale;
    
    ctx.save();
    var haha = Math.floor((Math.random() * 2) + 1);
    if(haha === 1)
    {
        ctx.strokeStyle = "red";
    }
    else
    {
        ctx.strokeStyle = "green";
    }
    
    ctx.beginPath();
    ctx.moveTo(this.firstX, this.firstY);
    ctx.lineTo(this.latterX, this.latterY);
    ctx.stroke();

};
