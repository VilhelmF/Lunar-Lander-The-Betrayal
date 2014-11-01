g_level1 = [];

getLevel = function()
{
	var x = 0;
	var i = 0;

	while(x < g_canvas.width)
	{
		g_level1[i] = Math.floor((Math.random() * 500) + 400);
		//g_level1[i] = 500;
		i++
		x += 10;
	}

	return g_level1;

}


