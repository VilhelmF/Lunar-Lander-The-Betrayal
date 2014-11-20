/*

spatialManager.js

A module which handles spatial lookup, as required for...
e.g. general collision detection.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */



var spatialManager = {

// "PRIVATE" DATA

_nextSpatialID : 1, // make all valid IDs non-falsey (i.e. don't start at 0)
_nextGroundID : 1,
_entities : [],
_ground   : [],


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
        var lineC = latterY - slope*latterX;
      
        if((firstX <= posX && latterX > posX) ||
           (firstX <= posX + groundLength && latterX > posX + groundLength) ||
           (firstX <= posX - groundLength && latterX > posX - groundLength ))
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
                    
                    return  {
                                slope   :   slope,
								firstX  : 	firstX,
                                latterX :   latterX,
                                latterY :   latterY,
                                lineX   :   lineX,
                                lineY   :   lineY,
                                rotation:   groundBit.rotation,
								index   :   i,
                            };
                }
            }
        }      
    }
},

clearAll : function()
{
    this._nextSpatialID = 1; // make all valid IDs non-falsey (i.e. don't start at 0)
    this._nextGroundID = 1;
    this._entities = [];
    this._ground   = [];
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

    for (var ID in this._ground) {
        var e = this._ground[ID];
        
        ctx.fillStyle = "red";
        util.strokeBox(ctx, e.firstX, e.firstY, 5, 5);
        ctx.fillRect(ctx, e.latterX, e.latterY, 5, 5);
    }
    
    ctx.strokeStyle = oldStyle;
}

};
