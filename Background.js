

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
};


Background.prototype = new Entity();


Background.prototype.render = function(ctx) {

	// TÍMABUNDIN BREYTA LEVEL1, GLOBAL BREYTA SEM
	// SEM SEGIR TIL HVAÐA LEVEL ER Í GANGI.
	this.background["level1"].drawAt(ctx, 0,0);
	
	for(var r in this.mountain){
		this.mountain[r].drawAt(ctx);
	}
};


Background.prototype.update = function(du){};