


function Background() {
	
	this.setup();
	
	this.mountain = [];
	
	
	for(var r in g_mountain) {
		this.mountain[r] = g_mountain[r];
	}  
};


Background.prototype = new Entity();


Background.prototype.render = function(ctx) {

	for(var r in this.mountain){
		this.mountain[r].drawAt(ctx);
	}
};


Background.prototype.update = function(du){};