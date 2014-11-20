// ==============
// MOUSE HANDLING
// ==============

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */


var g_mouseX = 0,
    g_mouseY = 0;

function handleMouse(evt) {
    
    g_mouseX = evt.clientX - g_canvas.offsetLeft;
    g_mouseY = evt.clientY - g_canvas.offsetTop;
    
    // If no button is being pressed, then bail
    var button = evt.buttons === undefined ? evt.which : evt.buttons;
    if (!button) return;
      
	checkPlayButton();
	checkPlayAgain();

	//MUTE BUTTON (right top corner)
	checkMuteButton();
}


function checkPlayButton() {
	var value = util.onPlayButton(); 
	if( value.onButton && !g_startGame && !g_gameOver){
		startScreen.visible = false;
		g_startGame = true;
		resetAllAudio();
		playThemeSong();
	}
}

function checkMuteButton() {

	var x = g_canvas.width-30;
	var y = 10;
	
	var width = 16;
	var height = 25;
	
		
	if(util.isMouseInRec(x, y, width, height))
	{
		var mute = g_audio.themeGame.mute;
		mute = !mute;
		muteTrigger(mute);
		g_audio.themeGame.mute = mute;
	}
}

function checkPlayAgain() {

		var mouse = util.onPlayButton(	{x: 295, y: 520 }, 
										216,
										33);
		if(mouse.onButton){
			g_gameOver = false;
			g_gameWon = false;
			g_startGame  = true;
			levelDesign.restartGame();
			resetAllAudio();
			setAllVolume();
			playThemeSong();
		}
}


// Handle "down" and "move" events the same way.
//window.addEventListener("mousedown", handleMouse);
window.addEventListener("onclick", handleMouse);
window.addEventListener("mousemove", handleMouse);
