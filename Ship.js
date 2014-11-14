// ==========
// SHIP STUFF
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Ship(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.rememberResets();
    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.shipZoom;

	
    // Set normal drawing scale, and warp state off
    this._scale = 0.5;
    this._isWarping = false;
};

Ship.prototype = new Entity();



Ship.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
};

Ship.prototype.KEY_THRUST = 'W'.charCodeAt(0);
Ship.prototype.KEY_RETRO  = 'S'.charCodeAt(0);
Ship.prototype.KEY_LEFT   = 'A'.charCodeAt(0);
Ship.prototype.KEY_RIGHT  = 'D'.charCodeAt(0);
Ship.prototype.KEY_FIRE   = 'E'.charCodeAt(0);

Ship.prototype.USE   = ' '.charCodeAt(0);

// Initial, inheritable, default values
Ship.prototype.rotation = 0;
Ship.prototype.cx = 200;
Ship.prototype.cy = 200;
Ship.prototype.velX = 0;
Ship.prototype.velY = 0;
Ship.prototype.launchVel = 2;
Ship.prototype.numSubSteps = 1;

Ship.prototype.rightRotation = 0.01;
Ship.prototype.leftRotation = 0.01;

Ship.prototype.fuel = {
    cx : 0,
    cy : 0,

	status: 1,	// 100%
	
    height : 20,
    color : "red",

	render: function(ctx, cx, cy) {
	
		if(!g_doZoom){
			if(this.status > 0.23){
			
				g_sprites.fuelBarSlide.cropImageBy (ctx, 
													this.cx, 
													this.cy, 
													this.status);
				g_sprites.fuelBarFill.cropImageBy  (ctx, 
													this.cx, 
													this.cy, 
													this.status-0.04);
			}
			else 
			{
				g_sprites.fuelBarFill.cropImageBy  (ctx, 
													this.cx, 
													this.cy, 
													this.status);
			}
	
			//fuel bar outline
			g_sprites.fuelBarOutline.drawAt(ctx, this.cx, this.cy);
		
			//fuel bar status shown on screen right 
			//side of sprite fuelBarOutline. 
			ctx.save();
			ctx.fillStyle = "black";
			ctx.font = "bold 12px Courier New";
			ctx.fillText(
						Math.floor(this.status * 100) + "%", 
						g_sprites.fuelBarOutline.width, 
						28
					);
			ctx.restore();
			
		}
		else {
			
			// zoom mode, 
			// Þorgeir þarf að tala við sævar um þetta
			
			ctx.save();
			
			var y = cy+25;
			var x = cx+35;
			
			ctx.fillStyle = "green";
			ctx.font = "bold 10px Courier New";
			ctx.fillText(Math.floor(this.status * 100) + "%",
							x+5, 
							y);
							
			ctx.font = "bold 8px Courier New";
			ctx.fillText("FUEL",
							x, 
							y-8);
			
			ctx.restore();

		
		}
	},
};


//Mission variables?
Ship.prototype.landed = false;
Ship.prototype.Citizen = 0; 


//===========================================================================
//========================= Warping Functions ===============================
//===========================================================================
Ship.prototype.warp = function () {

    this._isWarping = true;
    this._scaleDirn = -0.5;

    if(this.Citizen)
    {
        this.Citizen.reset();
        this.Citizen = 0;
    }
	
	// shipWarping death sound played
	g_audio.shipWarp.Play();
	
	
    
    // Unregister me from my old posistion
    // ...so that I can't be collided with while warping
    spatialManager.unregister(this);
};

Ship.prototype._updateWarp = function (du) {

    var SHRINK_RATE = 3 / SECS_TO_NOMINALS;
    this._scale += this._scaleDirn * SHRINK_RATE * du;
    
    if (this._scale < 0.2) {
    
        //this._moveToASafePlace();
        this.cx = this.reset_cx;    
        this.cy = this.reset_cy;    

        this.halt();
        this._scaleDirn = 0.5;
        
    } else if (this._scale > 0.5) {
    
        this._scale = 0.5;
        this._isWarping = false;
        
        // Reregister me from my old posistion
        // ...so that I can be collided with again
        spatialManager.register(this);
        
    }
};

