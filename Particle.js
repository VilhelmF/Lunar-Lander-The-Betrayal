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

Particle.prototype.initExplosion = function(cx, cy) {
	// console.log(cx + "    " + cy);
	// console.log(util.getRandomInt(cx - 10, cy + 10));
	this.cx = util.getRandomInt(cx - 10, cx + 10);
	this.cy = util.getRandomInt(cy - 10, cy + 10);

	// console.log(this.cx);

	this.xVel = util.getRandomInt(0, 10);
	this.xVel *= util.getRandomInt(0,1) === 0 ? 1 : -1;

	this.yVel = util.getRandomInt(0, 10);
	this.yVel *= util.getRandomInt(0, 1) === 0 ? 1 : -1;

	this.width = util.getRandomInt(1, 20);
	this.height = this.width;

	this.rotation = util.getRandomInt(0, 40) / 100;

	this.radius = 0;

	this.color = '#' + Math.floor(Math.random() * 16777215).toString(16);
};

Particle.prototype.initThrust = function(cx, cy, rotation, radius) {
	this.cx = util.getRandomInt(cx - 10, cx + 10);
	this.cy = util.getRandomInt(cy, cy + 10);

	this.rotation = util.wrapRange(rotation, 0, consts.FULL_CIRCLE)

	this.yVel = Math.cos(this.rotation);
	this.xVel = -Math.sin(this.rotation);

	this.width = util.getRandomInt(1, 5);
	this.height = this.width;

	this.radius = radius;

	this.color = util.getRandomInt(0,1) === 0 ? "red" : "orange";

	this.lifeSpan = 1500 / NOMINAL_UPDATE_INTERVAL;
};

Particle.prototype.update = function(du) {

	this.lifeSpan -= du;
	if(this.lifeSpan <= 0) {
		return particleManager.KILL_ME_NOW;
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

	util.fillBox(ctx, 0, this.radius, this.width, this.height, this.color);

	ctx.globalAlpha = 1;

	ctx.restore();
};