const socket = io();
const canvas = new Canvas();
const gui = new Gui();
canvas.init();

local_data = [];
current_obj = -1;
colors = ['rgba(4, 255, 0, ', 'rgba(255, 213, 0,', 'rgba(255, 0, 26,', 'rgba(255, 0, 153,' ,'rgba(144, 0, 255,','#6eff00' ,'#0fd','#04ff00' ,'#ffa600'];
function getColor(food, maxFood, lifeTime, maxLifeTime, family){
    // console.log(family)
    var r = 255  - (family * 20);
    var g = 255  - (family * 20);
    var b = family * 20;
    var a = 1 - lifeTime/maxLifeTime;
    // console.log(`rgba(${r}, ${g}, ${b}, ${a})`)
    return `${colors[family]}${a})`;
}

let iterations = 0;
socket.emit('request_data')
socket.on('request_data', data => {
    canvas.clr();
    if(data){
        for(x in data.cells){

            cell = data.cells[x];
            if(cell){
                if(cell.indx == current_obj){

                    canvas.arc(cell.x,cell.y, cell.r,getColor(cell.food, cell.maxFood, cell.lifeTime, cell.maxLifeTime, cell.family), true, 'red', cell.family);
                }else{
                    canvas.arc(cell.x,cell.y, cell.r,getColor(cell.food, cell.maxFood, cell.lifeTime, cell.maxLifeTime, cell.family), true, getColor(cell.food, cell.maxFood, cell.lifeTime, cell.maxLifeTime, cell.family), cell.family);

                }
            }

        }
        for(x in data.food){
            food = data.food[x];
            if(food)
            canvas.rect(food.x, food.y, 1, 1, food.color)
        }
        canvas.fps(data.info);
        // document.getElementById('log').innerHTML = data.info;
    }
        // canvas.arc(data.x, data.y, data.r);
    local_data = data;
    if(current_obj >= 0){
        socket.emit('get_info', {x:0,y:0}, current_obj, false);
    }
    render();
});

socket.on('get_food', data => {
    console.log(data);
})
socket.on('avg_data', data => {
    // console.log(data);
    chart.data[0].dataPoints.push({x:iterations, y: data.foodCost});
    chart.data[1].dataPoints.push({x:iterations, y: data.maxFood});
    chart.data[2].dataPoints.push({x:iterations, y: data.maxSize});
    chart.data[3].dataPoints.push({x:iterations, y: data.v});
    chart.data[4].dataPoints.push({x:iterations, y: data.cells});


    iterations++;
    chart.render();
})


socket.on('get_info', data => {
    if(data && data.indx >= 0){

        current_obj = data.indx;
        // document.getElementById('log').innerHTML = JSON.stringify(data);
        gui.renderCell(data);
    }else{
        current_obj = -1;
        gui.renderCell(false);
    }
    // console.log(data);
   
})

function changeSpeed(val){
    socket.emit('change_speed', val);
}

function getTotalFood(){
    socket.emit('get_food');
}

function render(){
    socket.emit('test');
}


document.getElementById('game_speed').onchange = function(){
    changeSpeed(this.value);
}
document.getElementById('rendering').onchange = function(){
    if(this.checked){
        engine.rendering = true;
        engine.iterations = 1;
        document.getElementById('game_speed').value = 1;
    }else{
        engine.rendering = false;

    }
}

canvas.canvas.addEventListener('click', function(e){
    socket.emit('get_info', {x:e.pageX - this.offsetLeft, y:e.pageY - this.offsetTop}, -1, true, document.getElementById('rendering').checked);
    // console.log(e.pageX);
    // console.log(e.pageY);
})
render();



    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        title:{
            text: "Evolution progress"
        },
        axisX: {
            title: "Time",
        },
        axisY: {
            title: "Value",
            includeZero: false,
            suffix: " "
        },
        legend:{
            cursor: "pointer",
            fontSize: 16,
            itemclick: toggleDataSeries
        },
        toolTip:{
            shared: true
        },
        data: [{
            name: "food cost",
            type: "spline",
            showInLegend: true,
            dataPoints: [
                
            ]
        },{
            name: "maxFood",
            type:"spline",
            showInLegend:true,
            dataPoints:[

            ]
        },{
            name:"maxSize",
            type:"spline",
            showInLegend:true,
            dataPoints:[

            ]
        }, {
            name:"speed",
            type:"spline",
            showInLegend:true,
            dataPoints:[],
        },
        {
            name:"cells",
            type:"spline",
            showInLegend:true,
            dataPoints:[],
        }
       ]
    });
    chart.render();
    
    function toggleDataSeries(e){
        if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        }
        else{
            e.dataSeries.visible = true;
        }
        chart.render();
    }
    
    

