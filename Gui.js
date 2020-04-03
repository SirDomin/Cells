class Gui{
    constructor(){
       this.elem = document.getElementById('info');

    }   
    
    renderCell(data){
        
        this.elem.innerHTML = '';
        if(data ==false)return;
        this.elem.appendChild(this.lifetime(data));
        this.elem.appendChild(this.food(data));
        this.elem.appendChild(this.speed(data));
        this.elem.appendChild(this.size(data));
        this.elem.appendChild(this.foodCost(data));
        this.elem.appendChild(this.coords(data));
        this.elem.appendChild(this.index(data));

    }
    lifetime(data){
        var div = document.createElement('div');
        div.className = 'stats';
        div.innerHTML =  `<div>Czas życia: </div><div>${Math.floor(data.lifeTime)}/${Math.floor(data.maxLifeTime)}</div>`;
        return div;
    }
    food(data){
        var div = document.createElement('div');
        div.className = 'stats';
        div.innerHTML =  `<div>Jedzenie </div><div>${data.food}/${data.maxFood}</div>`;
        return div;
    }
    speed(data){
        var div = document.createElement('div');
        div.className = 'stats';
        div.innerHTML =  `<div>Speed </div><div>${data.v}</div>`;
        return div;
    }
    size(data){
        var div = document.createElement('div');
        div.className = 'stats';
        div.innerHTML =  `<div>MaxSize </div><div>${data.maxSize}</div>`;
        return div;
    }
    foodCost(data){
        var div = document.createElement('div');
        div.className = 'stats';
        div.innerHTML =  `<div>Koszt jedzenia </div><div>${data.foodCost}</div>`;
        return div;
    }
    coords(data){
        var div = document.createElement('div');
        div.className = 'stats';
        div.innerHTML =  `<div>x: ${Math.floor(data.x)}</div><div>y: ${Math.floor(data.y)}</div>`;
        return div;
    }
    index(data){
        var div = document.createElement('div');
        div.className = 'stats';
        div.innerHTML =  `<div>Index: </div><div>${Math.floor(data.indx)}</div>`;
        return div;
    }
}