// =========
// ASTEROIDS
// =========
/*

A sort-of-playable version of the classic arcade game.


HOMEWORK INSTRUCTIONS:

You have some "TODO"s to fill in again, particularly in:

spatialManager.js

But also, to a lesser extent, in:

Rock.js
Bullet.js
Ship.js


...Basically, you need to implement the core of the spatialManager,
and modify the Rock/Bullet/Ship to register (and unregister)
with it correctly, so that they can participate in collisioans.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// ====================
// CREATE INITIAL SHIPS
// ====================
/*
function createInitialShips() {

    entityManager.generateShip({
        cx : 200,
        cy : 200
    });
    
}*/

// =============
// GATHER INPUTS
// =============

function gatherInputs() {
    // Nothing to do here!
    // The event handlers do everything we need for now.
}


// =================
// UPDATE SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `update` routine handles generic stuff such as
// pausing, single-step, and time-handling.
//
// It then delegates the game-specific logic to `updateSimulation`


// GAME-SPECIFIC UPDATE LOGIC

function updateSimulation(du) {
    
	if( !g_startGame && !g_gameOver && !g_gameWon){
		
		if(	(g_sprites.oldManWalking.posX > g_canvas.width))
		{
			g_sprites.oldManWalking.posX = 0;
		}
		else
		{
			g_sprites.oldManWalking.walkUpdate(2);
		}
		
		/*setTimeout( function() { 
					g_audio.themeGamePlay.soundVolume( 0.5 );
					g_audio.themeGamePlay.playSound(); }, 60100);*/
					
		//increase volume
		/*if(g_audio.startScreen2.volume < 1){
			g_audio.startScreen2.soundVolume(
				g_audio.startScreen2.volume+0.1
			);*/
	}				
	else if(g_startGame && !g_gameOver && !g_gameWon)
	{
		processDiagnostics();
    
		entityManager.update(du);
		particleManager.update(du);

		// Prevent perpetual firing!
		eatKey(Ship.prototype.KEY_FIRE);
	}
	else if (g_gameOver){
		//..
	}
	else if(g_gameWon){
		//..
	}
}

// GAME-SPECIFIC DIAGNOSTICS

var g_allowMixedActions = true;
var g_useGravity = false;
var g_useAveVel = true;
var g_renderSpatialDebug = false;
var g_doZoom = false;
var g_startGame = false; //FIXME: change this to false
var g_gameOver = false;
var g_gameWon = false;

var KEY_MIXED   = keyCode('M');
var KEY_GRAVITY = keyCode('G');
var KEY_AVE_VEL = keyCode('V');
var KEY_SPATIAL = keyCode('X');
var KEY_ZOOM = keyCode('Z'); // temporary zoom button for ship

var KEY_HALT  = keyCode('H');
var KEY_RESET = keyCode('R');

var KEY_0 = keyCode('0');

var KEY_1 = keyCode('1');
var KEY_2 = keyCode('2');

var KEY_K = keyCode('K');

function processDiagnostics() {

    if (eatKey(KEY_MIXED))
        g_allowMixedActions = !g_allowMixedActions;

    if (eatKey(KEY_GRAVITY)) g_useGravity = !g_useGravity;

    if (eatKey(KEY_AVE_VEL)) g_useAveVel = !g_useAveVel;

    if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;

    if (eatKey(KEY_ZOOM)) g_doZoom = !g_doZoom; //temporary zoom button

    if (eatKey(KEY_HALT)) entityManager.haltShips();

    if (eatKey(KEY_RESET)) entityManager.resetShips();

    if (eatKey(KEY_0)) entityManager.toggleRocks();

    if (eatKey(KEY_1)) entityManager.generateShip({
        cx : g_mouseX,
        cy : g_mouseY,
        
        sprite : g_sprites.ship});

    if (eatKey(KEY_2)) entityManager.generateShip({
        cx : g_mouseX,
        cy : g_mouseY,
        
        sprite : g_sprites.ship
        });

    if (eatKey(KEY_K)) entityManager.killNearestShip(
        g_mouseX, g_mouseY);
}


// =================
// RENDER SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `render` routine handles generic stuff such as
// the diagnostic toggles (including screen-clearing).
//
// It then delegates the game-specific logic to `gameRender`


// GAME-SPECIFIC RENDERING

