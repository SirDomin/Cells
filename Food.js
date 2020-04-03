const { getRng, getDistance } = require('./functions');

class Food{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.indx = 0;
        this.color = 'red'
        this.speedX = 1;
        this.speedY = 1;
        this.v = 0.5;
    }
    render(){
        // engine.canvas.rect(this.x, this.y, 1, 1, this.color)
    }
    onRemove(){
        
    }
    changeDir(){
        this.speedX = getRng(-1, 1);
        this.speedY = getRng(-1, 1);

        // console.log(this.speedX, this.speedY)
    }
    update(){
        // var cells = ;
        this.x += this.speedX * this.v;
        this.y += this.speedY * this.v;
        if(this.x < 0)this.speedX = 1;
        if(this.x > 500)this.speedX = -1;
        if(this.y < 0)this.speedY = 1;
        if(this.y > 500)this.speedY = -1;
        if(Math.random() < 0.05)this.changeDir();
        // for(var i in engine.cells){
        //     var cell = engine.cells[i];
        //     if(cell.food + 1 < cell.maxFood){
        //         var dist = getDistance(this.x, this.y, cell.x, cell.y);
        //         if(cell && dist < cell.r){
                  
        //             engine.feed(cell.indx, this.indx);
        //         }
        //     }
        //     //else if(cell && dist < cell.r * 3){
        //     //     this.speedX = cell.speedX;
        //     //     this.speedY = cell.speedY;
        //     // }
        // }
    }
}
module.exports = Food;