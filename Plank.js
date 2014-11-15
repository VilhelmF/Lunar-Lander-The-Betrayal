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

// Initial, inheritable, default values
Plank.prototype.rotation = 0;
Plank.prototype.cx = 400;
Plank.prototype.cy = 100;
Plank.prototype.halfWidth = 30;
Plank.prototype.halfHeight = 5;
Plank.prototype.radius = 20;


//For the level. Temporary?
Plank.prototype.rescueNumber = 0;

Plank.prototype.returning = 0;
Plank.prototype.returningFull = 1;

Plank.prototype.update = function (du) {

    //Any Update?
    spatialManager.unregister(this);

    if(this.returning > 0)
    {
    	this.returning += 0.016 * du;

    	if(this.returning > this.returningFull)
    	{
    		this.returning = 0;
    	}
    }

    spatialManager.register(this);

    if(this.rescueNumber > 2)
    {
    	alert("Sævar, bring me your levelframework!");
    }

};

Plank.prototype.returnCitizen = function (du)
{
	this.returning = 0.016 * du;
	this.rescueNumber += 1;
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
    //var origScale = this.sprite.scale;
    
	this.sprite.drawAt(ctx, (this.cx - this.halfWidth), (this.cy - this.halfHeight));
	
    /*ctx.save();
	
    ctx.beginPath();
    ctx.fillStyle = "grey";
    ctx.strokeStyle = "black";
    ctx.rect(this.cx - this.halfWidth,
    			this.cy - this.halfHeight,
    			this.halfWidth * 2,
    			this.halfHeight * 2);
    ctx.fill();
   	ctx.stroke();*/

   	if(this.returning > 0)
   	{
   		ctx.beginPath();
		var width = this.returningFull - this.returning;
		var factor = ((this.halfWidth * 2)/this.returningFull);

		var halfDrawWidth = (factor * width)/2;

		ctx.fillStyle = "green";
		ctx.rect(this.cx - halfDrawWidth,
    			this.cy - this.halfHeight,
    			halfDrawWidth * 2,
    		    -(this.cy - this.halfHeight));

		ctx.fill();
   	}
	

	ctx.restore();


};
