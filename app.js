
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const path = require('path')
const io = require('socket.io')(server)
app.use(express.static(path.join(__dirname, '/')))

const Food = require('./Food');
const Cell = require('./Cell');

const Engine = require('./Engine');

const { getRng, getDistance } = require('./functions');

const port = process.env.PORT || 3000
server.listen(port, () => {
    console.log('listening on: *', port);
    // mainFunc();
})

let fps = 0;


main_client = null;
io.on('connection', socket => {
    console.log('connected');
    socket.on('disconnect', () => {
        main_client = null;
    })
    socket.on('test', ()=>{
        // gameLoop();
        sendRequest();

    })
    socket.on('get_food', () => {
        getTotalFood();
    })
    socket.on('change_speed', (data)=>{
        changeSpeed(data);
    })
    socket.on('get_info', (data, obj, force, follow = false)=>{
        renderStats(data, obj, force, follow);
        // console.log(obj);
    });
    main_client = socket;

})
function getAvgData(){
    var data = {
        cells: engine.cells.length,
    };
    var avg = {
        r:0,
        food:0,
        maxLifeTime:0,
        foodCost:0,
        minSize:0,
        v:0,
        maxSize:0,
        maxFood:0,
        growthRate:0,
    }
    for(let x in engine.cells){
        var c = engine.cells[x];
        avg.r+=c.r,
        avg.food+=c.food,
        avg.maxLifeTime+=c.maxLifeTime,
        avg.foodCost+=c.foodCost,
        avg.minSize+=c.minSize,
        avg.v+=c.v,
        avg.maxSize+=c.maxSize,
        avg.maxFood+=c.maxFood,
        avg.growthRate+=c.growthRate
    };
    for(x in avg){
        data[x] = (avg[x] / data.cells);
    }
    main_client.emit('avg_data', data);

}
lastRequest = -1;
function renderStats(data, indx, force = false, follow_child){
  
    mx = data.x;
    my = data.y;
    retData = {};
    var tmp = -1;

    if(force){
        
        for(x in engine.cells){
            if(getDistance(engine.cells[x].x,engine.cells[x].y, mx, my ) < engine.cells[x].r){
              retData = engine.cells[x];
              tmp = x;
              lastRequest =x;
            }
        }
        if(tmp < 0){
            retData = {};
            lastRequest = -1;
        }
    }else{
        if(lastRequest >= 0){
            if(engine.cells[lastRequest]){
                if(engine.cells[lastRequest].childIndx){
                    retData = engine.cells[engine.cells[lastRequest].childIndx];
                    lastRequest = engine.cells[lastRequest].childIndx;
                    // console.log(lastRequest);
                }else{
    
                    retData = engine.cells[lastRequest];
                }
            }else{
                retData = {};
            }
            
        }
    }
    // if(force)
    // console.log(retData);
    main_client.emit('get_info', retData);

}

function changeSpeed(data){
    engine.iterations = data;
}


function getTotalFood(){
    var data = 0;
    var cellsFood = 0;
    for(x in engine.cells){
        data += engine.cells[x].totalFood;
        cellsFood+=engine.cells[x].totalFood;
    }
    data += engine.gameObjects.length;
    if(data > 3250){
        data = {
            total: data,
            cells:cellsFood / engine.cells.length,
            food:engine.gameObjects.length,
        }
    }
    main_client.emit('get_food', data);
}

function sendRequest(){
    if(main_client){

        main_client.emit('request_data', {cells: engine.cells, food:engine.gameObjects, info: fps});
        
    }
    // engine.addObj(new Food(1,1));


}
setInterval(()=>{
    if(main_client)
        getAvgData();
    
}, 5000);
function resetEvolution(){
    engine.iterations = 1;
    engine.gameObjects = [];
    // engine.
}

engine = new Engine();

engine.addCell(new Cell(10,10,10, 0));
engine.addCell(new Cell(490,10,10, 1));
engine.addCell(new Cell(10,490,10, 2));
engine.addCell(new Cell(490,490,10, 3));
for(var i = 0; i < 3000; i++){

    engine.addObj(new Food(getRng(0, 500), getRng(0, 500)), true);
}
let iters = 0;


// mainFunc = function(){

//     // mainFunc();
//     sendRequest(fps);
//     if(engine.main()){
//         setTimeout(mainFunc, 10);

//     }
// }

// engine.main();
var lastLoop = new Date();
setInterval(() => {
// function gameLoop(){
    engine.main()
    var thisLoop = new Date();
    fps = 1000 / (thisLoop - lastLoop);
    lastLoop = thisLoop;
// }

}, 10);
