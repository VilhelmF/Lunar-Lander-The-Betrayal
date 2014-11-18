// ==========
// Citizen STUFF
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Citizen(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.rememberResets();
    
    // oldman walking or man walking
	this.sprite    = this.type();
	
	this.sound = g_audio.rescue;
	
	//this.sound.beginTime
	
	var dirInfo = this.direction();
	
    this.direction = dirInfo.dir;
	this.velX 	  *= dirInfo.velX;
	
    // Set normal drawing scale, and warp state off
    this._scale = 0.5;
};

Citizen.prototype = new Entity();

Citizen.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
};



// Initial, inheritable, default values
Citizen.prototype.rotation = 0;
Citizen.prototype.cx = 200;
Citizen.prototype.cy = 200;
Citizen.prototype.velX = 0.1;
Citizen.prototype.velY = 0;
Citizen.prototype.numSubSteps = 1;

Citizen.prototype.halfHeight = 5;
Citizen.prototype.halfWidth = 5;

Citizen.prototype.isPickedUp = false;
Citizen.prototype.isDead = false;
Citizen.prototype.landed = false;


//tímabundið drasl
Citizen.prototype.tempFalse = false;






Citizen.prototype.getRadius = function() {
	return 2*this.halfWidth;
}

Citizen.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.isPickedUp = false;
    this.isDead = false;
};

    
Citizen.prototype.update = function (du) {

    spatialManager.unregister(this);


    var hitEntity = this.findHitEntity();
    if (hitEntity) 
    {
		if(Object.getPrototypeOf(hitEntity) === Plank.prototype  && this.isPickedUp === false)
		{
			
			hitEntity.returnCitizen(du);
			return entityManager.KILL_ME_NOW;

		}          
    }

    if(!this.isPickedUp)
    {
    	//Gravity will affect him
	    var steps = this.numSubSteps;
		var dStep = du / steps;
		for (var i = 0; i < steps; ++i) 
		{
		    this.computeSubStep(dStep);
	   	}


	    //Is he stationary on the ground?
	    var aGroundAndSlope = spatialManager.collidesWithGround(this.cx, this.cy, this.getRadius())
	    
		
		if(typeof aGroundAndSlope !== 'undefined' && !this.isPickedUp)
	    {
	    	
			this.sprite.walkUpdate(this.numSubSteps);
	    	
			if(this.velY > 2)
	    	{
	    		this.isDead = true;
	    	}
	    	this.landed = true;

	    	if(this.velY > 0) this.velY = 0;
		
			//change direction (from left to right and right to left)
			if( (aGroundAndSlope.slope < 0 || aGroundAndSlope.slope > 0 ) 
					|| aGroundAndSlope.latterX === aGroundAndSlope.lineX
					|| aGroundAndSlope.firstX  === aGroundAndSlope.lineX
				)
			
			
			/*
				((aGroundAndSlope.slope < 0 || aGroundAndSlope.slope > 0 ) 
				&& aGroundAndSlope.latterX == aGroundAndSlope.lineX)
				||
				((aGroundAndSlope.slope < 0 || aGroundAndSlope.slope > 0 ) 
				&& aGroundAndSlope.firstX  == aGroundAndSlope.lineX)
				)*/ 
				{ 	
					this.direction = !this.direction;
					this.velX *= -1;
				}
			
	    }
    }
    else
    {
    	this.landed = false;
    }


    //Citizen moves with the ship that picked him up
    if(this.isPickedUp)
    {
	    var postest = entityManager._ships[0].getPos();
   		this.cx = postest.posX;
   		this.cy = postest.posY + entityManager._ships[0].getRadius() - this.halfHeight;
   		this.velY = 0;
    }
   

    if(!this.isDead && !this.isPickedUp)
    {
    	spatialManager.register(this);
    }  
};

Citizen.prototype.pickedUp = function () 
{
	if(!this.isDead)
	{
		console.log("rescue audio played");
		g_audio.rescue.Play();
		this.isPickedUp = !this.isPickedUp;
		if(this.isPickedUp) return this;
		else return 0;	
	}
};

Citizen.prototype.takeBulletHit = function () {
    this.isDead = true;
};


Citizen.prototype.render = function (ctx) {
    if(!this.isPickedUp)
    {
		//ætti að vera svona (fyrir þorgeir).
		// g_sprites.manWalking.walkRender(ctx, 
										// this.cx-(this.width/2),
										// this.cy-this.height);
		
		
		this.sprite.walkRender(ctx, 
					this.cx - this.sprite.midPointX,
					this.cy - this.sprite.midPointY.y2,
					this.direction
					);
	
		
		
		/*ctx.save();
    	if(!this.isDead)
    	{
	    
		
		ctx.fillStyle = "red";
	    ctx.beginPath();
	    var headR = 3;
		ctx.arc(this.cx, this.cy - this.halfHeight, headR, 0, Math.PI * 2, true);
		ctx.fill();

		
		//Body	
		ctx.strokeStyle = "red";
		ctx.beginPath();
		ctx.moveTo(this.cx, this.cy -this.halfHeight + headR);
		ctx.lineTo(this.cx, this.cy + 2*this.halfHeight-headR);
		ctx.stroke();

		//Both arms
		ctx.strokeStyle = "red";
		ctx.beginPath();
		ctx.moveTo(this.cx, this.cy);
		ctx.lineTo(this.cx - this.halfWidth	, this.cy + headR);
		ctx.moveTo(this.cx, this.cy);
		ctx.lineTo(this.cx + this.halfWidth, this.cy + headR);
		ctx.stroke();

		//Both legs
		ctx.strokeStyle = "red";
		ctx.beginPath();
		ctx.moveTo(this.cx, this.cy + this.halfHeight);
		ctx.lineTo(this.cx - 0.75*this.halfWidth, this.cy + 2*this.halfHeight);
		ctx.moveTo(this.cx, this.cy + this.halfHeight);
		ctx.lineTo(this.cx + 0.75*this.halfWidth, this.cy + 2*this.halfHeight);
		ctx.stroke();
		}
		else
		{
			ctx.fillStyle="red";
			ctx.fillRect(this.cx - this.halfWidth, this.cy + this.halfHeight,2*this.halfWidth, this.halfHeight);	
		}
		ctx.restore();*/

	}	
};






