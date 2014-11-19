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
		this.spriteSheetconstruction();
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
//    this.drawCentredAt(ctx, cx, cy - sh, rotation);
//    this.drawCentredAt(ctx, cx, cy + sh, rotation);

    this.drawCentredAt(ctx, cx, cy, rotation);
    this.drawCentredAt(ctx, cx, cy, rotation);
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





Sprite.prototype.spriteSheetconstruction = function () {
		//for walking citizen
		this.tickCount = 0;
		this.ticksPerFrame = 10;
		this.frameIndex = 0;
		this.posX = 0;
		this.posY = 0;

		this.midPointX = (this.width/this.ticksPerFrame) / 2;
		this.midPointY = {y1: this.height/3, y2: this.height/1.19}; 
	
		//i know every sprite sheetp have 10 frames. not cool i know
		this.numberOfFrames = 10;
		//this.walk = false;
		
		//ÓNOTAÐ
		this.walkSteps = [];
};



//Sprite.prototype.drawCropimage = function (ctx, sx) {
//	ctx.drawImage( this.image, cx, cy, this.width, this.height, cx, cy, scaleWidth, this.height ); 



Sprite.prototype.walkUpdate = function (Xstep) {
	
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

Sprite.prototype.walkRender = function (ctx, posX, posY, direction) {
	/*if(posX == "undefined"){
		this.posX = 0;
	}*/
	
	//	if direction is to right, direction
	//	get value true otherwise false
	if(String(direction).indexOf("right") === 0)
	{
		direction = true;
	}
	else if (String(direction).indexOf("left") === 0)
	{
		direction = false;
	}
	
	//FOR THE STARTSCREEN (oldman walking to the right)
	if(!g_startGame){
		ctx.drawImage(
					this.image,
					this.frameIndex * this.width/this.ticksPerFrame	,
					0,
					this.width/this.numberOfFrames,
					this.height/2,
					this.posX,
					450, // 450 for right height position on screen
					this.width/this.numberOfFrames,
					this.height/2
				);
		return;
	}
	
	
	//RIGHT
	if(direction)
	{
		ctx.drawImage(
				this.image,
				this.frameIndex * this.width/this.ticksPerFrame	,
				0,
				this.width/this.numberOfFrames,
				this.height/2,
				posX,
				posY+this.height/2, 		// veit ekki með fjóra// 450 for old man
				this.width/this.numberOfFrames,
				this.height/2
			);
	}
	
	//LEFT
	else
	{
	
		//console.log("ahhllo0");
		ctx.drawImage(
			this.image,
			this.frameIndex * this.width/this.ticksPerFrame,
			this.height/2,
			this.width/this.numberOfFrames,
			this.height/2, 						//fyrir gamla
			posX,
			posY+this.height/2, 				// 450 for old man
			this.width/this.numberOfFrames,
			this.height/2
		);
	}
	//}
};


