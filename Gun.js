// ==============
// AA Guns
// ==============

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */


// A generic contructor which accepts an arbitrary descriptor object
function Gun(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.rememberResets();
    
    // Set normal drawing scale, and warp state off
    this._scale = 1;

    this.cooldown = this.getCooldown();
};

Gun.prototype = new Entity();

Gun.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
};

// Initial, inheritable, default values
Gun.prototype.rotation = 0;
Gun.prototype.cx = 200;
Gun.prototype.cy = 200;
Gun.prototype.halfWidth = 5;
Gun.prototype.halfHeight = 30;
Gun.prototype.vel = 5;

//Gun.prototype.firingTime = 0;
Gun.prototype.cooldownRange = {
	"min" : 4000,
	"max" : 8000,
}
Gun.prototype.origCooldown = util.getRandomInt(Gun.prototype.cooldownRange.min, Gun.prototype.cooldownRange.max) / NOMINAL_UPDATE_INTERVAL;
Gun.prototype.cooldown = this.origCooldown;


Gun.prototype.update = function (du) {

    //Any Update?
    spatialManager.unregister(this);

    if(this.cooldown <= 0)
    {
    	this.fireBullet();

    	this.cooldown = this.getCooldown();
    }

    //this.firingTime += 0.016 * du;
    this.cooldown -= du;

    


    spatialManager.register(this);

};


Gun.prototype.takeBulletHit = function () {
    // Destructible Gun?
};

Gun.prototype.getCooldown = function() {
	this.origCooldown = util.getRandomInt(Gun.prototype.cooldownRange.min, Gun.prototype.cooldownRange.max) / NOMINAL_UPDATE_INTERVAL;
	return this.origCooldown;
}

Gun.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.rotation = this.reset_rotation;
};

Gun.prototype.fireBullet = function ()
{
	var pos = entityManager._ships[0].getPos();

	var X = this.cx - pos.posX;
	var Y = this.cy - pos.posY;

	var aim = Math.atan(X/Y);
   

    if(X > 0 && Y < 0)
    {
    	var velX = +Math.sin(aim) * this.vel;
    	var velY = +Math.cos(aim) * this.vel;
    	
    }
    else if(X < 0 && Y > 0)
    {
    	var velX = -Math.sin(aim) * this.vel;
    	var velY = -Math.cos(aim) * this.vel;
    	
    }
	else if(X > 0 && Y > 0)
	{
		var velX = -Math.sin(aim) * this.vel;
		var velY = -Math.cos(aim) * this.vel;
		
	}
	else if(X < 0 && Y < 0)
	{
		var velX = +Math.sin(aim) * this.vel;
		var velY = +Math.cos(aim) * this.vel;
		
	}

    

 


        entityManager.fireBullet(  this.cx, 
						           this.cy - this.halfHeight - 8,
						           velX, 
						           velY,
						           0,
						           2);
           
    
}


Gun.prototype.render = function (ctx) {
    //var origScale = this.sprite.scale;
    
    ctx.save();

    ctx.beginPath();
    if(this.cooldown <= 0)
    {
    	ctx.fillStyle = "blue";

    }
    else
    {
    	ctx.fillStyle = "white";
    }	
	ctx.strokeStyle = "black";
	
	ctx.rect(this.cx, this.cy, 2*this.halfWidth, -this.halfHeight);
	ctx.rect(this.cx - 10, this.cy - 12, 2*this.halfWidth + 20, 2);
	ctx.rect(this.cx - 7.5, this.cy - 20, 2*this.halfWidth + 15, 2);
	ctx.rect(this.cx - 5, this.cy - 28, 2*this.halfWidth + 10, 2);
	ctx.stroke();
	ctx.fill();

	ctx.beginPath();
	ctx.rect(this.cx - this.halfWidth, this.cy - 4, this.halfWidth * 4, 4);
	ctx.fillStyle = "red";
	ctx.stroke();
	ctx.fill();

	ctx.beginPath();
	var headR = 8;
	var blue = this.cooldown/this.origCooldown;
	if(blue < 0)
	{
		blue = 0;
	}
	else if (blue > 1) {
		blue = 1;
	}
	var grd = ctx.createRadialGradient( this.cx + this.halfWidth,
										this.cy - this.halfHeight - headR,
										headR/8,
										this.cx + this.halfWidth,
										this.cy - this.halfHeight - headR,
										headR);
	grd.addColorStop(0,"white");
	grd.addColorStop(blue,"blue");
	
	ctx.fillStyle = grd;
	ctx.arc(this.cx + this.halfWidth, this.cy - this.halfHeight - headR, headR, 0, Math.PI * 2, true);
	ctx.fill();
	
	ctx.restore();


};
