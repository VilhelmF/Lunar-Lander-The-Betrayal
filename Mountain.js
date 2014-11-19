//===============
// MOUNTAIN STUFF
//===============

function Mountain ( mountain ) {
	
	this.mountain = mountain;
	
	this.width  = mountain.width;
	this.height = mountain.height;
	
	this.setPosition();
};


Mountain.prototype.cx;
Mountain.prototype.cy;


Mountain.prototype.setPosition = function() {

	this.cx = 0;
	this.cy = g_canvas.height - this.height;
};


Mountain.prototype.drawAt = function(ctx) {
	ctx.drawImage(this.mountain, this.cx, this.cy);
};




// =====================================
// PRELOAD MOUNTAINS AND BACKGROUNDCOLOR
// =====================================

var requiredMountains = {

	//small mountains
	mount_1_1 : "sprites/Mountains/Mountain-29.png",
	mount_1_2 : "sprites/Mountains/Mountain-30.png",
	mount_1_3 : "sprites/Mountains/Mountain-31.png",
	mount_1_4 : "sprites/Mountains/Mountain-32.png",
	
	mount_2_1 : "sprites/Mountains/Mountain-25.png",
	mount_2_2 : "sprites/Mountains/Mountain-26.png",
	mount_2_3 : "sprites/Mountains/Mountain-27.png",
	mount_2_4 : "sprites/Mountains/Mountain-28.png",
	
	mount_3_1 : "sprites/Mountains/Mountain-21.png",
	mount_3_2 : "sprites/Mountains/Mountain-22.png",
	mount_3_3 : "sprites/Mountains/Mountain-23.png",
	mount_3_4 : "sprites/Mountains/Mountain-24.png",
	
	//big mountains
	mount_4_1 : "sprites/Mountains/Mountain-17.png",
	mount_4_2 : "sprites/Mountains/Mountain-18.png",
	mount_4_3 : "sprites/Mountains/Mountain-19.png",
	mount_4_4 : "sprites/Mountains/Mountain-20.png"
}; 

var requiredBackgrounds = {
	
	level1   : "sprites/background_color/mistyBrown-06.png",
	gameOver : "sprites/backgroundcolor/gameOver-50.png", 
	gameWon	 : "sprites/backgroundcolor/gameStart-42.png"
};


var g_mountains   = [];
var g_backgrounds = [];

function preLoadMountain() {
	imagesPreload(requiredMountains, g_mountains, mountainPreloadDone);
}

function preLoadBackground() {
	imagesPreload(requiredBackgrounds, g_backgrounds, backgroundPreloadDone);
}




//  g_mountain keeps track of all mountains
var g_mountain   = [];
var g_background = [];

function mountainPreloadDone() {
	
	var show = findRandomMountains();	
	var i = 0;
	for(var mountain in g_mountains) {
		if( show.shows[i]) {
			g_mountain[mountain] = new Mountain(g_mountains[mountain]);
		}
		i++;
	}
	
}

function backgroundPreloadDone() {
	
	for(var background in g_backgrounds) {
		g_background[background]=new Sprite(g_backgrounds[background]);	}
}


// Pick random background mountains from each stage.
//
function findRandomMountains() {

	var random = [
		
		Math.floor(util.randRange(1,4)), //1
		Math.floor(util.randRange(1,4)), //2
		Math.floor(util.randRange(1,4)), //3
		Math.floor(util.randRange(1,4))	 //4
	];
	
	var show = [
		
		false, //s1_1 
		false, //s1_2			//SMALL MOUNTAINS
		false, //s1_3
		false, //s1_4
		
		false, //s2_1
		false, //s2_2
		false, //s2_3
		false, //s2_4
		
		false, //s3_1
		false, //s3_2
		false, //s3_3
		false, //s3_4

		false, //s4_1
		false, //s4_2
		false, //s4_3			// BIG MOUNTAINS
		false  //s4_4
	];
	
	// hold the ID of background Mountains 
	// that is true in array 'show'
	var track = [];
	
	var j=0;
	var i=1;
	var t=0;
	
	for(var r in random){
		for(i=1; i<5; i++, j++){
			
			if(random[r] == i){
				show[j] = true;
				track[t] = j;
				t++;
			}
		}
	}
	
	return {
				shows: show, 
				track: track //Useless from know
			};
	
}


