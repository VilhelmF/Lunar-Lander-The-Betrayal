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
Particle.prototype.types = {
	"thrust" : {
		"lifeSpan" : 1500 / NOMINAL_UPDATE_INTERVAL,
	},

	"explosion" : {
		"lifeSpan" : 2000 / NOMINAL_UPDATE_INTERVAL,
	}
},

Particle.prototype.type = "explosion";
Particle.prototype.offsetX = 0;


Particle.prototype.initTowerExplosion = function(cx, cy, index ) {
	this.type = "explosion";
	
	/*var angle = [];
	var rot = {begin: 2, end: 22};
	var rotationScale = 178;
	var rotation = 22;

	//angle get random number from 20 possibilities
	//angle : |2..22|23...55|....
	for (var i = 0; rot.end < rotationScale; i++) {
		if(index == i){
			angle[i] = util.getRandomInt(rot.begin,rot.end);
			rot.begin 	+= 22;
			rot.end		+= 22;

			console.log("Particle, testa angle[i]: "  + angle[i]);
		}
	};*/

	//this.rotation = angle[index];

	this.cx = cx;
	this.cy = cy;


	this.rotation = util.getRandomInt(0, 40) / 100;

	if(index === 0){
		this.xVel = 3
		this.yVel = -1;
	}
	if(index === 1){
		this.xVel = 2
		this.yVel = -2;
	}
	if(index === 2){
		this.xVel = 1
		this.yVel = -3;
	}	
	if(index === 3){
		this.xVel = -1;
		this.yVel = -3;
	}
	if(index === 4){
		this.xVel = -1
		this.yVel = -3;
	}
	if(index === 5){
		this.xVel = -2;
		this.yVel = -2;
	}
	if(index === 6){
		this.xVel = -3
		this.yVel = -1;
	}
	if(index === 7){
		this.xVel = -3
		this.yVel = -1;
	}


/*
	this.xVel = util.getRandomInt(0, 10);
	this.xVel *= util.getRandomInt(0,1) === 0 ? 1 : -1;

	this.yVel = util.getRandomInt(0, 10);
	this.yVel *= util.getRandomInt(0, 1) === 0 ? 1 : -1;*/
};

Particle.prototype.initExplosion = function(cx, cy) {
	this.type = "explosion";

	this.lifeSpan = Particle.prototype.types.explosion.lifeSpan;
	
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

	this.lifeSpan = Particle.prototype.types.thrust.lifeSpan;

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

	var fadeThresh;

	switch(this.type) {
		case "thrust" : 
			fadeThresh = Particle.prototype.types.thrust.lifeSpan;
			break;
		case "explosion" :
			fadeThresh = Particle.prototype.types.explosion.lifeSpan;
			break; 
	}

    if (this.lifeSpan < fadeThresh) {
        ctx.globalAlpha = this.lifeSpan / fadeThresh;
    }

    ctx.translate(this.cx, this.cy);
    ctx.rotate(this.rotation);

/*    if(this.color != "yellow" && this.color != "red" && this.color != "orange" && this.color != "gray") {
    	console.log(this.color);
    }*/
//	util.fillBox(ctx, 0, this.radius, this.width, this.height, this.color);
	util.fillCircle(ctx, 0, this.offsetX, this.radius, this.color);

	ctx.globalAlpha = 1;

	ctx.restore();
};