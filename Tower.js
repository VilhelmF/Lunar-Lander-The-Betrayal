


function Tower( tower ){

   /* for (var property in descr) {
        this[property] = descr[property];
    };*/
	
	
	this.tower = tower;

}


Tower.prototype = new Entity();

Tower.prototype.life = 100;


Tower.prototype.render(){
	console.log("testing render tower ...");
};



Tower.prototype.update(){
	console.log("testing render tower ...");
};