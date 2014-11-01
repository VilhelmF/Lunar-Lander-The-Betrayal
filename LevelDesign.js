g_level1 = [];

getLevel = function()
{
/*	var x = 0;
	var i = 0;

	while(x < g_canvas.width)
	{
		g_level1[i] = Math.floor((Math.random() * 500) + 400);
		//g_level1[i] = 500;
		i++
		x += 10;
	}
*/
	var levelDesign = new LevelDesign();
	levelDesign.setUp();

	g_level1 = levelDesign.grid;

	console.log(g_level1);

	return g_level1;

}



// A generic constructor which accepts an arbitrary descriptor object
function LevelDesign(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }

    this.setUp();
}

LevelDesign.prototype.columns = 16;
LevelDesign.prototype.rows = 12;
LevelDesign.prototype.level = 1;
LevelDesign.prototype.grid = [];

LevelDesign.prototype.levels = {
    "1" : [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1,
            0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
}

LevelDesign.prototype.nextLevel = function() {
	this.level++;
}

LevelDesign.prototype.setUp = function() {
	var index = 0;

	for(var i = 0; i < this.rows; i++) {
		for(var j = 0; j < this.columns; j++) {
			if(0 != this.levels[this.level][index]) {
				this.grid[j] = i * (g_canvas.height / this.rows);
				console.log(this.grid[j]);
			}
			index++;
		}
	}
}
