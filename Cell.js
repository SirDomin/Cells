const { getRng, getDistance } = require('./functions');
class Cell{
    constructor(x,y,r,family ='basic', food = 100, maxLifeTime = 2000, v = 3, growthRate = 0.008, maxSize = 10, foodCost = 0.05, minSize = 4, aggro = 0.01){
        this.x = x;
        this.y = y;
        this.family = family;
        this.r = r;
        this.food = food;
        this.maxLifeTime = maxLifeTime ;
        this.lifeTime = 0;
        this.foodCost = foodCost * getRng(0.5,1.5);
        this.speedX = 1;
        this.aggro = aggro * getRng(0.95, 1.05);
        this.speedY = 1;
        this.totalFood = food;
        this.minSize = minSize * getRng(0.8, 1.2);
        this.v = v * getRng(0.5, 1.5);
        this.maxSize = maxSize * getRng(0.8,1.1);
        this.maxFood = 10 * this.maxSize;
        this.growthRate = growthRate * getRng(0.5, 1.5);
        this.type = 'cell';
        if(Math.random() < 0.01){
            this.evolve();
        }
        if(Math.random() < 0.01){
            this.mutation();
        }
    }
    evolve(){
        // return;
        for(var i = 0; i < 3; i++){
            this.mutation();
        }
    }
    createChild(){
        // if(Math.random() > 0.01)return;
        // console.log('food: ',this.totalFood);
        this.food = Math.floor(this.food / 2);
        // this.totalFood -= (this.food + 1);
        var f = this.totalFood - this.food;
        this.totalFood = f;
        this.r = this.r/2;
        this.childIndx = engine.addCell(new Cell(this.x + getRng(-10, 10), 
            this.y + getRng(-10, 10), 
            this.r, 
            this.family,
            this.food, 
            this.maxLifeTime * getRng(0.9, 1.1), 
            this.v * getRng(0.9, 1.1), 
            this.growthRate * getRng(0.6,1.2)),
            this.maxSize * getRng(0.9,1.1),
            this.minSize,
            this.aggro
            );
        
        // console.log('food-new: ',this.food * 2);
        // console.log('new child', this.childIndx);
    }
    mutation(){
        // return;
        var tmp = Math.random();
        var value = getRng(0.8, 1.2);
        if(tmp < 0.1){
            this.v *= value;
            return;
        }
        if(tmp < 0.2){
            this.maxSize *= value;
            return;
        }
        if(tmp < 0.3){
            this.maxFood *= value;
            return;
        }
        if(tmp < 0.4){
            this.growthRate *= value;
            return;
        }
        if(tmp < 0.5){
            this.foodCost *= value;
            return;
        }
        if(tmp < 0.6){
            this.maxLifeTime *= value;
        }

    }
    getColor(){
        var r = 255  - (255 * this.food/this.maxFood);
        var g = 255 * this.food/this.maxFood;
        var b = 50;
        var a = 1 - this.lifeTime/this.maxLifeTime;
        // console.log(`rgba(${r}, ${g}, ${b}, ${a})`)
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }
    render(){
        engine.canvas.arc(this.x,this.y, this.r,this.getColor(), true);
    }
    changeDir(){
        this.speedX = Math.random() * 2 -1;
        this.speedY = Math.random() * 2 -1;

        // console.log(this.speedX, this.speedY)
    }
    feed(){
        if(this.food - 1 >= this.maxFood )return false;
        this.food++;
        this.totalFood++;
        if(this.r < this.maxSize){

            this.r += 0.25;
        }
        return true;
    }
    move(){
        
        this.x += (this.speedX * this.v * (1-this.food / this.maxFood)) + (this.foodCost * 2) //- (this.maxFood / this.food);
        this.y += (this.speedY * this.v * (1 -this.food / this.maxFood)) + (this.foodCost *2 )//- (this.maxFood / this.food);
        for(var x in engine.cells){
            var c = engine.cells[x];
            if(c.family != this.family && c.indx != this.indx && getDistance(this.x, this.y, c.x, c.y) < this.r && this.r > c.r){

                // engine.gameObjects[c.indx].onRemove();
                engine.removeCell(c.indx);
                // this.changeDir();
            }
        }
        if(this.x < 0){
            // this.changeDir();
            this.speedX = 1;
            this.speedY = 1;
            this.x += 10;
            this.y = Math.ceil(this.y + 2);
            
        }
        if(this.y < 0){
            this.speedY = 1;
            this.speedY = 1;
            this.x = Math.ceil(this.x + 2);
            this.y += 10;
            
        }
        if(this.x > 500 || this.y > 500){
            this.x = Math.floor(this.x - 1);
            this.y = Math.floor(this.y - 1);
            this.changeDir();
            
        }

    }
    onRemove(){
        // console.log(this.totalFood, 'added');
        for(var i = 0; i < this.totalFood ; i++){
            var x = getRng(this.x - this.r, this.x + this.r);
            var y = getRng(this.y - this.r, this.y + this.r);
            if(x < 1) x = 10;
            if(y < 1) y = 10;
            // x = this.x;
            // y = this.y;
            engine.addFood(x,y);
        }
    }
    dropFood(){

    }
    update(){
        this.lifeTime ++;
        // this.food = this.foodCost * this.v;
        if(this.food > 0){

            this.food -= this.foodCost * this.v / 5;
            this.dropFood();
            if(this.r > this.minSize){

                this.r -= 0.01;
            }
            // this.food = this.food * 100 / 100;
        }else{
            engine.removeCell(this.indx);

        }
        if(Math.random() < 0.01)this.changeDir();
        this.move();
        if(this.lifeTime > this.maxLifeTime){
            /** smierc */
            engine.removeCell(this.indx);
        }else{
            if(this.lifeTime > this.maxLifeTime *0.5 && this.lifeTime < this.maxLifeTime * 0.8 ){
                if(this.food * 1.1 > this.maxFood)this.createChild();
            }
        }
        this.collision();
        // document.getElementById('log').innerHTML = `food: ${Math.floor(this.food)}/${this.maxFood}`;

    }
    collision(){
        if(this.food < this.maxFood - 1){
            for(var i in engine.gameObjects){
                var food = engine.gameObjects[i];
                var dist = getDistance(this.x, this.y, food.x, food.y);
                if(food && dist < this.r){
                    engine.feed(this.indx, food.indx);
                    return;
                }
                // else if(food && dist < this.r * 3){
                //     food.speedX = this.speedX;
                //     food.speedY = this.speedY;
                // }
            }
        }
         
    }
}
module.exports = Cell;