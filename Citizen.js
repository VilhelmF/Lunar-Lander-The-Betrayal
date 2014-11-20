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
	this.sprite = this.type();
	
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

//Mission variables
Citizen.prototype.isPickedUp = false;
Citizen.prototype.isDead = false;
Citizen.prototype.landed = false;

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

    //Game is lost when a citizen dies
    if(this.isDead)
    {
		g_audio.citizenDie.soundVolume(1);
		g_audio.citizenDie.playSound();

		entityManager._ships[0].informRestart(du);
		return entityManager.KILL_ME_NOW;
    }

    var hitEntity = this.findHitEntity();
    if (hitEntity) 
    {
		if(Object.getPrototypeOf(hitEntity) === Plank.prototype  && this.isPickedUp === false)
		{
			if(this.velY > 3)
	    	{
	    		this.isDead = true;
	    	}
	    	else
	    	{
	    		hitEntity.returnCitizen(du);
				return entityManager.KILL_ME_NOW;
	    	}
			
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

	    //Is he on the ground?
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

			//change direction if ground have a slope 
			//(from left to right and right to left)
			var slope = aGroundAndSlope.slope;			
			var firstX  = aGroundAndSlope.firstX;
			var latterX = aGroundAndSlope.latterX;
			var lineX = aGroundAndSlope.lineX;
			var index = aGroundAndSlope.index;
			
			if( !(slope === 0) )
			{ 	
				this.direction = !this.direction;
				this.velX *= -1;
			}			
			else if(slope === 0 && (lineX == latterX || lineX == firstX+2))
			{
				this.direction = !this.direction;
				this.velX *= -1;
			}
			
			this.sprite.walkUpdate(this.numSubSteps);			
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
		this.sprite.walkRender(ctx, 
					this.cx - this.sprite.midPointX,
					this.cy - this.sprite.midPointY.y2,
					this.direction
					);
	}	
};