Ship.prototype._moveToASafePlace = function () {

    // Move to a safe place some suitable distance away
    var origX = this.cx,
        origY = this.cy,
        MARGIN = 40,
        isSafePlace = false;

    for (var attempts = 0; attempts < 100; ++attempts) {
    
        var warpDistance = 100 + Math.random() * g_canvas.width /2;
        var warpDirn = Math.random() * consts.FULL_CIRCLE;
        
        this.cx = origX + warpDistance * Math.sin(warpDirn);
        this.cy = origY - warpDistance * Math.cos(warpDirn);
        
        this.wrapPosition();
        
        // Don't go too near the edges, and don't move into a collision!
        if (!util.isBetween(this.cx, MARGIN, g_canvas.width - MARGIN)) {
            isSafePlace = false;
        } else if (!util.isBetween(this.cy, MARGIN, g_canvas.height - MARGIN)) {
            isSafePlace = false;
        } else {
            isSafePlace = !this.isColliding();
        }

        // Get out as soon as we find a safe place
        if (isSafePlace) break;
        
    }
};

//===========================================================================
//===========================================================================
//===========================================================================


    
Ship.prototype.update = function (du) {

    // Handle warping
    if (this._isWarping) {
        this._updateWarp(du);
        return;
    }
    

     spatialManager.unregister(this);


    //=====================================================================
    //======================The Ships Landing Detection====================
    //=====================================================================
    var ground = spatialManager.collidesWithGround(this.cx, this.cy, this.getRadius())
    var shipsRotation = Math.abs(this.rotation) % (2*Math.PI);
    if(typeof ground !== 'undefined')
    {
        if(ground.slope !== 0)
        {
            particleManager.explosion(this.cx, this.cy);
			this.warp();
        }
        else
        {
           if(this.velY > 2 || this.velX > 3 || ( shipsRotation> 0.5*Math.PI))
            {

                particleManager.explosion(this.cx, this.cy);
				this.warp();
            }
            else
            {   
                if(this.velY > 0) this.velY = 0;
                if(this.velX !== 0) this.velX = 0;
                this.landed = true;
                
                this.adjustRotation(du);
            } 
        }
    }
   
    //---------------------------------------------------------------
    //---------------------------------------------------------------
    //---------------------------------------------------------------

    if(this.fuel.status <= 0) {
        particleManager.explosion(this.cx, this.cy);
        //this.fuel.level = 100; // FIXME: temporary, should loose life
		this.fuel.status = 1;
		
        this.warp();
    }

    if(this._isDeadNow)
    {
        return entityManager.KILL_ME_NOW;  
    }


    // Perform movement substeps
    var steps = this.numSubSteps;
    var dStep = du / steps;
    for (var i = 0; i < steps; ++i) {
        this.computeSubStep(dStep);
    }

    // Handle firing
    this.maybeFireBullet();

    var hitEntity = this.findHitEntity();
    if (hitEntity) 
    {
        if(Object.getPrototypeOf(hitEntity) === Citizen.prototype)
        {
            this.maybePickUpCitizen(hitEntity);
            spatialManager.register(this);
        }
        else if(Object.getPrototypeOf(hitEntity) === Plank.prototype && !(shipsRotation> 0.5*Math.PI))
        {
                if((this.cy + this.getRadius()) > (hitEntity.cy - hitEntity.halfHeight)
                    && (this.cy + this.getRadius()) < (hitEntity.cy + hitEntity.halfHeight))
                {
                    if(this.velY > 0) this.velY = 0;
                    if(this.velX !== 0) this.velX = 0;
                    this.landed = true;
                    this.adjustRotation(du);
                    this.fuel.level = 100;            
                }
                if((this.cy - this.getRadius()) > (hitEntity.cy - hitEntity.halfHeight)
                    && (this.cy - this.getRadius()) < (hitEntity.cy + hitEntity.halfHeight))
                {
                    this.velY = 0;
                    this.cy = hitEntity.cy + hitEntity.halfHeight + this.getRadius();
                }
               
            
                 spatialManager.register(this);
        }
        else if(Object.getPrototypeOf(hitEntity) === Package.prototype)
        {
            hitEntity.getPackage(this);
        }
        else
        {
            this.warp();
        }
        
    }
    else
    {
        spatialManager.register(this);
    }

    if(!this.landed)
    {
        this.leftRotation = 0;
        this.rightRotation = 0;
    }

    if(this.Citizen)
    {
        this.maybePickUpCitizen();
    }
    

};



