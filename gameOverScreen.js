var gameOverScreen = {
	render : function(ctx) {
		g_background["gameOver"].drawAt(ctx, 0,0);

		g_offsetY = 0;
		
		//PLAY BUTTON
		var mouse = util.onPlayButton(	{x: 295, y: 520 }, 
										216,
										33);
		if(mouse.onButton){
			g_sprites.playbutton1.drawAt(ctx, 0, 0);
		}
		else
		{
			g_sprites.playbutton2.drawAt(ctx, 0, 0);
		}
		
		playThemeSong();
	}
}