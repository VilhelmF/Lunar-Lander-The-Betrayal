var startScreen = {
	offsetY : 0,

	visible : true,

	isVisible : function() {
		return this.visible;
	},

	update : function(du) {
		if(	(g_sprites.oldManWalking.posX > g_canvas.width))
		{
			g_sprites.oldManWalking.posX = 0;
		}
		else
		{
			g_sprites.oldManWalking.walkUpdate(2);
		}

		if(g_startGame) {
			this.offsetY += 10;
			if(this.offsetY >= g_canvas.height) {
				this.visible = false;
			}
		}
	},

	render : function(ctx) {
		ctx.save();
		ctx.translate(0, this.offsetY);
		g_sprites.st_screenLayer1.drawAt(ctx, 0, 0);
		g_sprites.st_screenLayer2.drawAt(ctx, 0, 0);

		
		var mouse = util.onPlayButton();

		if(mouse.onButton){
			g_sprites.st_screenLayer4.drawAt(ctx, mouse.x, mouse.y);
		}else{
			g_sprites.st_screenLayer3.drawAt(ctx, mouse.x, mouse.y);
		}
		
		g_sprites.st_screenLayer5.drawAt(ctx, 0, 0);
		
		g_sprites.oldManWalking.walkRender(ctx, 0, 450, "right");

		ctx.restore();
	}
}