const Food = require('./Food')

class Engine{

    constructor(){
        // this.canvas = new Canvas(500, 500);
        // this.canvas.init();
        this.gameObjects = [];
        this.cells = [];
        this.iterations = 1;
        this.removedIndexes = [];
        this.rendering = true;

    }

    addObj(obj, tmp = false){
        // if(tmp == false)return;
        // if(this.gameObjects.length > 3000) return;
        // this.gameObjects.push(obj);
   
            // this.gameObjects[this.gameObjects.length - 1].indx = this.gameObjects.length - 1;
            for(var i =0; i < this.gameObjects.length; i++){
                if(this.gameObjects[i] == undefined){
                    this.gameObjects[i] =obj;
                    this.gameObjects[i].indx = i;
                    return i;
                }
            }
            this.gameObjects.push(obj);
            this.gameObjects[this.gameObjects.length - 1].indx = this.gameObjects.length - 1;
            return this.gameObjects.length -1;
    }
    addCell(obj){
        for(var i =0; i < this.cells.length; i++){
            if(this.cells[i] == undefined){
                this.cells[i] =obj;
                this.cells[i].indx = i;
                return i;
            }
        }
        this.cells.push(obj);
        this.cells[this.cells.length - 1].indx = this.cells.length - 1;
        return this.cells.length -1;

    }
    removeCell(indx){
        if(this.cells[indx]){
            this.cells[indx].onRemove();
            delete this.cells[indx];

        }else{
            // console.log('not removed');
        }

    }
    removeObject(indx){
        if(!this.gameObjects[indx]){
            console.log('not removed',indx);
            return;
        }
            delete this.gameObjects[indx];
            // this.gameObjects[indx].onRemove();

        // delete this.gameObjects[indx];
        // this.removedIndexes.push(indx);
        // this.gameObjects = this.gameObjects.filter(function (el) {
        //     return el != undefined || null;
        //   });
    }
    feed(indx, food_index){
        if(this.cells[indx]){
            if(this.gameObjects[food_index] && this.cells[indx].feed()){
                this.removeObject(food_index);
            }

        }

    }
    update() {
        for(var x in this.gameObjects){
            if(this.gameObjects[x])
            this.gameObjects[x].update();
        }
        for(var x in this.cells){
            this.cells[x].update();
        }
    }

    render() {
        this.canvas.clr();
        for(var x in this.gameObjects){
            if(this.gameObjects[x])
            this.gameObjects[x].render();
        }
        for(var x in this.cells){
            this.cells[x].render();
        }

    }
    addFood(x, y){
        this.addObj(new Food(x, y));
    }
    main(){

        for(var x = 0; x < this.iterations; x++){

            this.update();
        }
        
    }
}
module.exports = Engine;