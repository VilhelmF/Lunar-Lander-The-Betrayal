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
    this.arrowSprite = g_sprites.arrow;

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

    this.reset_KEY_THRUST = this.KEY_THRUST;
    this.reset_KEY_RETRO = this.KEY_RETRO;
    this.reset_KEY_LEFT = this.KEY_LEFT;
    this.reset_KEY_RIGHT = this.KEY_RIGHT;
};

Ship.prototype.KEY_THRUST = 'W'.charCodeAt(0);
Ship.prototype.KEY_RETRO  = 'S'.charCodeAt(0);
Ship.prototype.KEY_LEFT   = 'A'.charCodeAt(0);
Ship.prototype.KEY_RIGHT  = 'D'.charCodeAt(0);



Ship.prototype.USE      = ' '.charCodeAt(0);
Ship.prototype.KEY_FIRE = 'E'.charCodeAt(0);

// Initial, inheritable, default values
Ship.prototype.rotation = 0;
Ship.prototype.cx = 200;
Ship.prototype.cy = 200;
Ship.prototype.velX = 0;
Ship.prototype.velY = 0;
Ship.prototype.launchVel = 0;
Ship.prototype.numSubSteps = 1;
Ship.prototype.minY = -540;

Ship.prototype.rightRotation = 0.01;
Ship.prototype.leftRotation = 0.01;

Ship.prototype.fuel = new Fuel();
Ship.prototype.shield = 3;

Ship.prototype.cooldown = 200 / NOMINAL_UPDATE_INTERVAL;

//Mission variables?
Ship.prototype.landed = false;
Ship.prototype.Citizen = 0; 


//===========================================================================
//========================= Warping Functions ===============================
//===========================================================================
Ship.prototype.warp = function () {

//    this._isWarping = true;
//    this._scaleDirn = -0.5;

    if(this.Citizen)
    {
        this.Citizen.reset();
        this.Citizen = 0;
    }

    this.keyReset();
    this.warpToPlank();
	
	//ÞESSI ER EITTHVAÐ AÐ KLIKKA!!
	// shipWarping death sound played
	g_audio.shipWarp.Play();				
	
	
    
    // Unregister me from my old posistion
    // ...so that I can't be collided with while warping
//    spatialManager.unregister(this);
};

