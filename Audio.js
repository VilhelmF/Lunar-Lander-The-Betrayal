"use strict";

// HOW TO INSERT AND USE AUDIO
//		- insert into 'requiredSounds':
//			
//			nameOfSound  :  "path/nameOfFile.ogg"
//		
//
//		- Put anywhere in the code:
//
//			g_audio.nameOfSound.Play();



// ==============
// AUDIO OBJECT
// ==============


// Construct a "sound" from the given `audio`,
//
function Sound( audio ){

	this.sound=audio;
}


//count cloneNodes, prevent from 
//to large number of cloned sounds 
Sound.prototype.cloneNodes = 0;

//scale from 0.0 to 1.0
Sound.prototype.volume    = 1.0;

Sound.prototype.beginTime = 0;
Sound.prototype.endTime   = 0;

Sound.prototype.soundVolume = function( volume ){

	this.volume = volume;
};


// Play sound continuously 
//(play same sound multiple times at the same time)
//
Sound.prototype.Play = function (){

	//if this sound is still playing, 
	//we clone this sound and play it
		
	if(this.sound.currentTime > 0 && this.cloneNodes < 4)
	{
		this.cloneNodes++;
		this.sound.cloneNode().play();
	} 
	else
	{
		this.cloneNodes = 0;
		this.playSound();
	}
};


// Play sound continuously 
// (play one sound manytimes, but resets 
// when ever it is played again)
//
Sound.prototype.resetPlay = function (){

	this.reset();
	this.playSound();
};




// Play sound one after a another
//
Sound.prototype.playSound = function (){

	this.sound.play();
};


Sound.prototype.reset = function (){

	this.sound.currentTime = 0;
};








// ==============
// PRELOAD AUDIO
// ==============


//	AUDIO INPUTS
//
var requiredSounds = {
	
	//shipWarp	: "sounds/shipWarp.ogg",
	shipWarp	: "sounds/warp.mp3",
    //bulletFire	: "sounds/bulletFire.ogg",
	zappedSound : "sounds/bulletZapped.ogg",
	plantOnPlank: "sounds/plantOnPlank.mp3",
	//mountainSmash: "sounds/mountainSmash.mp3",
	rescue		: "sounds/rescue.mp3",
	//rescue		: "sounds/rescue2.mp3",
	laserCannon : "sounds/laser.mp3",
	bomb 		: "sounds/Bomb_Exploding-Sound_Explorer-68256487.mp3",
	//shipwarp 		: "sounds/warp.mp3",

};


var g_sounds = [];

function preLoadAudio() {

	soundsPreload(requiredSounds, g_sounds, audioPreloadDone);
}


// g_audio keeps track of all sounds
var g_audio   = [];

function audioPreloadDone() {
	
	for(var sound in g_sounds) {
		g_audio[sound] = new Sound(g_sounds[sound]);
	}
}

