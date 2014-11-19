function Particle(descr) {

    // Apply all setup properies from the (optional) descriptor
    for (var property in descr) {
        this[property] = descr[property];
    }    
};

Particle.prototype.cx = 0;
Particle.prototype.cy = 0;
Particle.prototype.xVel = 0;
Particle.prototype.yVel = 0;
Particle.prototype.rotation = 0;
Particle.prototype.lifeSpan = 2000 / NOMINAL_UPDATE_INTERVAL;
Particle.prototype.type = "explosion";
Particle.prototype.offsetX = 0;

Particle.prototype.initExplosion = function(cx, cy) {
	this.type = "explosion";
	
	this.cx = util.getRandomInt(cx - 10, cx + 10);
	this.cy = util.getRandomInt(cy - 10, cy + 10);

	this.xVel = util.getRandomInt(0, 10);
	this.xVel *= util.getRandomInt(0,1) === 0 ? 1 : -1;

	this.yVel = util.getRandomInt(0, 10);
	this.yVel *= util.getRandomInt(0, 1) === 0 ? 1 : -1;

/*	this.width = util.getRandomInt(1, 30);
	this.height = this.width; */

	this.rotation = util.getRandomInt(0, 40) / 100;

	this.radius = util.getRandomInt(1, 30);

	this.color = util.getRandomInt(0,1) === 0 ? "red" : 
				 util.getRandomInt(0,1) === 0 ? "orange" : 
				 util.getRandomInt(0,1) === 0 ? "yellow" : "gray";
};

Particle.prototype.initThrust = function(cx, cy, rotation, offsetX, i) {
	this.type = "thrust";

	this.cx = util.getRandomInt(cx - 10 + i*2, cx + 10 - i*2);
	this.cy = util.getRandomInt(cy, cy + 10 + i);

	this.rotation = util.wrapRange(rotation, 0, consts.FULL_CIRCLE)

	this.yVel = Math.cos(this.rotation);
	this.xVel = -Math.sin(this.rotation);

/*	this.width = util.getRandomInt(1, 5);
	this.height = this.width; */

	this.offsetX = offsetX;

	this.radius = util.getRandomInt(1, 5);

	this.color = util.getRandomInt(0, 1) === 0 ? "red" : "orange";

	this.lifeSpan = 1500 / NOMINAL_UPDATE_INTERVAL;
};

Particle.prototype.update = function(du) {

	this.lifeSpan -= du;
	if(this.lifeSpan <= 0) {
		return particleManager.KILL_ME_NOW;
	}

	if(this.type === "explosion") {
		this.radius++;
	}

	this.cx += this.xVel * du;
    this.cy += this.yVel * du;
};

Particle.prototype.render = function(ctx) {
	ctx.save();

	var fadeThresh = Particle.prototype.lifeSpan;

    if (this.lifeSpan < fadeThresh) {
        ctx.globalAlpha = this.lifeSpan / fadeThresh;
    }

    ctx.translate(this.cx, this.cy);
    ctx.rotate(this.rotation);

    if(this.color != "yellow" && this.color != "red" && this.color != "orange" && this.color != "gray") {
    	console.log(this.color);
    }
//	util.fillBox(ctx, 0, this.radius, this.width, this.height, this.color);
	util.fillCircle(ctx, 0, this.offsetX, this.radius, this.color);

	ctx.globalAlpha = 1;

	ctx.restore();
};