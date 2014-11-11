function Package(descr) {
	
	this.setup(descr);
	
	//this.rememberResets();
	
	this.packagePoint = g_sprites.kassi1;
	this.width  = this.packagePoint.width;
	this.height = this.packagePoint.height;
	this.radius = util.findRadius(this.width, this.height);
	console.log("radfsdadsfdsffdsdfsa: " + this.radius);
	//this.radius = 10;
	
};


Package.prototype = new Entity();

Package.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    //this.reset_rotation = this.rotation;
};



Package.prototype.velX = 0;
Package.prototype.velY = 0;

//Package.prototype.cx   = 100;
// Package.prototype.cy   = -30;

Package.prototype.width;
Package.prototype.height;

Package.prototype.boxStill = false;

Package.prototype.update = function(du) { 
	if( !this.boxStill /*|| this.cy <= 0*/) {
		
		spatialManager.unregister(this);
	
	
		var findHit = spatialManager.collidesWithGround(
													this.cx, 
													this.cy, 
													this.radius
													);
		console.log("findHit " + findHit);
	
	
		console.log( "this.cx: " + this.cx + " this.cy: " + this.cy );
	
		// console.log(this.packagePoint);
		if( findHit ) {
			this.velY = 0;
			this.boxStill  = true;
		} else {
			this.velY += 0.01;
			this.cy += this.velY * du;
			//spatialManager.register(this);
		}
		spatialManager.register(this);
	}
};


Package.prototype.render = function(ctx) { 
	this.packagePoint.drawAt(ctx, this.cx, this.cy);
};



Package.prototype.createRandomX = function(){
	var x = 0;
	
	for(var i=0; i<100; i++){
		x = util.getRandomInt(0,800);
		this.findPlaceOnLand(x);
	}
};
	
	


Package.prototype.findPlaceOnLand = function(randomX){
	
	var ground   = spatialManager._ground;
	var nearestX = Number.MAX_VALUE;
	var tempr    = 0;
	var tempDist = 0;
	
	console.log("ground[1].getSlope: " + ground[1].getSlope)
	console.log("spatialManager._ground " + spatialManager._ground)
	
	for(var r in ground) {
		
		if(ground[r].getSlope == 0){
			
			tempDist = Math.abs(nearestX - randomX);
			
			if(tempDist < nearestX){
			
				nearestX = tempDist; 
				tempr = r;
			}		
		}
	}
		
	
	return Mat.abs(ground[tempr].firstX - ground[tempr].latterX);
};














