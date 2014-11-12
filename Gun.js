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
Gun.prototype.width = 10;
Gun.prototype.height = 30;
Gun.prototype.vel = 5;

Gun.prototype.firingTime = 0;


Gun.prototype.update = function (du) {

    //Any Update?
    spatialManager.unregister(this);

    if(this.firingTime >= 2)
    {
    	this.fireBullet();

    	this.firingTime = 0;
    }

    this.firingTime += 0.016 * du;

    


    spatialManager.register(this);

};


Gun.prototype.takeBulletHit = function () {
    // Destructible Gun?
};

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
						           this.cy - this.height - 8,
						           velX, 
						           velY,
						           0,
						           2);
           
    
}


Gun.prototype.render = function (ctx) {
    //var origScale = this.sprite.scale;
    
    ctx.save();

    ctx.beginPath();
    if(this.firingTime >= 10)
    {
    	ctx.fillStyle = "blue";

    }
    else
    {
    	ctx.fillStyle = "white";
    }	
	ctx.strokeStyle = "black";
	
	ctx.rect(this.cx, this.cy, this.width, -this.height);
	ctx.rect(this.cx - 10, this.cy - 12, this.width + 20, 2);
	ctx.rect(this.cx - 7.5, this.cy - 20, this.width + 15, 2);
	ctx.rect(this.cx - 5, this.cy - 28, this.width + 10, 2);
	ctx.stroke();
	ctx.fill();

	ctx.beginPath();
	ctx.rect(this.cx - this.width/2, this.cy - 4, this.width * 2, 4);
	ctx.fillStyle = "red";
	ctx.stroke();
	ctx.fill();

	ctx.beginPath();
	var headR = 8;
	var blue = 1 - this.firingTime/10;
	if(blue < 0)
	{
		blue = 0;
	}
	var grd = ctx.createRadialGradient( this.cx + this.width/2,
										this.cy -this.height - headR,
										headR/4,
										this.cx + this.width/2,
										this.cy -this.height - headR,
										headR);
	grd.addColorStop(0,"white");
	grd.addColorStop(blue,"blue");
	
	
	
	ctx.fillStyle = grd;
	ctx.arc(this.cx + this.width/2, this.cy -this.height - headR, headR, 0, Math.PI * 2, true);
	ctx.fill();
	
	ctx.restore();


};
