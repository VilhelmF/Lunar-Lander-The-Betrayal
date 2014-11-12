function Package(descr) {
	
	this.setup(descr);
	
	//this.rememberResets();
	
	this.packagePoint = g_sprites.kassi1;
	
	this.width  = this.packagePoint.width;
	this.height = this.packagePoint.height;
	this.radius = util.findRadius(this.width, this.height);
	
	
	this.createGroundarrayInfo();
	
	this.findGroundLengthBetween(0,1);
	
	// Find x-coordinate on flat-land
	this.cx = this.findSafePlace();
};


Package.prototype = new Entity();


Package.prototype.rotation = 0;


Package.prototype.velX = 0;
Package.prototype.velY = 0;

Package.prototype.width;
Package.prototype.height;

Package.prototype.boxStill = false;



Package.prototype .findGroundLengthBetween = function(index1, index2){
	
	var firstX = this.groundInfo[index1].getPos().posX
	var secondX= this.groundInfo[index2].getPos().posX
	
	this.groundLength = Math.abs(secondX - firstX);
};




// package gets all ground information into array.
Package.prototype .createGroundarrayInfo = function(index1, index2){
	this.groundInfo = [];
	this.groundInfo = util.getGroundSlopes();
};






Package.prototype.update = function(du) { 
	
	if( !this.boxStill ) {
		spatialManager.unregister(this);
		
		var groundHit = spatialManager.collidesWithGround(
													this.cx, 
													this.cy, 
													this.radius-8  //SKÍTA FIX
													);
		
		// package stop if groundHit is true
		// otherwise keep falling down
		if( groundHit ) {
			// 
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
	
	// find the shortest distence between randomX and 
	for(var r in this.groundInfo) {
		
		//if ground is flat then...
		if(this.groundInfo[r].getSlope() == 0) {
			
			leftLimit = this.groundInfo[r].getPos().posX;
			rightLimit = leftLimit+this.groundLength;
			
			tempDist = Math.abs(leftLimit - randomX);
			
			if(tempDist < nearestX){
			
				nearestX = tempDist;
				index = r;
			}		
		}
	}
	
	// if temprDist have been changes then...
	if(tempDist > -1)
	{
		var x = this.groundInfo[index].getPos().posX;
		
		// center of groundPaddle
		return x+(this.groundLength/2);
	}
	else
	{
		console.log("fail to find a flat land !");
	}
};	

