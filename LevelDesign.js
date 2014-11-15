/*g_level1 = [];

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

	var levelDesign = new LevelDesign();

	g_level1 = levelDesign.grid;

	return g_level1;

}
*/

var levelDesign = {
	columns : 17,
	rows    : 12,
	level   : 2,
	grid    : [],

    items : {
        gun : 2,
        citizen : 3,
        plank : 4,
    },

	levels : {
	"1" : [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1,
            0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],

    "2" : [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 1, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
            0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
	},

	nextLevel : function() {
		this.level++;
	},

	getLevel : function() {
		return this.grid;
	},

	setUp : function() {
		var index = 0;

        console.log("ok");

    	for(var i = 0; i < this.rows; i++) {
    		for(var j = 0; j < this.columns; j++) {
    			if(0 != this.levels[this.level][index]) {
    				this.grid[j] = i * (g_canvas.height / this.rows);


                    if(this.items.gun === this.levels[this.level][index]) {
                        var cx = j * Ground.prototype.width - Ground.prototype.width/2;
                        var cy = i * (g_canvas.height / this.rows);
                        entityManager.generateGun(cx, cy);
                    }

                    if(this.items.citizen === this.levels[this.level][index]) {
                        var cx = j * Ground.prototype.width - Ground.prototype.width/2;
                        var cy = i * (g_canvas.height / this.rows) - Citizen.prototype.getRadius();
                        entityManager.generateCitizen(cx, cy);
                    }

                    if(this.items.plank ===this.levels[this.level][index]) {
                        var cx = j * Ground.prototype.width - Ground.prototype.width/2;
                        var cy = i * (g_canvas.height / this.rows) - Plank.prototype.halfHeight;
                        entityManager.generatePlank(cx, cy);                        
                    }
    			}
    			index++;
    		}
    	}

        var j = 0;
        var firstX = 0;
        var firstY = this.grid[j];
        var latterX = Ground.prototype.width;
        var latterY = this.grid[j+1];
        j++;
        while(j < this.grid.length-1)
        {
                                    console.log("_________________________" + firstY);
                                                console.log("_________________________" + latterY);
            entityManager.generateGround(firstX, latterX, firstY, latterY);
            j++;
            firstX = latterX;
            firstY = latterY;
            latterX += Ground.prototype.width;
            latterY = this.grid[j]; 
//                        console.log("_________________________" + latterX);
        }
                                console.log("_________________________" + firstY);
                                                console.log("_________________________" + latterY);

        entityManager.generateGround(firstX, latterX, firstY, latterY);
    },

    generateLevel : function() {

    }
}
/*

// A generic constructor which accepts an arbitrary descriptor object
function LevelDesign(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }

    this.setUp();
}

LevelDesign.prototype.columns = 16;
LevelDesign.prototype.rows = 12;
LevelDesign.prototype.level = 2;
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

    "2" : [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0,
            0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
}

LevelDesign.prototype.nextLevel = function() {
	this.level++;
}

LevelDesign.prototype.getLevel = function() {
	return this.grid;
}

LevelDesign.prototype.setUp = function() {
	var index = 0;

	for(var i = 0; i < this.rows; i++) {
		for(var j = 0; j < this.columns; j++) {
			if(0 != this.levels[this.level][index]) {

//				this.grid[j] = i * (g_canvas.height / this.rows);
			}
			index++;
		}
	}
}
*/