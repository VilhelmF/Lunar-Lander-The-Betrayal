function Package(descr) {
	
	this.setup(descr);
		
	this.packagePoint = g_sprites.fuelPackage;
	
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
Package.prototype.destroy = false;

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

	spatialManager.unregister(this);

	if(this._isDeadNow) return entityManager.KILL_ME_NOW;
	
	var groundHit = spatialManager.collidesWithGround(
												this.cx, 
												this.cy, 
												this.radius-4  //SKÍTA FIX
												);
	
	// package stop if groundHit is true
	// otherwise keep falling down
	if( groundHit ) {
		this.velY = 0;
		this.boxStill  = true;
	} else {
		this.rotation += 0.09;
		this.velY += 0.01;
		this.cy += this.velY * du;
	}
	
	spatialManager.register(this);
};

Package.prototype.getPackage = function(Player)
{
	g_audio.getBox.playSound();

	this.kill();
	
	Player.giveFuel(0.25);
	Player.addShield(3);
}

Package.prototype.takeBulletHit = function(attackType)
{
	this.kill();
}


Package.prototype.findSafePlace = function(){
	var randX = util.getRandomInt(0,800);
	return this.findPlaceOnLand(randX);
};

Package.prototype.getRadius = function () {
    return this.radius;
};


Package.prototype.findPlaceOnLand = function(randomX){
	
	var nearestX = Number.MAX_VALUE;
	var index   = 0;
	var tempDist = -1;
	
	
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
};	

Package.prototype.render = function(ctx) { 
	this.packagePoint.drawCentredAt(ctx, 
									this.cx, 
									this.cy, 
									this.rotation);
};
