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

//var g_mute = false;

// ==============
// AUDIO OBJECT
// ==============


// Construct a "sound" from the given `audio`,
//
function Sound( audio, name){

	this.sound=audio;
	
	if(String(name).indexOf("theme") > -1)
	{ 
		this.themeSongConstruction(name);
	}
}

	
Sound.prototype.mute = false;

Sound.prototype.themeSongConstruction = function( name ){

	this.name = name;
	this.mute = false;
	this.highVolume = 1;
	this.lowVolume = 0.1;
	
};


//count cloneNodes, prevent from 
//to large number of cloned sounds 
Sound.prototype.cloneNodes = 0;

Sound.prototype.volume = 1;
Sound.prototype.storeVolume = 1;



Sound.prototype.beginTime = 0;
Sound.prototype.endTime   = 0;

//scale from 0.0 to 1.0
Sound.prototype.soundVolume = function( volume ){

	this.storeVolume = volume;
	this.sound.volume = volume;
};

Sound.prototype.muteIt = function( ){
	this.storeVolume = 0;
	this.sound.volume = 0;
};

// Play sound continuously 
//(play same sound multiple times at the same time)
//
Sound.prototype.Play = function (){
	
	//this.sound.volume = this.storeVolume;
	
	if( this.storeVolume !== 0 ){
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
	}
};


// Play sound continuously 
// (play one sound manytimes, but resets 
// when ever it is played again)
//
Sound.prototype.resetPlay = function (){
	
	var time = this.reset();
	this.playSound();
	
	return time;
};




// Play sound one after a another
//
Sound.prototype.playSound = function (){	
		this.sound.play();
};


Sound.prototype.reset = function (){
	var time = this.sound.currentTime;
	console.log("time: " + time);
	this.sound.currentTime = 0;
	this.sound.pause();
	return time;
};


Sound.prototype.playOnVolume = function ( volume ){

	var time = this.reset();
	
	this.soundVolume( volume );
	
	this.sound.currentTime = time;

	this.playSound();
};


Sound.prototype.playAt = function ( time, volume ){
	
	var temp = this.reset();
	
	this.sound.soundVolume( volume );
	
	this.sound.currentTime = time;
	
	this.sound.playSound();
	
};



//==========================
//GLOBAL FUNCITONS FOR AUDIO
//==========================

//All sounds volume get value zero
function muteAll() {
	//g_mute = true;

	for(var sound in g_audio) {
		g_audio[sound].muteIt();
	}
	
};

//Let all sounds get their volume  back
function setAllVolume() {
	//g_mute = false;
	
	for(var sound in g_audio) {
		
		var volume = g_audio[sound].volume;
		if(g_audio[sound].name === "themeSong") {
			//console.log("hallo" + g_audio[sound].lowVolume);
			volume = g_audio[sound].lowVolume;
		}	

		g_audio[sound].soundVolume( volume );
	}
}

function resetAllAudio(){

	for(var sound in g_audio) {
		g_audio[sound].reset();
	}

}



function muteTrigger( bool ){	
	if(bool){
		muteAll();
	}
	else
	{
		setAllVolume();
	}
}




// ==============
// PRELOAD AUDIO
// ==============


//	AUDIO INPUTS
//
var requiredSounds = {
	//GAMEPLAY SOUND
	shipWarp	 	: "sounds/warp.ogg",
	shipThrust	 	: "sounds/thrust.ogg",
	zappedSound  	: "sounds/bulletZapped.ogg",
	plantOnPlank 	: "sounds/plantOnPlank.ogg",
	rescue		 	: "sounds/rescue.ogg",
	citizenDie		: "sounds/citizenDie.ogg",
	laserCannon  	: "sounds/laser.ogg",
	
	//GAME SONGS
	themeSong 	 	: "sounds/themeSong.ogg",
	theme2 		 	: "sounds/Daft_Punk_-_Contact_Official_Audio_.ogg",
	theme4		 	: "sounds/themeGame.ogg",
	themeEnd		: "sounds/Walking_Into_A_Trap.ogg",
	themeWon		: "sounds/gameWon.ogg",
};


var g_sounds = [];

function preLoadAudio() {
		soundsPreload(requiredSounds, g_sounds, audioPreloadDone);
}


// g_audio keeps track of all sounds
var g_audio   = [];

function audioPreloadDone() {

		console.log("audioPreload ...");
		for(var sound in g_sounds) {
			g_audio[sound] = new Sound(g_sounds[sound], sound);
		}
		
		g_audio.theme2.soundVolume( 1 );
		g_audio.theme2.playSound();
}

