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
    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.ship;
    
    // Set normal drawing scale, and warp state off
    this._scale = 1;
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
Citizen.prototype.velX = 0;
Citizen.prototype.velY = 0;
Citizen.prototype.numSubSteps = 1;

Citizen.prototype.halfHeight = 5;
Citizen.prototype.halfWidth = 5;

Citizen.prototype.isPickedUp = false;
Citizen.prototype.isDead = false;




Citizen.prototype.getRadius = function() {
	return 2*this.halfWidth;
}

    
Citizen.prototype.update = function (du) {

     spatialManager.unregister(this);


    var hitEntity = this.findHitEntity();
    if (hitEntity) 
    {
		// Die from bullets?               
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
	    	
	    	if(this.velY > 2)
	    	{
	    		this.isDead = true;
	    	}

	   		var linelength = 50;
	    	var x1 = this.cx % linelength;
	    	var y1 = aGroundAndSlope.lineY + (x1 * aGroundAndSlope[0]);

	    	this.cx = aGroundAndSlope.lineX;
	    	this.cy = aGroundAndSlope.lineY - this.getRadius();
	        this.velY = 0;
	        this.velX = 0;
	    	
	    }
    
    }


    //Citizen moves with the ship that picked him up
    if(hitEntity && this.isPickedUp)
    {
    	/*if (Object.getPrototypeOf(hitEntity) === Ship.prototype) 
    	{*/
	        console.log("búja");
	       
	        var pos = hitEntity.getPos();

	        var postest = entityManager._ships[0].getPos();
   			//this.cx = pos.posX;
   			//this.cy =  pos.posY + hitEntity.getRadius() - this.halfHeight;
   			
   			this.cx = postest.posX;
   			this.cy = postest.posY + entityManager._ships[0].getRadius() - this.halfHeight;
   			this.velY = 0;
    
    	}
    //}



    if(!this.isDead)
    {
    	spatialManager.register(this);
    }
    
};

Citizen.prototype.pickedUp = function () 
{
	if(!this.isDead)
	{
		this.isPickedUp = !this.isPickedUp;
	}
    

};




Citizen.prototype.render = function (ctx) {
    if(!this.isPickedUp)
    {

    	if(!this.isDead)
    	{
	    ctx.save();
		
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
			ctx.fillRect(this.cx, this.cy + this.halfHeight,2*this.halfWidth, this.halfHeight);	
		}

	}	
};

