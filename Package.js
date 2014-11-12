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
Package.prototype.rotation = 0;


Package.prototype.velX = 0;
Package.prototype.velY = 0;

Package.prototype.width;
Package.prototype.height;

Package.prototype.boxStill = false;

Package.prototype.update = function(du) { 
	if( !this.boxStill ) {
		
		spatialManager.unregister(this);
		
	
		var groundHit = spatialManager.collidesWithGround(
													this.cx, 
													this.cy, 
													this.radius-8  //SKÍTA FIX
													);
		
		
		if( groundHit ) {
		
			//var ground = this.slopes[groundHit.index];
			//var x1 = groundHit.latterx;

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
									this.rotation);
};


Package.prototype.findSafePlace = function(){
	
	var randX = util.getRandomInt(0,800);
	return this.findPlaceOnLand(randX);
};




Package.prototype.findPlaceOnLand = function(randomX){
	
	
	var nearestX = Number.MAX_VALUE;
	var index   = 0;
	var tempDist = -1;
	var tempX    = 0;
	
	var leftLimit = 0;
	var rightLimit = 0;
	
	
	for(var r in this.slopes) {
		
		//if ground is flat then...
		if(this.slopes[r].getSlope() == 0) {
			
			leftLimit = this.slopes[r].getPos().posX;
			rightLimit = leftLimit+groundLength;
			
			tempDist = Math.abs(leftLimit - randomX);
			//if(leftLimit)
			if(tempDist < nearestX ){
			
				nearestX = tempDist;
				index = r;
			}		
		}
	}
	
	// if temprDist have been changes
	if(tempDist > -1)
	{
		var x = this.slopes[index].getPos().posX;
		var randX = util.getRandomInt(x, x+groundLength);
		
		
		//this.givePackageSlope(x, index, randX);
	
		return randX;
	}
	else
	{
		console.log("fail to find flat land !");
	}
};	

