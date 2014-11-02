
var particleManager = {

_particles : [],

explosion : function(cx, cy) {
	for(var i = 0; i < 20; i++) {
		var particle = new Particle();
		particle.init();
		this._particles[i] = particle; 
	}
},

update : function(du) {
	for(var i = 0; i < this._particles.length; i++) {
		this._particles[i].update(du);
	}
},

render : function(ctx) {
	for(var i = 0; i < this._particles.length; i++) {
		this._particles[i].render(ctx);
	}
}

}