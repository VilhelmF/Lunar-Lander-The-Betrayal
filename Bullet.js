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

	g_audio.laserCannon.Play();
	
/*
    // Diagnostics to check inheritance stuff
    this._bulletProperty = true;
    console.dir(this);
*/
}

Bullet.prototype = new Entity();
    
// Initial, inheritable, default values
Bullet.prototype.rotation = 0;
Bullet.prototype.cx = 200;
Bullet.prototype.cy = 200;
Bullet.prototype.velX = 1;
Bullet.prototype.velY = 1;
Bullet.prototype.team = 1;
Bullet.prototype.type = "Confusion";
Bullet.prototype.owner = "";

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

    this.rotation += 1;
    this.rotation = util.wrapRange(this.rotation,
                                   0, consts.FULL_CIRCLE);

    /*---------------------------------------------------------
                        Collision Handling
    -----------------------------------------------------------*/
    var hitEntity = this.findHitEntity();
    if (hitEntity) {

        var canTakeHit = hitEntity.takeBulletHit(this.type, this.owner);
        if (canTakeHit) canTakeHit.call(hitEntity); 
        return entityManager.KILL_ME_NOW;
    }
    var ground = spatialManager.collidesWithGround(this.cx, this.cy, this.getRadius())
    if (ground) {
        return entityManager.KILL_ME_NOW;
    }
    
    spatialManager.register(this);
};

Bullet.prototype.getRadius = function () {
    return 4;
};

Bullet.prototype.takeBulletHit = function (attackType) {
    this.kill();
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
        if(this.type === "Destroy")
        {
            var radius = 4;
            util.fillBox(ctx, this.cx, this.cy, radius, radius, "blue");
            ctx.fill();
        }
        else if(this.type === "Confuse")
        {
            var radius = 4;
            util.fillBox(ctx, this.cx, this.cy, radius, radius, "red");
            ctx.fill();
        }
        
    }
    ctx.restore();
    
};