// ==============
// Plank
// ==============

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object
function Plank(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

	this.sprite = g_sprites.plank;

    this.rememberResets();
    this.setSize();
    
    // Set normal drawing scale, and warp state off
    this._scale = 1;
};

Plank.prototype = new Entity();

Plank.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
};

Plank.prototype.setSize = function()
{
    this.halfWidth = this.sprite.width/2;
    this.halfHeight = this.sprite.height/2;
    this.radius = this.halfHeight*1.2;
}

// Initial, inheritable, default values
Plank.prototype.rotation = 0;
Plank.prototype.cx = 400;
Plank.prototype.cy = 100;
Plank.prototype.halfWidth = 30;
Plank.prototype.halfHeight = 5;
Plank.prototype.radius = 20;

//For the level.
Plank.prototype.rescueNumber = 0;
Plank.prototype.rescueLimit = 1;

Plank.prototype.returning = 0;
Plank.prototype.returningFull = 1;

Plank.prototype.update = function (du) {
    spatialManager.unregister(this);

    //A little animation for warping citizens
    //Calls nextLevel() after the animation.
    if(this.returning > 0)
    {
    	this.returning += 0.016 * du;

    	if(this.returning > this.returningFull)
    	{
    		this.returning = 0;
            if(this.rescueNumber === this.rescueLimit) levelDesign.nextLevel();
    	}
    }

    spatialManager.register(this);
};

Plank.prototype.returnCitizen = function (du)
{
	g_audio.plantOnPlank.Play();
	this.returning = 0.016 * du;
    entityManager.rescueCitizen();
}

Plank.prototype.getRadius = function () {
    return this.radius;
};


Plank.prototype.takeBulletHit = function () {
    // Destructible Plank?
};

Plank.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.rotation = this.reset_rotation;
};


Plank.prototype.render = function (ctx) {
   ctx.save();

   	if(this.returning > 0)
   	{
   		ctx.beginPath();
		var width = this.returningFull - this.returning;
		var factor = ((this.halfWidth * 2)/this.returningFull);

		var halfDrawWidth = (factor * width)/2;

		ctx.fillStyle = "green";
		ctx.rect(this.cx - halfDrawWidth,
    			this.cy,
    			halfDrawWidth * 2,
    		    -(this.cy - this.halfHeight));

		ctx.fill();
   	}
	
    this.sprite.drawAt(ctx, (this.cx - this.halfWidth), (this.cy - this.halfHeight));
    
	ctx.restore();
};