function renderSimulation(ctx) {
    
	//STARTSCREEN setup
	if( !g_startGame && !g_gameOver /*&& !g_gameWon*/){
		g_sprites.st_screenLayer1.drawAt(ctx, 0, 0);
		g_sprites.st_screenLayer2.drawAt(ctx, 0, 0);

		//position of sprite:
		//			st_screenLayer3
		//			st_screenLayer4
		
		var mouse = util.onPlayButton();

		if(mouse.onButton){
			g_sprites.st_screenLayer4.drawAt(ctx, mouse.x, mouse.y);
		}else{
			g_sprites.st_screenLayer3.drawAt(ctx, mouse.x, mouse.y);
		}
		
		g_sprites.st_screenLayer5.drawAt(ctx, 0, 0);
		
		g_sprites.oldManWalking.walkRender(ctx, 0, 450, "right");
	}
	else if(g_startGame /*&& !g_gameOver && !g_gameWon*/)
	{	
		
		if(g_doZoom) {
			ctx.save();
			var scale = 2;
			var pos = entityManager.getShipPos();
			
			var newWidth = pos.posX * scale;
			var newHeight = pos.posY * scale;

            ctx.translate(-((newWidth - pos.posX)), -((newHeight - pos.posY)));
            ctx.scale(scale, scale);
        }

		entityManager.render(ctx);
		particleManager.render(ctx);

		if (g_renderSpatialDebug) spatialManager.render(ctx);
		
		if(g_doZoom) ctx.restore();
	}
	else {
		g_background["gameOver"].drawAt(ctx, 0,0);
		
		//PLAY BUTTON
		//setTimeout(
			//function () {
		var mouse = util.onPlayButton(	{x: 295, y: 520 }, 
										216,
										33);
		if(mouse.onButton){
			console.log("halllllppppppppppppsfsdsfdfdfs");
			g_sprites.playbutton1.drawAt(ctx, 0, 0);
		}
		else
		{
			g_sprites.playbutton2.drawAt(ctx, 0, 0);
		}
	}
	/*else if (g_gameOver){
	
		console.log("You lost ...");
		
	
	}
	else if(g_gameWon){
	
		console.log("you Won");
	
	}*/
}


// =============
// PRELOAD STUFF
// =============

var g_images = [];

function requestPreloads() {

    var requiredImages = {
        //ship   : "https://notendur.hi.is/~pk/308G/images/ship.png",

        ship            : "sprites/landerShip-36.png",
        shipZoom        : "sprites/landerShip-40.png",
        rock            : "https://notendur.hi.is/~pk/308G/images/rock.png",
		kassi1          : "sprites/package/kassi1-37.png",
		fuelBarOutline  : "sprites/fuelBar/fuelBar-32.png",
		fuelBarFill     : "sprites/fuelBar/fuelBar-33.png",
		fuelBarSlide    : "sprites/fuelBar/fuelBar-35.png",
        ground          : "sprites/ground-39.png",
		st_screenLayer1 : "sprites/startScreen/gameStart-40.png",
		st_screenLayer2 : "sprites/startScreen/gameStart-42.png",
		st_screenLayer3 : "sprites/startScreen/gameStart-44.png",
		st_screenLayer4 : "sprites/startScreen/gameStart-47.png",
		st_screenLayer5 : "sprites/startScreen/gameStart-43.png",
		oldManWalking	: "sprites/oldManWalking-56.png",
		oldManWalking2	: "sprites/oldManWalking-59.png",
		fuelPackage		: "sprites/package/package-42.png",
		randomPackage	: "sprites/package/package-41.png",
		plank        	: "sprites/plank-48.png",
		manWalking		: "sprites/manWalking-58.png",
        arrow           : "sprites/arrow-57.png",
		tower			: "sprites/tower/tower-61.png",
		diamond			: "sprites/tower/tower-60.png",
		muteOn			: "sprites/mute-60.png",
		muteOff			: "sprites/mute-62.png",
		playbutton1		: "sprites/gameover/playAgain-52.png",
		playbutton2		: "sprites/gameover/playAgain-53.png"
	};


	//
	//PRELOADS
	//
	
	preLoadAudio();
	
	preLoadMountain();
	preLoadBackground();
    imagesPreload(requiredImages, g_images, preloadDone);
}

var g_sprites = [];


function preloadDone() {
	
	
	for(var image in g_images) {
		g_sprites[image] = new Sprite(g_images[image], image);
	}

	
    g_sprites.bullet = new Sprite(g_images.ship);
    g_sprites.bullet.scale = 0.25;


    entityManager.init();

    main.init();
}

// Kick it off
requestPreloads();