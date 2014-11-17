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
    
	if(!g_startGame){
		g_audio.themeSong.playOnVolume(0.1);
	}
	
	g_startGame = true;
	
	
	var beginXLimit = g_canvas.width-30;
	var endXLimit	= g_canvas.width-10;
	
	var beginYLimit = 10;
	var endYLimit	= 30;


	if
	( 	
		util.isBetween( g_mouseX, beginXLimit, endXLimit ) &&
		util.isBetween( g_mouseY, beginYLimit, endYLimit )
	)
	{
		var mute = g_audio.themeSong.mute;
		
		mute = !mute;
		
		if(mute){
			g_audio.themeSong.soundVolume(0);
		}
		else
		{
			g_audio.themeSong.soundVolume(g_audio.themeSong.lowVolume);
		}
		
		g_audio.themeSong.mute = mute;
	}
	
	//g_audio.themeSong.playSound();
//    entityManager.yoinkNearestShip(g_mouseX, g_mouseY);
}

// Handle "down" and "move" events the same way.
window.addEventListener("mousedown", handleMouse);
window.addEventListener("mousemove", handleMouse);
