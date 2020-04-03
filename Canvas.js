class Canvas{

    constructor(){
    
    }
    init = function(w = 500, h = 500){
        this.w = w;
        this.h = h;
        this.createCanvas();
    }
    clr = function(){
        this.ctx.clearRect(0,0,this.w, this.h);
    }
    fps = function(frames){
        this.ctx.fillStyle = 'green';
        this.ctx.font = "20px Comic Sans MS";
        this.ctx.fillText(`fps: ${Math.floor(frames)}`, 10, 20);
        this.ctx.fillStyle = 'white';    
    }
    rect = function(x, y, width, height, color = 'black', fill = false){
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
        this.ctx.fillStyle = 'white';
    }
    arc = function(x, y, r, color="red", fill=false, border_color = 'black', family = 0){
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x,y,r,0, 2* Math.PI);
        if(fill){

            this.ctx.fill();
        }else{
        }
       
        this.ctx.strokeStyle = border_color;
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.fillStyle = 'white';
    }
    createCanvas = function(){
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.w;
        this.canvas.height = this.h;
        document.getElementById('container').appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
    }
    getContext = function(){
        return this.ctx;
    }
}