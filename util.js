// util.js
//
// A module of utility functions, with no private elements to hide.
// An easy case; just return an object containing the public stuff.

"use strict";


var util = {

// GROUNDINFO
// ==========

getGroundSlopes: function() {
	var tempArray = entityManager._ground;
	var slope = [];
	for(var i=0; i<tempArray.length; i++) {
		slope[i] = tempArray[i];
	}
	return slope;
},






// RANGES
// ======

clampRange: function(value, lowBound, highBound) {
    if (value < lowBound) {
	value = lowBound;
    } else if (value > highBound) {
	value = highBound;
    }
    return value;
},

wrapRange: function(value, lowBound, highBound) {
    while (value < lowBound) {
	value += (highBound - lowBound);
    }
    while (value > highBound) {
	value -= (highBound - lowBound);
    }
    return value;
},

isBetween: function(value, lowBound, highBound) {
	if (value < lowBound) { return false; }
    if (value > highBound) { return false; }
    return true;
},


isMouseInRec: function (x, y, width, height) {
	var rec = { x: x, 
				y: y, 
				width:  width, 
				height: height };

	if(this.inRec(g_mouseX, g_mouseY, rec)){
		return true;
	} else { 
		return false; 
	}
},

inRec: function(posX, posY, rec){
	
	if(
		this.isBetween( posX, rec.x, rec.x+rec.width ) &&
		this.isBetween( posY, rec.y, rec.y+rec.height ))
	{
		return true;
	}
	else
	{
		return false;
	}
},

onPlayButton: function	(pos, width, height){
	//position of sprite:
	//			st_screenLayer3
	//			st_screenLayer4
	if(typeof pos === 'undefined'){
		pos = {x: 295, y: 295};
	}
	if(typeof width === 'undefined' || typeof height === 'undefined')
	{
		width   = g_sprites.st_screenLayer3.width;
		height   = g_sprites.st_screenLayer3.height;
	}
	
	var boolValue;
	
	if( this.isMouseInRec(pos.x, pos.y, width, height) )
	{
		boolValue = true;
	}
	else
	{
		boolValue = false;
	}

	return { x: pos.x, y: pos.y, onButton: boolValue };
},


// RANDOMNESS
// ==========

randRange: function(min, max) {
    return (min + Math.random() * (max - min));
},


// MISC
// ====

square: function(x) {
    return x*x;
},


// DISTANCES
// =========

distSq: function(x1, y1, x2, y2) {
    return this.square(x2-x1) + this.square(y2-y1);
},


wrappedDistSq: function(x1, y1, x2, y2, xWrap, yWrap) {
    var dx = Math.abs(x2-x1),
	dy = Math.abs(y2-y1);
    if (dx > xWrap/2) {
	dx = xWrap - dx;
    };
    if (dy > yWrap/2) {
	dy = yWrap - dy;
    }
    return this.square(dx) + this.square(dy);
},

findRadius: function(w1, h1) {
    return Math.sqrt(this.square(w1/2) + this.square(h1/2));
},

// CANVAS OPS
// ==========

clearCanvas: function (ctx) {
    var prevfillStyle = ctx.fillStyle;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = prevfillStyle;
},

strokeCircle: function (ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
},

strokeBox : function (ctx, x, y, width, height )
{   
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.stroke();
},

fillCircle: function (ctx, x, y, r, style) {
    var oldStyle = ctx.fillStyle;
    ctx.fillStyle = style;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = oldStyle;
},

fillBox: function (ctx, x, y, w, h, style) {
    var oldStyle = ctx.fillStyle;
    ctx.fillStyle = style;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = oldStyle;
},

getRandomInt: function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

};
