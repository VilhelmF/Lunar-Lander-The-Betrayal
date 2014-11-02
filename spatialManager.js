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
        
        var left = posX - radius;
        var right = posX + radius;
        var bottom = posY + radius;
        
        var firstX = groundBit.firstX; 
        var latterX = groundBit.latterX; 
        var firstY = groundBit.firstY; 
        var latterY = groundBit.firstY; 

        var groundLength = latterX - firstX;
        var slope = groundBit.getSlope();

       
        if((firstX < posX && latterX > posX) ||
           (firstX < posX + groundLength && latterX > posX + groundLength) ||
           (firstX < posX - groundLength && latterX > posX - groundLength ))
        {       
                for(var i = 0; i < groundLength; i++)
                {
                    var lineX = firstX + i;
                    var lineY = firstY + i * slope;

                    var x = util.square(lineX - posX);
                    var y = util.square(lineY - posY);


                    var d = x + y;
                    if(d < util.square(radius))
                    {
                        //return slope;

                        return true;
                    }
                }
        }       
            
        

       


        /*


        //Testing, will refactor
        var bottomLeftX = posX - radius;
        var bottomLeftY = posY + radius;
        var bottomRightX = posX + radius;
        var bottomRightY = posY + radius;
        
        if(bottomLeftY > groundBit.firstY || bottomLeftY > groundBit.latterY)
        {
            if(bottomLeftX < groundBit.latterX && groundBit.firstX < bottomLeftX)
            {
                var slope = groundBit.getSlope();

                var leftY = groundBit.firstY + ((bottomLeftX - groundBit.firstX) * slope);
                if(bottomLeftY > leftY)
                {
                    return true;
                } 
            }   
              
        }
        else if(bottomRightY > groundBit.firstY || bottomRightX > groundBit.latterY)
        {
            if(bottomRightX < groundBit.latterX && groundBit.firstX < bottomRightX)
            {
                var slope = groundBit.getSlope();
                var rightY = groundBit.firstY + ((bottomRightX - groundBit.firstX) * slope);
                if(bottomRightY > rightY)
                {   
                    console.log(slope);
                    console.log(groundBit.firstY);
                    console.log(bottomRightX);
                    console.log(groundBit.firstX);
                    console.log(rightY);

                    return true;
                }
            }
            
        }*/
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
