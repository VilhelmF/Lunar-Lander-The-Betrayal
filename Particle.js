function Particle(descr) {

    // Apply all setup properies from the (optional) descriptor
    for (var property in descr) {
        this[property] = descr[property];
    }    
};

Particle.prototype.sprite = "";
Particle.prototype.towerExp = false;
Particle.prototype.cx = 0;
Particle.prototype.cy = 0;
Particle.prototype.xVel = 0;
Particle.prototype.yVel = 0;
Particle.prototype.rotation = 0;
Particle.prototype.types = {
	"thrust" : {
		"lifeSpan" : 1500 / NOMINAL_UPDATE_INTERVAL,
	},

	"explosion" : {
		"lifeSpan" : 2000 / NOMINAL_UPDATE_INTERVAL,
	},

	"tower" : {
		"lifeSpan" : 2000 / NOMINAL_UPDATE_INTERVAL,
	}
},

Particle.prototype.type = "explosion";
Particle.prototype.offsetX = 0;


Particle.prototype.initExplosion = function(cx, cy, tower) {
	this.type = "explosion";

	this.lifeSpan = Particle.prototype.types.explosion.lifeSpan;
	
	this.cx = util.getRandomInt(cx - 10, cx + 10);
	this.cy = util.getRandomInt(cy - 10, cy + 10);

	this.xVel = util.getRandomInt(0, 10);
	this.xVel *= util.getRandomInt(0,1) === 0 ? 1 : -1;

	this.yVel = util.getRandomInt(0, 10);
	this.yVel *= util.getRandomInt(0, 1) === 0 ? 1 : -1;

	this.rotation = util.getRandomInt(0, 40) / 100;
	if(tower)
	{
		this.towerExp = true;
		this.radius = util.getRandomInt(5,15);
	}
	else
	{
		this.radius = util.getRandomInt(1, 30);
	}
	

	this.color = util.getRandomInt(0,1) === 0 ? "red" : 
				 util.getRandomInt(0,1) === 0 ? "orange" : 
				 util.getRandomInt(0,1) === 0 ? "yellow" : "gray";

};

Particle.prototype.initThrust = function(cx, cy, rotation, offsetX, i) {
	this.type = "thrust";

	this.lifeSpan = Particle.prototype.types.thrust.lifeSpan;

	this.cx = util.getRandomInt(cx - 10 + i*2, cx + 10 - i*2);
	this.cy = util.getRandomInt(cy, cy + 10 + i);

	this.rotation = util.wrapRange(rotation, 0, consts.FULL_CIRCLE)

	this.yVel = Math.cos(this.rotation);
	this.xVel = -Math.sin(this.rotation);

	this.offsetX = offsetX;

	this.radius = util.getRandomInt(1, 5);

	this.color = util.getRandomInt(0, 1) === 0 ? "red" : "orange";
};

Particle.prototype.initTower = function(cx, cy, xVel, yVel, sprite) {
	this.type = "tower";

	this.cx = cx;
	this.cy = cy;
	this.xVel = xVel;
	this.yVel = yVel;

	this.lifeSpan = Particle.prototype.types.explosion.lifeSpan;

	this.sprite = sprite;	
};

Particle.prototype.update = function(du) {

	this.lifeSpan -= du;

	if(this.lifeSpan <= 0  || this.cx > g_canvas.width || this.cx < 0) {
		return particleManager.KILL_ME_NOW;
	}

	if(this.type === "explosion" && !this.towerExp) {
		this.radius++;
	}

	this.cx += this.xVel * du;
    this.cy += this.yVel * du;
};

Particle.prototype.render = function(ctx) {
	ctx.save();

	var fadeThresh;

	switch(this.type) {
		case "thrust" : 
			fadeThresh = Particle.prototype.types.thrust.lifeSpan;
			break;
		case "explosion" :
			fadeThresh = Particle.prototype.types.explosion.lifeSpan;
			break;
		case "tower" :
			fadeThresh = Particle.prototype.types.tower.lifeSpan;
			break;
	}
	
    if (this.lifeSpan < fadeThresh) {
        ctx.globalAlpha = this.lifeSpan / fadeThresh;
    }
   
    if(this.sprite)
    {
    	this.sprite.drawWrappedCentredAt(
    	ctx, this.cx, this.cy, this.rotation
    	);
    } 
    else
    {
    	ctx.translate(this.cx, this.cy);
	    ctx.rotate(this.rotation);
		util.fillCircle(ctx, 0, this.offsetX, this.radius, this.color);
    }
    ctx.globalAlpha = 1;

	ctx.restore();
    
};