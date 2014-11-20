// ==============
// LUNAR RESCUER
// ==============

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

// =============
// GATHER INPUTS
// =============

function gatherInputs() {
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
    
	if( startScreen.isVisible() && !g_gameOver && !g_gameWon){
		startScreen.update(du);
	}				
	
	if(g_startGame && !g_gameOver && !g_gameWon)
	{
		processDiagnostics();
    
		entityManager.update(du);
		particleManager.update(du);

	}
	else if( g_gameWon && !g_gameOver && !g_startGame ){
		//any victory screen updates ?
	}
}

// GAME-SPECIFIC DIAGNOSTICS
var g_allowMixedActions = true;
var g_useGravity = false;
var g_useAveVel = true;
var g_renderSpatialDebug = false;
var g_doZoom = false;
var g_startGame = false;
var g_gameOver = false;
var g_gameWon = false;

var g_offsetY = 0;

var KEY_MIXED   = keyCode('M');
var KEY_GRAVITY = keyCode('G');
var KEY_AVE_VEL = keyCode('V');
var KEY_SPATIAL = keyCode('X');
var KEY_ZOOM = keyCode('Z'); // temporary zoom button for ship

function processDiagnostics() {

    if (eatKey(KEY_MIXED))
        g_allowMixedActions = !g_allowMixedActions;

    if (eatKey(KEY_AVE_VEL)) g_useAveVel = !g_useAveVel;

    if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;

    if (eatKey(KEY_ZOOM)) g_doZoom = !g_doZoom; //temporary zoom button

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
	ctx.save();
	ctx.translate(0, g_offsetY);
    
    //VICTORY SCREEN
	if(g_gameWon){
		winScreen.render(ctx);
		return;
	}
	
	//MAIN GAME
	if(g_startGame)
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

		playThemeSong();
	}
	
	//STARTSCREEN setup
	if( startScreen.isVisible() && !g_gameOver && !g_gameWon /*&& !g_gameWon*/){
		startScreen.render(ctx);
	}

	//GAME OVER SCREEN
	if(g_gameOver && !g_startGame && !g_gameWon){
		gameOverScreen.render(ctx);	
	}

	ctx.restore();
}


// =============
// PRELOAD STUFF
// =============

var g_images = [];

function requestPreloads() {

    var requiredImages = {
        shipZoom        : "sprites/landerShip-40.png",
        shipShieldRed	: "sprites/shield-43.png",
        shipShieldGreen	: "sprites/shield-80.png",
        shipShieldOrange: "sprites/shield-81.png",
		fuelBarOutline  : "sprites/fuelBar/fuelBar-32.png",
		fuelBarFill     : "sprites/fuelBar/fuelBar-33.png",
		fuelBarSlide    : "sprites/fuelBar/fuelBar-35.png",
		fuelPackage		: "sprites/package/package-42.png",
        ground          : "sprites/ground-39.png",
		st_screenLayer1 : "sprites/startScreen/gameStart-40.png",
		st_screenLayer2 : "sprites/startScreen/gameStart-54.png",
		st_screenLayer3 : "sprites/startScreen/gameStart-44.png",
		st_screenLayer4 : "sprites/startScreen/gameStart-47.png",
		st_screenLayer5 : "sprites/startScreen/gameStart-43.png",
		manWalking		: "sprites/manWalking-58.png",
		oldManWalking	: "sprites/oldManWalking-56.png",
		oldManWalking2	: "sprites/oldManWalking-59.png",
		plank        	: "sprites/plank-61.png",
		tower			: "sprites/tower/tower-61.png",
		diamond			: "sprites/tower/tower-60.png",
		muteOn			: "sprites/mute-60.png",
		muteOff			: "sprites/mute-62.png",
		playbutton1		: "sprites/gameover/playAgain-52.png",
		playbutton2		: "sprites/gameover/playAgain-53.png",
		
		//FOR TOWER EXPLOSION
		tower_p_0		: "sprites/tower/tower-47.png",
		tower_p_1		: "sprites/tower/tower-48.png",
		tower_p_2		: "sprites/tower/tower-49.png",
		tower_p_3		: "sprites/tower/tower-50.png",
		tower_p_4		: "sprites/tower/tower-51.png",
		tower_p_5		: "sprites/tower/tower-52.png",
		tower_p_6		: "sprites/tower/tower-53.png",
		tower_p_7		: "sprites/tower/tower-54.png",
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

	
    g_sprites.bullet = new Sprite(g_images.shipZoom);
    g_sprites.bullet.scale = 0.25;


    entityManager.init();

    main.init();
}

// Kick it off
requestPreloads();