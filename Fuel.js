function Fuel(descr) {

    // Common inherited setup logic from Entity
    for (var property in descr) {
        this[property] = descr[property];
    };
};


Fuel.prototype.cx = 0;
Fuel.prototype.cy = 0;
Fuel.prototype.status = 1; //100%
Fuel.prototype.height = 20;
Fuel.prototype.color = "red";


 
Fuel.prototype.render = function(ctx, cx, cy) 
{
	if(!g_doZoom)
	{
		if(this.status > 0.23)
		{
			
			g_sprites.fuelBarSlide.drawImageCropped(ctx, 
												this.cx, 
												this.cy,
												this.cx, 
												this.cy -g_offsetY, 
												this.status);
			g_sprites.fuelBarFill.drawImageCropped(ctx, 
												this.cx, 
												this.cy,
												this.cx, 
												this.cy - g_offsetY, 
												this.status-0.04);
		}
		else 
		{
			g_sprites.fuelBarFill.drawImageCropped(ctx, 
												this.cx, 
												this.cy,
												this.cx,
												this.cy - g_offsetY, 
												this.status);
		}
	
		//fuel bar outline
		g_sprites.fuelBarOutline.drawAt(ctx, this.cx, this.cy - g_offsetY);
		
		//fuel bar status shown on screen right 
		//side of sprite fuelBarOutline. 
		ctx.save();
		ctx.fillStyle = "black";
		ctx.font = "bold 12px Courier New";
		ctx.fillText(Math.floor(this.status * 100) + "%", 
					 g_sprites.fuelBarOutline.width, 
					 28 - g_offsetY);
		ctx.restore();	
	}
	else 
	{
		// zoom mode, 
		// Þorgeir þarf að tala við sævar um þetta
			
		ctx.save();
			
		var y = cy+25;
		var x = cx+35;
			
		ctx.fillStyle = "green";
		ctx.font = "bold 10px Courier New";
		ctx.fillText(Math.floor(this.status * 100) + "%",
					 x+5, 
					 y);
		ctx.font = "bold 8px Courier New";
		ctx.fillText("FUEL",
					x, 
					y-8);
			
		ctx.restore();	
	}
};