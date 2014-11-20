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

    //sprite SHIELDS
    this.spriteShieldGreen = g_sprites.shipShieldGreen;
    this.spriteShieldOrange = g_sprites.shipShieldOrange;
    this.spriteShieldRed = g_sprites.shipShieldRed;

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
Ship.prototype.shield = 0;
Ship.prototype.lives = 10;

Ship.prototype.cooldown = 200 / NOMINAL_UPDATE_INTERVAL;
Ship.prototype.restarting = 3000 / NOMINAL_UPDATE_INTERVAL;

//Mission variables?
Ship.prototype.landed = false;
Ship.prototype.Citizen = 0; 


//===========================================================================
//========================= Warping Functions ===============================
//===========================================================================
Ship.prototype.warp = function () {

//    this._isWarping = true;
//    this._scaleDirn = -0.5;
    this.lives -= 1;

    if(this.lives < 1)
    {
        g_gameOver = true;
        g_startGame = false;
        muteAll();
    }


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

    if(this.restarting < Ship.prototype.restarting)
    {
        this.restarting -= du;
        if(this.restarting < 0)
        {
            levelDesign.restart();
        } 
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
        else if(Object.getPrototypeOf(hitEntity) === Plank.prototype)
        {
            if(((this.rotation % (2*Math.PI) > -0.5*Math.PI)
                &&(this.rotation % (2*Math.PI) < 0.5*Math.PI )))
            {
                this.landingOnPlank(this.rotation % (2*Math.PI), hitEntity, du);
                
            }
            else
            {
                particleManager.explosion(this.cx, this.cy);
                this.warp(); 
            }
        } 
        else if(Object.getPrototypeOf(hitEntity) === Package.prototype)
        {
            hitEntity.getPackage(this);
        }
        else if(Object.getPrototypeOf(hitEntity) === Gun.prototype)
        {   
            particleManager.explosion(this.cx, this.cy);
            this.warp();    
        }
    }
    
        spatialManager.register(this);
    

   
   /*--------------------------------------------------------------------------------------------
                                    Required shipstatus checks
    ---------------------------------------------------------------------------------------------*/                      

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
        this.fuel.status -= 0.005;
        particleManager.thrust(this.cx, this.cy, this.rotation, this.getRadius());
        this.landed = false;
        g_audio.shipThrust.Play();
    }
    
    return thrust;
};
/*-----------------------------------------------------------------------------
  ----------------------------------------------------------------------------*/
Ship.prototype.informRestart = function (du)
{
    this.restarting -= du; 
}


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
    
    if(attackType === "Ship") this.shield -= 1;
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
            this.adjustRotation(du);
            this.fuel.status = 1;
            //this.keyReset();
        

        }
        else this.velX = -this.velX;

    }
    else if((this.cy + this.getRadius()) >  (hitEntity.cy - hitEntity.halfHeight))
    {
        particleManager.explosion(this.cx, this.cy);
        this.warp();
    }

    spatialManager.register(this);
};

/*-------------------------------------------------------------------------------------------------------
  ------------------------------------------------------------------------------------------------------*/

Ship.prototype.render = function (ctx) {
	
	this.fuel.render(ctx, this.cx, this.cy);
    var origScale = 0;
    if(this.shield > 0)
    {
        origScale = this.sprite.scale;
        // pass my scale into the sprite, for drawing
        this.sprite.scale = this._scale;
        
        if(this.shield === 3){
        this.spriteShieldGreen.drawWrappedCentredAt(
         ctx, this.cx, this.cy, this.rotation
         );
        }
        else if(this.shield === 2){
        this.spriteShieldOrange.drawWrappedCentredAt(
         ctx, this.cx, this.cy, this.rotation
         );
        }
        else if(this.shield === 1){
        this.spriteShieldRed.drawWrappedCentredAt(
         ctx, this.cx, this.cy, this.rotation
         );
        }

        this.sprite.scale = origScale;
    }
    
	origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this._scale;
    this.sprite.drawWrappedCentredAt(
    ctx, this.cx, this.cy, this.rotation
    );
    this.sprite.scale = origScale;

    if(this.restarting < Ship.prototype.restarting)
    {
        ctx.beginPath();
        ctx.font="15px Georgia";
        var restartTime = Math.floor(this.restarting / 10);
        ctx.fillText("A citizen died!",this.cx - 30, this.cy + this.getRadius() + 10);
        ctx.fillText("Warping back in time in " + restartTime,this.cx - 70, this.cy + this.getRadius() + 25 );

    }
    var xlives = 350;
    origScale = this.sprite.scale;
    this.sprite.scale = 0.15;
    for(var i = 0; i < this.lives; i++)
    {
        this.sprite.drawWrappedCentredAt(
        ctx, xlives, 25 - g_offsetY, 0
        );
        xlives += 10;
    }
    this.sprite.scale = origScale;
};