const cellSize = 20;
const mapSize = 20;
var x = 0, n = 0;

function System(canvas) {
  this.map = [];
  this.id = [];
  this.canvas = canvas;
}

System.prototype.print = function(){
  this.canvas.width = this.canvas.width;
  var cx = this.canvas.getContext("2d");

  for(var i = 0; i < mapSize*mapSize; i++){
    switch (this.map[i]){
      case 0:
        cx.fillStyle = "#000000";
        break;
      case 1:
        cx.fillStyle = "#ffffff";
        break;
      case 2:
        cx.fillStyle = "#0099ff";
    }
    cx.fillRect((i%mapSize)*cellSize, Math.floor(i/mapSize)*cellSize, cellSize, cellSize);
    cx.stroke();
  }
}

System.prototype.root = function(i){
  while (!(i == this.id[i])){
    this.id[i] = this.id[this.id[i]];
    i = this.id[i];
  }
  return i;
}

System.prototype.changeToEmpty = function(i){
  //array of empty cells nearby
  var emp = [];
  //array of accessible cells nearby
  var acc = [];
  if (i >= mapSize && this.map[i-mapSize] != 0){
    if (this.map[i-mapSize] == 1) emp.push(i-mapSize);
    if (this.map[i-mapSize] == 2) acc.push(i-mapSize);
  }
  if ((i % mapSize) < (mapSize-1) && this.map[i+1] != 0){
    if (this.map[i+1] == 1) emp.push(i+1);
    if (this.map[i+1] == 2) acc.push(i+1);
  }
  if (i < mapSize*(mapSize-1) && this.map[i+mapSize] != 0){
    if (this.map[i+mapSize] == 1) emp.push(i+mapSize);
    if (this.map[i+mapSize] == 2) acc.push(i+mapSize);
  }
  if ((i % mapSize) > 0 && this.map[i-1] != 0){
    if (this.map[i-1] == 1) emp.push(i-1);
    if (this.map[i-1] == 2) acc.push(i-1);
  }

  // no empty or accessible nearby
  if (!(emp.length || acc.length)){
    if (i < mapSize) this.map[i] = 2;
    else             this.map[i] = 1;
  }
  else {
    //roots of empty cells
    var empR = [];
    for (var k = 0; k < emp.length; k++) {
      empR[k] = this.root(emp[k]);
    }
    //roots of accessible cells
    var accR = [];
    for (var k = 0; k < acc.length; k++) {
      accR[k] = this.root(acc[k]);
    }

    var mainRoot;
    if(acc.length) mainRoot = accR[0];
    else           mainRoot = empR[0];

    for (var k = 0; k < empR.length; k++) {
      this.id[empR[k]] = mainRoot;
    }
    for (var k = 0; k < accR.length; k++) {
      this.id[accR[k]] = mainRoot;
    }
    this.id[i] = mainRoot;


    //all changes to accessible
    if (acc.length || i < mapSize){
      for(var k = 0; k < mapSize*mapSize; k++){
        if(this.root(k) == mainRoot)
          this.map[k] = 2;
      }
    }

    if (acc.length || i < mapSize)
      this.map[i] = 2;
    else
      this.map[i] = 1;
  }
}

System.prototype.addEmptyCell  = function(){
  var filled = [];
  for(var i = 0; i < mapSize*mapSize; i++){
    if (this.map[i] == 0) filled.push(i);
  }
  if (!filled.length)
    this.finish_();
  var choosed = Math.floor(Math.random()*filled.length);
  this.changeToEmpty(filled[choosed]);
}

System.prototype.start = function(){
  //map initializing
  for(var i = 0; i < mapSize*mapSize; i++){
    //0 - filled(black), 1 - empty(white), 2 - empty and accessible from the top(blue)
     this.map[i] = 0;
     this.id[i] = i;
  }
  //top imaginary cell
  this.map[mapSize*mapSize] = "2";
  this.id[mapSize*mapSize] = mapSize*mapSize;
  //bottom imaginary cell
  this.map[mapSize*mapSize+1] = "1";
  this.id[mapSize*mapSize+1] = mapSize*mapSize+1;
  for(var i = 0; i < mapSize; i++){
    this.id[i] = mapSize*mapSize;
  }
  for(var i = mapSize*(mapSize-1); i < mapSize*mapSize; i++){
    this.id[i] = mapSize*mapSize+1;
  }

  var process = setInterval(function () {
    x++;
    if (this.root(mapSize*mapSize) == this.root(mapSize*mapSize+1)) {
      clearInterval(process);
      this.finish_();
    }
    this.addEmptyCell();
    this.print();
  }.bind(this), 0);
}

System.prototype.finish_ = function(){
  n++;
  $('h1.number').text(x/(n*mapSize*mapSize));
  this.start();
}

var canvas = document.getElementsByTagName("canvas")[0];
//canvas initializing
canvas.setAttribute("width", mapSize*cellSize);
canvas.setAttribute("width", mapSize*cellSize);
canvas.setAttribute("height", mapSize*cellSize);

var system = new System(canvas);
system.start();