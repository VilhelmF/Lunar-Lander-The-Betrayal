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
    this.sprite = g_sprites.ground;
    this.prepareSprite();
};

Ground.prototype = new Entity();

// Initial, inheritable, default values
Ground.prototype.firstX = 0;
Ground.prototype.firstY = 570;
Ground.prototype.latterX = 800;
Ground.prototype.latterY = 500;

Ground.prototype.offsetX = 0;
Ground.prototype.offsetY = 0;

Ground.prototype.spritePick = 0;
Ground.prototype.spriteLength = 0;
Ground.prototype.rotation = 0;
Ground.prototype.width = g_canvas.width / 16;

Ground.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_firstX = this.firstX;
    this.reset_firstY = this.firstY;
    this.reset_latterX = this.latterX;
    this.reset_latterY = this.latterY;
};

//Each ground is given a ground sprite randomly
Ground.prototype.prepareSprite = function ()
{
    var width = 72;
    var aSprites = [];
    var i = 1;   
    
    while(width <= this.sprite.width - 72)
    {
        aSprites[i] = width;
        width += 72;
        i++;
    }

    var pick = Math.floor((Math.random() * (aSprites.length - 1)) + 1);
    this.spritePick = aSprites[pick];
    this.getSpriteLength();
}

Ground.prototype.getSpriteLength = function ()
{   

    var x = this.latterX - this.firstX;
    var y = this.latterY - this.firstY;
    var x2 = Math.pow(x, 2);
    var y2 = Math.pow(y, 2);

    var c = Math.sqrt(x2 + y2);
    this.spriteLength = c;
    this.rotation = Math.atan(y/x);
}

Ground.prototype.shake = function(offsetX, offsetY) {
    this.offsetX = offsetX;
    this.offsetY = offsetY;
};

Ground.prototype.update = function (du) {

    //Any Update?
    spatialManager.unregisterGround(this);

    var pos = entityManager.getShipPos();
    if(Math.round(this.offsetX) != 0) {
        var dir = Math.sin(this.offsetX) < 0 ? 1 : -1;
        var sign = this.offsetX < 0 ? -1 : 1;
        this.offsetX = (this.offsetX - sign ) * dir;
    }

    if(Math.round(this.offsetY) != 0) {
        var dir = Math.sin(this.offsetY) < 0 ? 1 : -1;
        var sign = this.offsetY < 0 ? -1 : 1;
        this.offsetY = (this.offsetY - sign) * dir;
    }

    if(this._isDeadNow)
    {
        return entityManager.KILL_ME_NOW;
    }

    spatialManager.registerGround(this);

};


Ground.prototype.takeBulletHit = function (attackType) {

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
};


Ground.prototype.render = function (ctx) {
    ctx.save();
    ctx.translate(this.offsetX, this.offsetY);

    ctx.strokeStyle = "black";
    ctx.fillStyle = "black";

  
    ctx.beginPath();
    ctx.moveTo(this.firstX, g_canvas.height);
    ctx.lineTo(this.firstX, this.firstY);
    ctx.lineTo(this.latterX, this.latterY);
    ctx.lineTo(this.latterX, g_canvas.height);
    ctx.lineTo(this.firstX, g_canvas.height);
    ctx.stroke();
    ctx.fill();

    ctx.translate(this.firstX, this.firstY);  
    ctx.rotate(this.rotation);
    ctx.translate(-this.firstX,-this.firstY);

    ctx.drawImage(this.sprite.image, 
                    this.spritePick, 
                    0, 
                    72, 
                    6, 
                    this.firstX, 
                    this.firstY - this.sprite.image.height, 
                    this.spriteLength, 
                    6);

    ctx.restore();
};
