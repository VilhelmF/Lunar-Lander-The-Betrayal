var startScreen = {
	render : function(ctx) {
		g_sprites.st_screenLayer1.drawAt(ctx, 0, 0);
		g_sprites.st_screenLayer2.drawAt(ctx, 0, 0);

		//position of sprite:
		//			st_screenLayer3
		//			st_screenLayer4
		
		var mouse = util.onPlayButton();

		if(mouse.onButton){
			g_sprites.st_screenLayer4.drawAt(ctx, mouse.x, mouse.y);
		}else{
			g_sprites.st_screenLayer3.drawAt(ctx, mouse.x, mouse.y);
		}
		
		g_sprites.st_screenLayer5.drawAt(ctx, 0, 0);
		
		g_sprites.oldManWalking.walkRender(ctx, 0, 450, "right");
	}
}