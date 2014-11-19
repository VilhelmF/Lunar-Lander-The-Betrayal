
var particleManager = {

_particles : [],
KILL_ME_NOW : -1,

/*
towerExplosion : function(cx, cy, i, ) {
	for(var i = 0; i < 8; i++) {
		initToxerExplosion(cx, cy, i);
		this._particles.push(particle);
	}
},*/

explosion : function(cx, cy, tower) {
	for(var i = 0; i < 30; i++) {
		var particle = new Particle();
		particle.initExplosion(cx, cy, tower);
		this._particles.push(particle); 
	}
},

thrust : function(cx, cy, rotation, radius) {
	for(var i = 0; i < 6; i++) {
		var particle = new Particle();
		particle.initThrust(cx, cy, rotation, radius-i*2, i);
		this._particles.push(particle);
	}
},

tower : function(cx, cy){
	var velX, velY;
	var corner = -88;
	for(var i=0; i<8; ++i){
		var particle = new Particle();
		velX = 5 * +Math.sin(corner * (Math.PI/180));
		velY = 5 * -Math.cos(corner * (Math.PI/180));
		particle.initTower(cx, cy, velX, velY, g_sprites["tower_p_" + i]);
		this._particles.push(particle);

		corner += 22;
	}
},

update : function(du) {
	for(var i = 0; i < this._particles.length; i++) {
		if(this._particles[i].update(du) === this.KILL_ME_NOW) {
			this._particles.splice(i--, 1);
		}
	}
},

render : function(ctx) {
	for(var i = 0; i < this._particles.length; i++) {
		this._particles[i].render(ctx);
	}
}

}