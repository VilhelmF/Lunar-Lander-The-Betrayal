function Package(descr) {
	
	this.setup(descr);
	
	//this.rememberResets();
	
	this.packagePoint = g_sprites.kassi1;
	
	this.width  = this.packagePoint.width;
	this.height = this.packagePoint.height;
	this.radius = util.findRadius(this.width, this.height);
	
	this.slopes = [];
	
	this.slopes = util.getGroundSlopes();
	
	this.cx = this.findSafePlace();
};


Package.prototype = new Entity();


Package.prototype.packageSlope = 0;

Package.prototype.velX = 0;
Package.prototype.velY = 0;

//Package.prototype.cx   = 100;
// Package.prototype.cy   = -30;

Package.prototype.width;
Package.prototype.height;

Package.prototype.boxStill = false;

Package.prototype.update = function(du) { 
	if( !this.boxStill ) {
		
		spatialManager.unregister(this);
		
	
		var findHit = spatialManager.collidesWithGround(
													this.cx, 
													this.cy, 
					/*SKÍTA FISS +5*/				this.radius
													);
	
		if( findHit ) {
			this.velY = 0;
			this.boxStill  = true;
			
		} else {
			this.velY += 0.01;
			this.cy += this.velY * du;
		}
		spatialManager.register(this);
	}
};


Package.prototype.render = function(ctx) { 
	this.packagePoint.drawCentredAt(ctx, 
									this.cx, 
									this.cy, 
									this.packageSlope);
};


Package.prototype.findSafePlace = function(){
	
	var randX = util.getRandomInt(0,800);
	console.log("randX: " + randX);
	return this.findPlaceOnLand(randX);
};




Package.prototype.findPlaceOnLand = function(randomX){
	
	//var slope = entityManager._ground;
	
	console.log("this.slopes: " + this.slopes);
	
	var nearestX = Number.MAX_VALUE;
	var storer   = 0;
	var tempDist = -1;
	var tempX    = 0;
	
	
	for(var r in this.slopes) {
		
		//if ground is flat then...
		if(this.slopes[r].getSlope() == 0) {
			
			tempX = this.slopes[r].getPos().posX;
			tempDist = Math.abs(tempX - randomX);
			
			if(tempDist < nearestX){
			
				nearestX = tempDist;
				storer = r;
			}		
		}
	}
	
	
//	for(var i=0; i<this.slopes.length; i++){
//		console.log("this.slopes[" + i + "].getSlope(); " + this.slopes[i].getSlope());
//	};
	
	// if temprDist have been changes
	if(tempDist > -1)
	{
		var x = this.slopes[storer].getPos().posX;
		
		if(this.cx+(this.width) > x+groundLength){
			this.packageSlope = this.slopes[++storer].getSlope();
		}
		
		return util.getRandomInt(x, x+groundLength);
	}
	else
	{
		console.log("fail to find flat land !");
	}
};














