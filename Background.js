

function Background() {
	
	this.setup();
	
	
	this.background = [];
	this.mountain   = [];
	
	for(var r in g_background) {
		this.background[r] = g_background[r];
	}
	
	for(var r in g_mountain) {
		this.mountain[r] = g_mountain[r];
	}
	
	this.muteOnSprite  = g_sprites.muteOn;
	this.muteOffSprite = g_sprites.muteOff;
	
	this.mute = false;
	
	this.beginX = g_canvas.width-30; 
	this.beginY = 10;
};


/*Background.prototype.muteConstruction = function() {

	this.mute = g_audio.themeSong.mute;

	this.muteOnSprite  = g_sprites.muteOn;
	this.muteOffSprite = g_sprites.muteOff;
	
	this.beginX = g_canvas.width-30;
	
	this.beginY = 10;
};*/




//Background.prototype.mute;



Background.prototype = new Entity();


Background.prototype.message = function(ctx, message, posX, posY, fontInfo){
	ctx.save();
	ctx.fillStyle = "black";
	ctx.font = fontInfo;
	ctx.fillText(message, posX, posY);
	ctx.restore();
};



Background.prototype.render = function(ctx) {

	// TÍMABUNDIN BREYTA LEVEL1, GLOBAL BREYTA SEM
	// SEM SEGIR TIL HVAÐA LEVEL ER Í GANGI.
	this.background["level1"].drawAt(ctx, 0,0);
	
	for(var r in this.mountain){
		this.mountain[r].drawAt(ctx);
	}
	
	if(levelDesign.level == 1)
	{
		this.message(ctx, "SAVE THE CITIZEN", 300, 100, "bold 40px Courier New");
		this.message(ctx, "press 'SPACE' to pick them up", 360, 125, "20px Courier New");
		this.message(ctx, "WATCH OUT FOR THE ENEMY!", 360, 150, "20px Courier New");
	}
	
	if(!this.mute){
		g_sprites.muteOn.drawAt(ctx, this.beginX, this.beginY );
	}
	else if(this.mute)
	{
		g_sprites.muteOff.drawAt(ctx, this.beginX, this.beginY);	
	}
	
	
	
	if( g_renderSpatialDebug ) {
		var beginX = g_canvas.width-30;
		var beginY = 10;
		
		var height	= 25;
		var width	= 16;
		
		ctx.save();
		ctx.strokeStyle = "red";
		util.strokeBox(ctx,beginX,beginY, width, height);
		ctx.restore();
	}
};


Background.prototype.update = function(){
	/*if(g_audio.themeSong.currentTime === 0){
		g_audio.themeSong.playSound();
	}*/
	this.mute = g_audio.themeSong.mute;
};