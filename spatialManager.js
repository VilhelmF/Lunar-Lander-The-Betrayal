/*

spatialManager.js

A module which handles spatial lookup, as required for...
e.g. general collision detection.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

var spatialManager = {

// "PRIVATE" DATA

_nextSpatialID : 1, // make all valid IDs non-falsey (i.e. don't start at 0)
_nextGroundID : 1,
_entities : [],
_ground   : [],

// "PRIVATE" METHODS
//
// <none yet>


// PUBLIC METHODS

getNewSpatialID : function() {

    return this._nextSpatialID++;

},

getNewGroundID : function() {

    return this._nextGroundID++;

},



register: function(entity) {
    var spatialID = entity.getSpatialID();
    this._entities[spatialID] = entity;
},

unregister: function(entity) {
    var spatialID = entity.getSpatialID();
    
    delete this._entities[spatialID];
},

registerGround: function(entity) {
    var spatialID = entity.getSpatialID();
    this._ground[spatialID] = entity;
},

unregisterGround: function(entity) {
    var spatialID = entity.getSpatialID();
    delete this._ground[spatialID];
},

findEntityInRange: function(posX, posY, radius) {

    for (var ID in this._entities) {
        var e = this._entities[ID];

        if( posX === e.cx && posY === e.cy)
        {
            continue;
        }
    
        var distanceSq = util.distSq( posX, posY, e.cx, e.cy );
        var limitSq = util.square(radius + e.getRadius());
        if (distanceSq < limitSq) { return e; }
        //else { return false}
    }

},

collidesWithGround : function(posX, posY, radius)
{

    for(var ID in this._ground)
    {
        var groundBit = this._ground[ID];
        var bottom = posY + radius;
        if(bottom > groundBit.firstY || bottom > groundBit.latterY)
        {
            var bottomLeftX = posX - radius;
            var bottomLeftY = posY + radius;
            var bottomRightX = posX + radius;
            var bottomRightY = posY + radius;

            var slope = groundBit.getSlope();


            var leftY = groundBit.firstY + (bottomLeftX * slope);
            var rightY = groundBit.firstY + (bottomRightX * slope);



            if(bottomLeftY > leftY || bottomRightY > rightY)
            {
                return true;
            }    
        }
    }
},

render: function(ctx) {
    var oldStyle = ctx.strokeStyle;
    ctx.strokeStyle = "red";
    
    for (var ID in this._entities) {
        var e = this._entities[ID];
        util.strokeCircle(ctx, e.cx, e.cy, e.getRadius());
        

        var e = this._entities[ID];
        var cx = e.cx - e.getRadius();
        var cy = e.cy - e.getRadius();
        var box = 2 * e.getRadius();
        util.strokeBox(ctx, cx, cy, box, box);
    }
   


    ctx.strokeStyle = oldStyle;

}

}
