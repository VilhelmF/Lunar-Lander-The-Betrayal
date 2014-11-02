Particle.prototype.setup = function (descr) {

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

Particle.prototype.init = function(cx, cy) {
	this.cx = util.getRandomInt(cx - 10, cx + 10);
	this.cy = util.getRandomInt(cy - 10, cy + 10);

	this.xVel = util.getRandomInt(0, 10)
	this.xVel *= util.getRandomInt(0,1) === 0 ? 1 : -1;

	this.yVel = util.getRandomInt(0, 10);
	this.yVel *= util.getRandomInt(0, 1) === 0 ? 1 : -1;

	this.width = util.getRandomInt(1, 20);
	this.height = this.width;

	this.rotation = util.getRandomInt(0, 40) / 100;
}

Particle.prototype.update = function(du) {
	this.cx += this.velX * du;
    this.cy += this.velY * du;

    this.rotation += this.roation * du;
    this.rotation = util.wrapRange(this.rotation,
                                   0, consts.FULL_CIRCLE);
}

Particle.prototype.render = function(ctx) {
	util.fillBox(ctx, this.cx, this.cy, this.width, this.height, "red");
}