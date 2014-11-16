// ======
// BULLET
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Bullet(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    // Make a noise when I am created (i.e. fired)   
	//g_audio.bulletFire.Play();
	console.log("laser audio played");
	g_audio.laserCannon.Play();
	
/*
    // Diagnostics to check inheritance stuff
    this._bulletProperty = true;
    console.dir(this);
*/

}

Bullet.prototype = new Entity();

// HACKED-IN AUDIO (no preloading)
// Bullet.prototype.fireSound = new Audio(
    // "sounds/bulletFire.ogg");
// Bullet.prototype.zappedSound = new Audio(
    // "sounds/bulletZapped.ogg");
    
// Initial, inheritable, default values
Bullet.prototype.rotation = 0;
Bullet.prototype.cx = 200;
Bullet.prototype.cy = 200;
Bullet.prototype.velX = 1;
Bullet.prototype.velY = 1;
Bullet.prototype.team = 1;

// Convert times from milliseconds to "nominal" time units.
Bullet.prototype.lifeSpan = 3000 / NOMINAL_UPDATE_INTERVAL;

Bullet.prototype.update = function (du) {

    
    spatialManager.unregister(this);
    this.lifeSpan -= du;
    if (this.lifeSpan < 0)
    {

        return entityManager.KILL_ME_NOW;  
    } 

    this.cx += this.velX * du;
    this.cy += this.velY * du;

    this.rotation += 1 * du;
    this.rotation = util.wrapRange(this.rotation,
                                   0, consts.FULL_CIRCLE);


    this.wrapPosition();
    
    // TODO? NO, ACTUALLY, I JUST DID THIS BIT FOR YOU! :-)
    //
    // Handle collisions
    //
    var hitEntity = this.findHitEntity();
    if (hitEntity) {
        var canTakeHit = hitEntity.takeBulletHit;
        if (canTakeHit) canTakeHit.call(hitEntity); 
        return entityManager.KILL_ME_NOW;
    }
    var ground = spatialManager.collidesWithGround(this.cx, this.cy, this.getRadius())
    if (ground) {
        return entityManager.KILL_ME_NOW;
    }
    
    // TODO: YOUR STUFF HERE! --- (Re-)Register
    spatialManager.register(this);
};

Bullet.prototype.getRadius = function () {
    return 4;
};

Bullet.prototype.takeBulletHit = function () {
    this.kill();
    
    // Make a noise when I am zapped by another bullet
    g_audio.zappedSound.Play();
};

Bullet.prototype.render = function (ctx) {
    ctx.save();
    if(this.team === 1)
    {
        var fadeThresh = Bullet.prototype.lifeSpan / 3;

        if (this.lifeSpan < fadeThresh) {
            ctx.globalAlpha = this.lifeSpan / fadeThresh;
        }

        g_sprites.bullet.drawWrappedCentredAt(
            ctx, this.cx, this.cy, this.rotation
        );

        ctx.globalAlpha = 1;
    }
    else if(this.team === 2)
    {
        ctx.fillStyle = "blue";
        var radius = 4;
        ctx.fillRect(this.cx, this.cy, radius, radius);
        //ctx.arc(this.cx - radius, this.cy - radius, radius, 0, Math.PI * 2, true);
        ctx.fill();
    }
    ctx.restore();
    
};