var NOMINAL_THRUST = +0.2;

Ship.prototype.computeThrustMag = function () {
    
    var thrust = 0;
    
    if (keys[this.KEY_THRUST]) {
        thrust += NOMINAL_THRUST;
        //this.fuel.level -= 0.8;
		this.fuel.status -= 0.0005;
        particleManager.thrust(this.cx, this.cy, this.rotation, this.getRadius());
        this.landed = false;
    }
    
    return thrust;
};

Ship.prototype.maybeFireBullet = function () {

    if (keys[this.KEY_FIRE]) {
    
        var dX = +Math.sin(this.rotation);
        var dY = -Math.cos(this.rotation);
        var launchDist = this.getRadius() * 1.2;
        
        var relVel = this.launchVel;
        var relVelX = dX * relVel;
        var relVelY = dY * relVel;

        entityManager.fireBullet(
           this.cx + dX * launchDist, this.cy + dY * launchDist,
           this.velX + relVelX, this.velY + relVelY,
           this.rotation,
           1);
           
    }
    
};

Ship.prototype.giveFuel = function (fuel)
{
    this.fuel.level += fuel;
}

Ship.prototype.getRadius = function () {
	return ((this.sprite.width / 2) * 0.9)/2;
};

Ship.prototype.takeBulletHit = function () {
    particleManager.explosion(this.cx, this.cy);
    this.warp();
};

Ship.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.rotation = this.reset_rotation;
    
    this.halt();
};

Ship.prototype.halt = function () {
    this.velX = 0;
    this.velY = 0;
};

var NOMINAL_ROTATE_RATE_L = 0.01;
var NOMINAL_ROTATE_RATE_R = 0.01;

Ship.prototype.updateRotation = function (du) {
    if (keys[this.KEY_LEFT] && !this.landed) {
        this.rotation -= NOMINAL_ROTATE_RATE_L * du;
        NOMINAL_ROTATE_RATE_L += 0.001
    }
    else
    {
        NOMINAL_ROTATE_RATE_L = 0.01;
    }
    if (keys[this.KEY_RIGHT] && !this.landed) {
        this.rotation += NOMINAL_ROTATE_RATE_R * du;
        NOMINAL_ROTATE_RATE_R += 0.001
    }
    else
    {
        NOMINAL_ROTATE_RATE_R = 0.01;
    }
};

Ship.prototype.maybePickUpCitizen = function (Citizen) {
     if (eatKey(this.USE))
     {
        if(!this.Citizen) this.Citizen = Citizen.pickedUp();
        else this.Citizen = this.Citizen.pickedUp();
     }   
     


};

Ship.prototype.adjustRotation = function(du) {
    var shipsRotation = this.rotation % (2*Math.PI);
    if((shipsRotation < -0.02 && shipsRotation > -0.25*Math.PI)
        || (shipsRotation > 1.75*Math.PI && shipsRotation < 1.98*Math.PI))
    {
        this.rotation += this.rightRotation * du;
        this.cx += this.rightRotation * 25 * du;
        this.rightRotation += 0.001;

        
    }
    else if((shipsRotation < -1.75*Math.PI && shipsRotation > -1.98*Math.PI) ||
            (shipsRotation > 0.02 && shipsRotation < 0.25*Math.PI))
    {
        this.rotation -= this.leftRotation * du;
        this.cx -= this.leftRotation * 25 * du;
        this.leftRotation += 0.001;    
    }
    else if((shipsRotation > -0.5*Math.PI && shipsRotation < -0.25*Math.PI)
        || (shipsRotation < 1.75*Math.PI && shipsRotation > Math.PI))
    {
        this.rotation -= this.leftRotation * du;
        this.cx -= 25 * this.leftRotation * du;
        this.leftRotation += 0.001; 
    }
    else if((shipsRotation > -1.75*Math.PI && shipsRotation < -Math.PI) ||
            (shipsRotation < Math.PI && shipsRotation > 0.25*Math.PI))
    {
        this.rotation += this.rightRotation * du;
        this.cx += this.rightRotation * 25 * du;
        this.rightRotation += 0.001;  
    }
  

}


Ship.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this._scale;
    this.sprite.drawWrappedCentredAt(
    ctx, this.cx, this.cy, this.rotation
    );
    this.sprite.scale = origScale;
	
	this.fuel.render(ctx, this.cx, this.cy);
};