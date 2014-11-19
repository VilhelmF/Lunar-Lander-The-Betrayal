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
	
	// put gun particle in array for explosion
	this.towerParticles = [];
	
	//var limitOfImage = 
	/*var numOfTowerPart= 0;
	
	for(var i=0;i<g_sprites.length;i++){
		var tempString = 
		if(g_sprites[].indexOf("tower_p")){
			numOfTowerPart++;
	}*/
	
	for(var i=0; i<8; ++i){
		this.towerParticles[i] = g_sprites["tower_p_" + i];
		this.towerParticles[i] = new Particle();
	}
	
	
	this.tower = g_sprites.tower;
    this.diamond = g_sprites.diamond;
	
	this.towerHeight = this.tower.height;
	this.towerWidth = this.tower.width;
	
    // Set normal drawing scale, and warp state off
    this._scale = 0;

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

Gun.prototype.life = 2;

Gun.prototype.cooldownRange = {
	"min" : 4000,
	"max" : 8000,
}
Gun.prototype.origCooldown = util.getRandomInt(Gun.prototype.cooldownRange.min, Gun.prototype.cooldownRange.max) / NOMINAL_UPDATE_INTERVAL;
Gun.prototype.cooldown = this.origCooldown;


Gun.prototype.update = function (du) {

    spatialManager.unregister(this);
	
    if(this.cooldown <= 0)
    {
    	this.fireBullet();
    	this.cooldown = this.getCooldown();
    }

    this.cooldown -= du;

	
    if(this._isDeadNow)
    {
        return entityManager.KILL_ME_NOW;  
    }


    spatialManager.register(this);

};


Gun.prototype.takeBulletHit = function () {
    this.life -= 1;
	if(this.life === 0){
		//explosion
	}
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

	entityManager.fireBullet(this.cx, 
						     this.cy - this.halfHeight - 8,
						     velX, 
						     velY,
						   	 0,
						     2);
           
    
}


Gun.prototype.render = function (ctx) {
	ctx.save();
	
	this.tower.drawAt(	ctx, 
						this.cx-this.towerWidth/2, 
						this.cy-this.towerHeight+1);
	ctx.drawImage(
		this.diamond.image,
		0,
		0,
		this.diamond.width-(this.cooldown/3),
		this.diamond.height,
		
		this.cx-this.diamond.width/2,
		this.cy-this.diamond.height,
		
		this.diamond.width-(this.cooldown/3),
		this.diamond.height
	);
	
	ctx.restore();
};