Ship.prototype._updateWarp = function (du) {

    var SHRINK_RATE = 3 / SECS_TO_NOMINALS;
    this._scale += this._scaleDirn * SHRINK_RATE * du;
    
    if (this._scale < 0.2) {
    
        //this._moveToASafePlace();
        this.cx = this.reset_cx;    
        this.cy = this.reset_cy; 
        NOMINAL_ROTATE_RATE_L = 0.01;
        NOMINAL_ROTATE_RATE_R = 0.01;   

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

    if(this.cooldown > 0) {
        this.cooldown -= du;
        return;
    }

    // Handle warping
    if (this._isWarping) {
        this._updateWarp(du);
        return;
    }
    
    spatialManager.unregister(this);

    // Perform movement substeps
    var steps = this.numSubSteps;
    var dStep = du / steps;
    for (var i = 0; i < steps; ++i) {
        var origX = this.cx;
        var origY = this.cy;

        this.computeSubStep(dStep);

        if(!this.isOnScreenWidth()) {
            this.cx = origX;
            this.velX = 0;
        }

        if(this.cy < this.minY + this.getRadius()) {
            this.cy = this.minY + this.getRadius();
            this.velY = 0;
        }
    }

    /*-------------------------------------------------------------------------------------------
                                    Offset the screen 
    ---------------------------------------------------------------------------------------------*/
    if(this.cy <= g_offsetY + 60) {
        g_offsetY = -this.cy + 60;
    }
    else {
        g_offsetY = 0;
    }

    if(g_offsetY > -this.minY){
        g_offsetY = -this.minY;
    }


    /*-------------------------------------------------------------------------------------------
                                    The Ship's Landing Detection
    ---------------------------------------------------------------------------------------------*/
    
    var ground = spatialManager.collidesWithGround(this.cx, this.cy, this.getRadius());

    if(typeof ground !== 'undefined')
    {
        console.log(ground);
        this.landingOnGround(this.rotation % (2*Math.PI), ground, du);
    }

    /*-------------------------------------------------------------------------------------------
                                    The Ship's hitentity checks
    ---------------------------------------------------------------------------------------------*/

    var hitEntity = this.findHitEntity();
    if (hitEntity) 
    {	
		if(Object.getPrototypeOf(hitEntity) === Citizen.prototype)
        {
            this.maybePickUpCitizen(hitEntity);
            spatialManager.register(this);
        }
        else if(Object.getPrototypeOf(hitEntity) === Plank.prototype && !(Math.abs(this.rotation % (2*Math.PI)) > 0.5*Math.PI))
        {
            this.landingOnPlank(this.rotation % (2*Math.PI), hitEntity, du);
                
        }
        else if(Object.getPrototypeOf(hitEntity) === Package.prototype)
        {
            hitEntity.getPackage(this);
        }
        else if(Object.getPrototypeOf(hitEntity) !== Bullet.prototype)
        {   
                particleManager.explosion(this.cx, this.cy);
                console.log(hitEntity);
                this.warp();    
        }
    }
    else
    {
        spatialManager.register(this);
    }

   
   /*--------------------------------------------------------------------------------------------
                                    Required shipstatus checks
    ---------------------------------------------------------------------------------------------*/                      
    this.maybeFireBullet();

    if(this.fuel.status <= 0) 
    {
        particleManager.explosion(this.cx, this.cy);
        this.fuel.status = 1;
        
        this.warp();
    }
    if(this.velY < 0)
    {
        this.landed = false;
    }
    if(this._isDeadNow)
    {
        return entityManager.KILL_ME_NOW;  
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

/*-----------------------------------------------------------------------------------
                        Player input functions
------------------------------------------------------------------------------------*/                        

Ship.prototype.maybePickUpCitizen = function (Citizen) {
     if (eatKey(this.USE))
     {
        if(!this.Citizen) this.Citizen = Citizen.pickedUp();
        else this.Citizen = this.Citizen.pickedUp();
     }   
};

var NOMINAL_THRUST = +0.2;

Ship.prototype.computeThrustMag = function () {
    
    var thrust = 0;
    
    if (keys[this.KEY_THRUST]) {
        thrust += NOMINAL_THRUST;
        this.fuel.status -= 0.0001;
        particleManager.thrust(this.cx, this.cy, this.rotation, this.getRadius());
        this.landed = false;
    }
    
    return thrust;
};
/*-----------------------------------------------------------------------------
  ----------------------------------------------------------------------------*/

Ship.prototype.giveFuel = function (fuel)
{
    this.fuel.status += fuel;
    if(this.fuel.status > 1)
    {
        this.fuel.status = 1;
    }
};

Ship.prototype.addShield = function(shield)
{
    this.shield += shield;
    if(this.shield > 3)
    {
        this.shield = 3;
    }
};

Ship.prototype.getRadius = function () {
	return ((this.sprite.width / 2) * 0.9)/2;
};

Ship.prototype.takeBulletHit = function (attackType) {
        if(attackType = "Ship") this.shield -= 1;
        else if (this.shield > 0) this.shield -= 1;
        else if(attackType === "Confuse")
        {
            this.KEY_THRUST = this.reset_KEY_RETRO;
            this.KEY_RETRO = this.reset_KEY_THRUST;
            this.KEY_LEFT = this.reset_KEY_RIGHT;
            this.KEY_RIGHT = this.reset_KEY_LEFT;
        }
        else if(attackType === "Destroy")
        {
            particleManager.explosion(this.cx, this.cy);
            this.warp();
        }   
};

Ship.prototype.maybeFireBullet = function () {

    if (eatKey(this.KEY_FIRE)) {
    
        var dX = +Math.sin(this.rotation);
        var dY = -Math.cos(this.rotation);
        var launchDist = this.getRadius() * 1.2;
        
        var relVel = this.launchVel;
        var relVelX = dX * relVel;
        var relVelY = 1;

        entityManager.fireBullet(
           this.cx + dX * launchDist, this.cy + launchDist,
           this.velX + relVelX, relVelY,
           this.rotation,
           1,
           "Ship");
           
    }    
};

Ship.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.rotation = this.reset_rotation;
    console.log("Used it");
    this.keyReset();
    this.halt();
};

Ship.prototype.keyReset = function () {
    this.KEY_THRUST = this.reset_KEY_THRUST;
    this.KEY_RETRO = this.reset_KEY_RETRO;
    this.KEY_LEFT = this.reset_KEY_LEFT;
    this.KEY_RIGHT = this.reset_KEY_RIGHT;
}


Ship.prototype.halt = function () {
    this.velX = 0;
    this.velY = 0;
};

Ship.prototype.setPos = function(cx, cy) {
    this.cx = cx;
    this.cy = cy;
}

Ship.prototype.warpToPlank = function() {
    this.cooldown = Ship.prototype.cooldown;
    this.rotation = 0;
    this.velX = 0;
    this.velY = 0;

    var pos = entityManager.getPlankPos();
    this.cx = pos.posX;
    this.cy = pos.posY - this.getRadius() - 20;
};

Ship.prototype.isOnScreenWidth = function() {
    var offset = 2;
    return !(this.cx - this.getRadius() - offset < 0 ||
             this.cx + this.getRadius() + offset > g_canvas.width);
};

Ship.prototype.isOnScreenHeight = function() {
    return !(this.cy < 0 ||
             this.cy > g_canvas.height);
};


/*---------------------------------------------------------------------------------------
                        Functions handling ship's rotation
-----------------------------------------------------------------------------------------*/                        

var NOMINAL_ROTATE_RATE_L = 0.01;
var NOMINAL_ROTATE_RATE_R = 0.01;

Ship.prototype.updateRotation = function (du) {
    if (keys[this.KEY_LEFT]) 
    {
        if(!this.landed)
        {
            this.rotation -= NOMINAL_ROTATE_RATE_L * du;
            NOMINAL_ROTATE_RATE_L += 0.001;    
        }
        else this.landed = false;
    }
    else
    {
        NOMINAL_ROTATE_RATE_L = 0.01;
    }
    if (keys[this.KEY_RIGHT]) 
    {   
        if(!this.landed)
        {
            this.rotation += NOMINAL_ROTATE_RATE_R * du;
            NOMINAL_ROTATE_RATE_R += 0.001;    
        }
        else this.landed = false;
    }
    else
    {
        NOMINAL_ROTATE_RATE_R = 0.01;
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
};

Ship.prototype.rotationalLanding = function (shipsRotation, groundRotation)
{
    if(groundRotation === 0 && Math.abs(shipsRotation) > 0.5*Math.PI) return true; 
    if(groundRotation > 0 && !(shipsRotation < (groundRotation * 1.05) && (shipsRotation > (groundRotation * 0.95)))) return true;
    if(groundRotation < 0 && !(shipsRotation > (groundRotation * 1.05) && (shipsRotation < (groundRotation * 0.95)))) return true;
    
    /*    if((shipsRotation < (groundRotation * 1.1)) && (shipsRotation > (groundRotation * 0.9)))
        {
            return false
        }

        if((shipsRotation < (groundRotation * 1.1)) && (shipsRotation > (groundRotation * 0.9)))
        {
            var x1 = shipsRotation < (groundRotation * 1.1);
            var x2 = shipsRotation > (groundRotation * 0.9);
            console.log(x1);
            console.log(x2)
            return false;
        }
        else
        {
             var x1 = shipsRotation < (groundRotation * 1.1);
            var x2 = shipsRotation > (groundRotation * 0.9);
            console.log(x1);
            console.log(x2)
            console.log("búmm");
            console.log(shipsRotation);
            console.log(groundRotation);
            console.log(groundRotation * 1.1);
            console.log(groundRotation * 0.9);
            

            return true;
        }
       
    } */  
    return false;
};

/*---------------------------------------------------------------------------------------
                                    Landing functions
----------------------------------------------------------------------------------------*/
Ship.prototype.landingOnGround = function(shipsRotation, ground, du)
{
    if(this.velY > 2 || Math.abs(this.velX) > 3 || this.rotationalLanding(shipsRotation, ground.rotation))
    {
        particleManager.explosion(this.cx, this.cy);
        entityManager.shakeGround(this.velX, this.velY);
        this.warp();
    }
    else
    {   
        if(this.velY > 0) this.velY = 0;
        if(this.velX !== 0) this.velX = 0;
        this.landed = true;
                
        if(ground.rotation === 0) this.adjustRotation(du);
    }  
};

Ship.prototype.landingOnPlank = function(shipsRotation, hitEntity, du)
{    
    if(Math.abs(this.velY) > 2 ||  Math.abs(this.velX) > 2) 
    {
        particleManager.explosion(this.cx, this.cy);
        this.warp();   
    }
    else if((this.cy + this.getRadius()) >= (hitEntity.cy - hitEntity.halfHeight)
        && (this.cy + this.getRadius()) <= (hitEntity.cy + hitEntity.halfHeight))
    {
        if(this.cx < hitEntity.cx + hitEntity.radius && this.cx > hitEntity.cx - hitEntity.radius)
        {
            if(this.velY > 0) this.velY = 0;
            if(this.velX !== 0) this.velX = 0;
            this.landed = true;
        //  this.cy = hitEntity.cy - hitEntity.halfHeight - this.getRadius();   
            this.adjustRotation(du);
            this.fuel.status = 1;
            this.keyReset();
        
        }
        else this.velX = -this.velX;

    }
    else if((this.cy + this.getRadius()) >  (hitEntity.cy - hitEntity.halfHeight))
    {
        particleManager.explosion(this.cx, this.cy);
        this.warp();
    }
    /*else if((this.cy - this.getRadius()) >= (hitEntity.cy - hitEntity.halfHeight)
        && (this.cy - this.getRadius()) <= (hitEntity.cy + hitEntity.halfHeight))
    {
        this.velY = -this.velY;
    }
    else if(hitEntity.cx - hitEntity.radius > this.cx + this.getRadius() || hitEntity.cx + hitEntity.radius < this.cx - this.getRadius())
    {
        this.velX = -this.velX;
    }               
      */          
    spatialManager.register(this);
};

/*-------------------------------------------------------------------------------------------------------
  ------------------------------------------------------------------------------------------------------*/

Ship.prototype.render = function (ctx) {
	
	this.fuel.render(ctx, this.cx, this.cy);
    if(this.shield > 0)
    {
        ctx.beginPath();
        ctx.arc(this.cx, this.cy, this.getRadius() + 3, 0, 2*Math.PI);
        if(this.shield === 3) ctx.strokeStyle = "green";
        else if(this.shield === 2) ctx.strokeStyle = "orange";
        else if(this.shield === 1) ctx.strokeStyle = "red";

        ctx.lineWidth = 3;
        ctx.stroke();
    }
    

    
	
	var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this._scale;
    this.sprite.drawWrappedCentredAt(
    ctx, this.cx, this.cy, this.rotation
    );
    this.sprite.scale = origScale;
	
/*    if(!this.isOnScreenHeight()) {
        ctx.save();
//        ctx.translate(this.cx - 15, 30);
//        ctx.rotate(this.rotation);
//        util.fillBox(ctx, 0, 0, 30, 30, "blue");
        this.arrowSprite.drawWrappedCentredAt(ctx, this.cx, 30, this.rotation);
        ctx.fillStyle = "blue";
        ctx.textAlign = "center";
        ctx.font = "bold 11px Arial";
        ctx.fillText(-this.cy.toFixed(0) + " m", this.cx, 70);    
        ctx.restore();
    } */

    //render fuel
    //util.fillBox(ctx, this.fuel.cx, this.fuel.cy, this.fuel.level, this.fuel.height, this.fuel.color);


};