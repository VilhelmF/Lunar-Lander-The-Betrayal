/*

entityManager.js

A module which handles arbitrary entity-management for "Asteroids"


We create this module as a single global object, and initialise it
with suitable 'data' and 'methods'.

"Private" properties are denoted by an underscore prefix convention.

*/


"use strict";

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
    levelDesign.setUp();
    this.clearLevel = false;
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
clearLevel  : false,

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

fireBullet: function(cx, cy, velX, velY, rotation, team, type) {
    this._bullets.push(new Bullet({
        cx   : cx,
        cy   : cy,
        velX : velX,
        velY : velY,
        type : type,

        rotation : rotation,
        team    : team,
    }));

},

generateShip : function() {
    var ship = new Ship();
    ship.warpToPlank();
    this._ships.push(ship);
},

generateGun : function(cx, cy, type) {
    this._guns.push(new Gun({
        cx   : cx,
        cy   : cy,

        type : type,
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
        cx   : cx,
        cy   : cy,
		
		typeId: util.getRandomInt(0,1),
		dirId : util.getRandomInt(0,1),
		
		//FIND TYPE OF CITIZEN
		type : function() {
			if( this.typeId == 0 ){
				return g_sprites.manWalking;
			}
			else
			{
				return g_sprites.oldManWalking2;
			}
		},
		
		direction : function() {
			
			//LEFT DIRECTION
			if(this.dirId == 0){
				return { dir: false, velX: -1 };
			}
			
			//RIGHT DIRECTION
			else
			{
				return { dir: true, velX: 1 };;
			}
		}
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

shakeGround: function(velX, velY) {
    var speed = (velX + velY) / 2;

    if(speed < 2) speed = 2;
    

    var dirX = util.getRandomInt(0, 1) === 0 ? -1 : 1;
    var dirY = util.getRandomInt(0, 1) === 0 ? -1 : 1;
    var offsetX = util.getRandomInt(6, 12) * dirX * speed;
    var offsetY = util.getRandomInt(3, 7) * dirY * speed;
    for(var i = 0; i < this._ground.length; i++) {
        this._ground[i].shake(offsetX, offsetY);
    }
},

killNearestShip : function(xPos, yPos) {
    var theShip = this._findNearestShip(xPos, yPos).theShip;
    if (theShip) {
        theShip.kill();
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
	

rescueCitizen: function() 
{
     for(var z = 0; z < entityManager._plank.length; z++)
    {
        entityManager._plank[z].rescueNumber += 1; 
    }
},

update: function(du) {

    if(this.clearLevel)
    {
        for (var c = 0; c < this._categories.length; ++c) {

            var aCategory = this._categories[c];
            
            while (aCategory.length) 
            {
                aCategory.pop();
            }
        }
        spatialManager.clearAll();
        this.init();
    }
    else
    {
        for (var c = 0; c < this._categories.length; ++c) {

            var aCategory = this._categories[c];
            var i = 0;

            while (i < aCategory.length) {

                var status = aCategory[i].update(du);

                if (status === this.KILL_ME_NOW) {
                    // remove the dead guy, and shuffle the others down to
                    // prevent a confusing gap from appearing in the array
    				aCategory.splice(i,1);
                }
                else {
                    ++i;
                }
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
        }
        debugY += 10;
    }
}

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();

