// ==============
// MOUSE HANDLING
// ==============

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

var g_mouseX = 0,
    g_mouseY = 0;

function handleMouse(evt) {
    
    g_mouseX = evt.clientX - g_canvas.offsetLeft;
    g_mouseY = evt.clientY - g_canvas.offsetTop;
    
    // If no button is being pressed, then bail
    var button = evt.buttons === undefined ? evt.which : evt.buttons;
    if (!button) return;
      
	
	checkPlayButton();

	//MUTE BUTTON (right top corner)
	checkMuteButton();
}


function checkPlayButton() {
	var value = util.onPlayButton(); 
	if( value.onButton && !g_startGame){
		g_startGame = true;
		//g_audio.themeSong.playOnVolume(g_audio.themeSong.lowVolume);
		//muteAll();
		//setAllVolume();
		resetAllAudio();
		g_audio.themeGamePlay.playOnVolume(g_audio.themeGamePlay.lowVolume);
		
	}
}

function checkMuteButton() {

	var x = g_canvas.width-30;
	var y = 10;
	
	var width = 16;
	var height = 25;
	
	console.log("g_mouseX: " + g_mouseX);
	console.log("g_mouseY: " + g_mouseY);
	
		
	if(util.isMouseInRec(x, y, width, height))
	{
		
		console.log("hallllllooooostína");
		
		var mute = g_audio.themeSong.mute;
		
		console.log("mute: " + mute);
		mute = !mute;
		
		
		muteTrigger(mute);
		
		g_audio.themeSong.mute = mute;
		
		
		console.log("mute: " + mute);
	}
}


// Handle "down" and "move" events the same way.
//window.addEventListener("mousedown", handleMouse);
window.addEventListener("onclick", handleMouse);
window.addEventListener("mousemove", handleMouse);
