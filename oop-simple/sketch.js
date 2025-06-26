let myPlant;
let myPlant2

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");
  myPlant = new Plant(200,200);
  // myPlant2  = new Plant(90,10);
}

function draw() {
  background(220);
  myPlant.grow();
  myPlant.display();
  // myPlant2.grow();
  // myPlant2.display();


}

class Plant{
  constructor(startX,startY){  //cookie cutter
    this.x = startX;
    this.y = startY;
    this.h = 100;
    this.c = color(20, random(255), 90);
    this.wPlant = random(50);
  }

  grow(){
    this.h += 1;
  }


  display(){
    push();
    translate(this.x, this.y);
    
    fill(this.c);
    rect(0,0 , this.wPlant, this.h);

    fill("red")
    // circle(0, 0, 5)
    // circle(50, 0, 5)
    // circle(50, 50, 5)
    pop();

  }
}