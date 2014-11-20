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
function Sound( audio, name){
	this.sound=audio;

	if( String(name).indexOf("theme") > -1 ||
		String(name).indexOf("Thrust"))
	{ 
		this.themeSongConstruction(name);
	}
}
	
Sound.prototype.mute = false;

Sound.prototype.themeSongConstruction = function( name ){
	this.name = name;
	this.mute = false;
	this.highVolume = 1;
	if(String(name).indexOf("rust")){
		this.lowVolume = 0.3;
	}
	else{
		this.lowVolume = 0.1;
	}
};


//count cloneNodes, prevent from 
//to large number of cloned sounds 
Sound.prototype.cloneNodes = 0;

Sound.prototype.volume = 1;
Sound.prototype.storeVolume = 1;

//volume scale from 0.0 to 1.0
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
	if( this.storeVolume !== 0 ){
		//if this sound is still playing, 
		//we clone this sound and play it
		if(this.sound.currentTime > 0 && this.cloneNodes < 2)
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
	for(var sound in g_audio) {
		g_audio[sound].muteIt();
	}
	
};

//Let all sounds get their volume  back
function setAllVolume() {
	for(var sound in g_audio) {
		
		console.log("thrust1 ?: " + String(sound));
		var volume = g_audio[sound].volume;
		if( sound.indexOf("theme") >= 0 ||
			sound.indexOf("rust") >= 0) {
			console.log("thrust2 ?: " + String(sound));
			volume = g_audio[sound].lowVolume;
		}	
		g_audio[sound].soundVolume( volume );
	}
}

//all audio file will reset (start on time zero)
function resetAllAudio(){
	for(var sound in g_audio) {
		g_audio[sound].reset();
	}
}

//Trigger when ever bool=true every
//sound be mute, otherwise all sound
//volume get their old volume and
//duration time
function muteTrigger( bool ){	
	if(bool){
		muteAll();
	}
	else
	{
		setAllVolume();
	}
}


//Plays theme sound in wich game sate is on
function playThemeSong() {
	var vol = g_audio.themeGame.lowVolume;
	
	if( startScreen.isVisible() && !g_gameOver && !g_gameWon)
	{
		g_audio.themeStart.soundVolume(vol);
		g_audio.themeStart.playSound();
	}
	else if(g_startGame && !g_gameOver && !g_gameWon)
	{	
		g_audio.themeGame.soundVolume(vol);
		g_audio.themeGame.playSound();
	}
	else if(g_gameOver && !g_startGame && !g_gameWon)
	{
		g_audio.themeEnd.soundVolume(vol);
		g_audio.themeEnd.playSound();
	}
	else if(g_gameWon && !g_gameOver && !g_startGame){
		g_audio.themeWon.soundVolume(vol);
		g_audio.themeWon.playSound();
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
	getBox 	 		: "sounds/fuelPackage.ogg",
	
	//GAME SONGS
	themeStart	 	: "sounds/themeStart.ogg",
	themeGame	 	: "sounds/themeGame.ogg",
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
		playThemeSong();
}

