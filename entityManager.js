/*

entityManager.js

A module which handles arbitrary entity-management for "Asteroids"


We create this module as a single global object, and initialise it
with suitable 'data' and 'methods'.

"Private" properties are denoted by an underscore prefix convention.

*/


"use strict";


// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops 
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/


var entityManager = {

// "PRIVATE" DATA


_bullets    : [],
_ships      : [],
_ground     : [],
_package    : [],
_citizens   : [],
_background : [],
_guns	    : [],
_plank      : [],



// "PRIVATE" METHODS


_generateLevel : function() {
 //   this._bullets = [];
 //   this._ground = [];
 //   this._guns = [];
 //   this._citizens = [];

    levelDesign.setUp();
//    var levelArray = levelDesign.getLevel();
/*
    var i = 0;
    var firstX = 0;
    var firstY = levelArray[i];
    var latterX = Ground.prototype.plankWidth;
    var latterY = levelArray[i+1];
    while(i < levelArray.length-1)
    {
        this.generateGround(firstX, latterX, firstY, latterY);
        i++;
        firstX = latterX;
        firstY = latterY;
        latterX += Ground.prototype.plankWidth;
        latterY = levelArray[i]; 
    }

    this.generateGround(firstX, latterX, firstY, latterY); */

},


_findNearestShip : function(posX, posY) {
    var closestShip = null,
        closestIndex = -1,
        closestSq = 1000 * 1000;

    for (var i = 0; i < this._ships.length; ++i) {

        var thisShip = this._ships[i];
        var shipPos = thisShip.getPos();
        var distSq = util.wrappedDistSq(
            shipPos.posX, shipPos.posY, 
            posX, posY,
            g_canvas.width, g_canvas.height);

        if (distSq < closestSq) {
            closestShip = thisShip;
            closestIndex = i;
            closestSq = distSq;
        }
    }
    return {
        theShip : closestShip,
        theIndex: closestIndex
    };
},

_forEachOf: function(aCategory, fn) {
    for (var i = 0; i < aCategory.length; ++i) {
        fn.call(aCategory[i]);
    }
},

// PUBLIC METHODS

// A special return value, used by other objects,
// to request the blessed release of death!
//
KILL_ME_NOW : -1,

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//
deferredSetup : function () {


    this._categories = [this._background,
                        this._bullets, 
                        this._ships,
						this._package,						
                        this._ground,
                        this._guns, 
                        this._citizens,
                        this._plank,
                        ];
},

init: function() {
    this._generateLevel();
	this._generateBackground();
	this._generatePackage({cx: 200, cy: -30});
    this.generateShip();
},

fireBullet: function(cx, cy, velX, velY, rotation, team) {
    this._bullets.push(new Bullet({
        cx   : cx,
        cy   : cy,
        velX : velX,
        velY : velY,

        rotation : rotation,
        team    : team,
    }));

},

generateShip : function() {
    var ship = new Ship();
    ship.warpToPlank();
    this._ships.push(ship);
},

generateGun : function(cx, cy) {
    this._guns.push(new Gun({
        cx   : cx,
        cy   : cy,
    }));
},

generatePlank : function(cx, cy) {
    this._plank.push(new Plank({
        cx : cx,
        cy : cy,
    }));
},

generateCitizen : function(cx, cy) {
    this._citizens.push(new Citizen({
        cx : cx,
        cy : cy,
    }));
},

generateGround : function(x1, x2, y1, y2) {
    this._ground.push(new Ground({
        firstX   : x1,
        firstY   : y1,
        latterX  : x2,
        latterY  : y2,
		cx		 : x1,
		cy		 : y1,
    }));

/*     this._citizens.push(new Citizen({
        cx   : x1,
        cy   : (y1 - 2*Citizen.prototype.halfHeight),
    }));

   /* var firstX = 0;
    var firstY = levelArray[0];
    var latterX = 10;
    var latterY = levelArray[1];

     firstX = 0;
     firstY = 500;
     latterX = 10;
     latterY = 500;
    for(var i = 0; i < levelArray.length; i++)
    {
        this._ground.push(new Ground({
        firstX   : firstX,
        firstY   : firstY,
        latterX  : latterX,
        latterX  : latterX,
    }));

        

    firstX = latterX;
    latterX = firstX + 10;
  /*  firstY = latterY;
    //latterY = levelArray[i + 1];

    }*/
    
},

getPlankPos : function() {
    if(this._plank[0]) {
        return this._plank[0].getPos();
    }
},

_generateBackground : function() {

	this._background.push(new Background());

},

_generatePackage: function(descr) {

	this._package.push(new Package(descr));
},

killNearestShip : function(xPos, yPos) {
    var theShip = this._findNearestShip(xPos, yPos).theShip;
    if (theShip) {
        theShip.kill();
    }
},

yoinkNearestShip : function(xPos, yPos) {
    var theShip = this._findNearestShip(xPos, yPos).theShip;
    if (theShip) {
        theShip.setPos(xPos, yPos);
    }
},

getShipPos : function() {
    var theShip = this._findNearestShip(1, 1).theShip;
    if(theShip) {
        return theShip.getPos();
    }
},

resetShips: function() {
    this._forEachOf(this._ships, Ship.prototype.reset);
},

haltShips: function() {
    this._forEachOf(this._ships, Ship.prototype.halt);
},	

update: function(du) {

    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];
        var i = 0;

        while (i < aCategory.length) {

            var status = aCategory[i].update(du);

            if (status === this.KILL_ME_NOW) {
                // remove the dead guy, and shuffle the others down to
                // prevent a confusing gap from appearing in the array
                
				//Þ:  delete aCategory[i];
				//Þ: SÉRÐU NÚNA HELVÍTIÐ ÞITT?!
				aCategory.splice(i,1);
            }
            else {
                ++i;
            }
        }
    }

},

render: function(ctx) {

    var debugX = 10, debugY = 100;

    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];

        for (var i = 0; i < aCategory.length; ++i) {

            aCategory[i].render(ctx);
            //debug.text(".", debugX + i * 10, debugY);

        }
        debugY += 10;
    }
}

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();

