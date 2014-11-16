// ============
// SPRITE STUFF
// ============

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// Construct a "sprite" from the given `image`,
//
function Sprite(image, name) {
    this.image = image;

    this.width = image.width;
    this.height = image.height;
    this.scale = 1;
	
	// FOR SPRITES SHEETS
	if(String(name).indexOf("Walk") > -1)
	{ 
		//for walking citizen
		this.tickCount = 0;
		this.ticksPerFrame = 10;
		this.frameIndex = 0;
		this.posX = 0;
		this.posY = 0;
	
		//i know every sprite sheet have 10 frames.
		this.numberOfFrames = 10;
		this.walk = false;
		
		var randomInt = util.getRandomInt(0,1);
		
		if(randomInt == 1){
			this.right = true;
			//this.left  = 
		}
		
		this.left = false;
		this.right = false;
		
		this.walkSteps = [];
		
	}
	else
	{
		// ...
	}
}



Sprite.prototype.drawAt = function (ctx, x, y) {
    ctx.drawImage(this.image, 
                  x, y);
};

Sprite.prototype.drawCentredAt = function (ctx, cx, cy, rotation) {
    if (rotation === undefined) rotation = 0;
    
    var w = this.width,
        h = this.height;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.scale(this.scale, this.scale);
    
    // drawImage expects "top-left" coords, so we offset our destination
    // coords accordingly, to draw our sprite centred at the origin
    ctx.drawImage(this.image, 
                  -w/2, -h/2);
    
    ctx.restore();
};  

Sprite.prototype.drawWrappedCentredAt = function (ctx, cx, cy, rotation) {
    
    // Get "screen width"
    var sw = g_canvas.width;
    
    // Draw primary instance
    this.drawWrappedVerticalCentredAt(ctx, cx, cy, rotation);
    
    // Left and Right wraps
    this.drawWrappedVerticalCentredAt(ctx, cx - sw, cy, rotation);
    this.drawWrappedVerticalCentredAt(ctx, cx + sw, cy, rotation);
};

Sprite.prototype.drawWrappedVerticalCentredAt = function (ctx, cx, cy, rotation) {

    // Get "screen height"
    var sh = g_canvas.height;
    
    // Draw primary instance
    this.drawCentredAt(ctx, cx, cy, rotation);
    
    // Top and Bottom wraps
    this.drawCentredAt(ctx, cx, cy - sh, rotation);
    this.drawCentredAt(ctx, cx, cy + sh, rotation);
};


// crop sprite on postion cx and cy
//(cx,cy)
//	|_____________________
//	|sprite | <- percent |
//	----------------------
//	|-------|
//		^
// 		scaleWidth
//		
Sprite.prototype.cropImageBy = function (ctx, cx, cy, percent) {
	var scaleWidth = this.width * percent;
	
	if(this.image == g_sprites.fuelBarSlide.image) {
		ctx.drawImage( this.image, cx, cy, this.width, this.height, cx, cy, scaleWidth, this.height ); 
	}
	else{
		ctx.drawImage( this.image, cx, cy, scaleWidth, this.height, cx, cy, scaleWidth, this.height);
	}
};





//Sprite.prototype.spriteSheetconstruction = function (ctx, sx) {



//Sprite.prototype.drawCropimage = function (ctx, sx) {
//	ctx.drawImage( this.image, cx, cy, this.width, this.height, cx, cy, scaleWidth, this.height ); 



Sprite.prototype.walkUpdate = function (Xstep) {
	//console.log("update");
	this.tickCount += 1;
		
    if (this.tickCount > this.ticksPerFrame) {
       
		this.tickCount = 0;
        	
		// If the current frame index is in range
		if (this.frameIndex < this.numberOfFrames - 1)
		{	
			// Go to the next frame
			this.frameIndex += 1;
			this.posX += Xstep;
		}
		else 
		{
			this.frameIndex = 0;
		}
    }	
}

Sprite.prototype.walkRender = function (ctx, posX, posY) {
	
	/*if(posX == "undefined"){
		this.posX = 0;
	}
	else{
		this.posX = posX;
	}*/
	
	//er ekki viss hvort að þetta þarf: (this.walk)
	
	
	
	if(!this.walk)
	{
		//console.log("render");
		ctx.drawImage(
			this.image,
			this.frameIndex * this.width/this.ticksPerFrame,
			0,
			this.width/this.numberOfFrames,
			this.height,
			this.posX,
			posY, 				// 450 for old man
			this.width/this.numberOfFrames,
			this.height
		);	
	}
};


