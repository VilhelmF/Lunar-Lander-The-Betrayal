// ==========
// Citizen STUFF
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Citizen(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.rememberResets();
    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.ship;
    
    // Set normal drawing scale, and warp state off
    this._scale = 1;
    this._isWarping = false;
};

Citizen.prototype = new Entity();

Citizen.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
};



// Initial, inheritable, default values
Citizen.prototype.rotation = 0;
Citizen.prototype.cx = 200;
Citizen.prototype.cy = 200;
Citizen.prototype.halfHeight = 5;
Citizen.prototype.halfWidth = 5;



    
Citizen.prototype.update = function (du) {

    console.log("Update Citizen");

};



Citizen.prototype.render = function (ctx) {
    ctx.save();
	
	ctx.fillStyle = "red";
    ctx.beginPath();
    var headR = 3;
	ctx.arc(this.cx, this.cy - this.halfHeight, headR, 0, Math.PI * 2, true);
	ctx.fill();

	
	//Body	
	ctx.strokeStyle = "red";
	ctx.beginPath();
	ctx.moveTo(this.cx, this.cy -this.halfHeight + headR);
	ctx.lineTo(this.cx, this.cy + 2*this.halfHeight-headR);
	ctx.stroke();

	//Both arms
	ctx.strokeStyle = "red";
	ctx.beginPath();
	ctx.moveTo(this.cx, this.cy);
	ctx.lineTo(this.cx - this.halfWidth	, this.cy + headR);
	ctx.moveTo(this.cx, this.cy);
	ctx.lineTo(this.cx + this.halfWidth, this.cy + headR);
	ctx.stroke();

	//Both legs
	ctx.strokeStyle = "red";
	ctx.beginPath();
	ctx.moveTo(this.cx, this.cy + this.halfHeight);
	ctx.lineTo(this.cx - 0.75*this.halfWidth, this.cy + 2*this.halfHeight);
	ctx.moveTo(this.cx, this.cy + this.halfHeight);
	ctx.lineTo(this.cx + 0.75*this.halfWidth, this.cy + 2*this.halfHeight);
	ctx.stroke();
};

