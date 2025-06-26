/*
  Check our the GOAL and the RULES of this exercise at the bottom of this file.
  
  After that, follow these steps before you start coding:

  1. rename the dancer class to reflect your name (line 35).
  2. adjust line 20 to reflect your dancer's name, too.
  3. run the code and see if a square (your dancer) appears on the canvas.
  4. start coding your dancer inside the class that has been prepared for you.
  5. have fun.
*/

let dancer;


let NUM_OF_PARTICLES = 30; // Decide the initial number of particles.
let particles = [];

function setup() {
  // no adjustments in the setup function needed...
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-canvas-container");

  // ...except to adjust the dancer's name on the next line:
  dancer = new GisDancer(width / 2, height / 2);

  // generate particles
  // a
  //colorMode(HSB);

}

function draw() {
  // you don't need to make any adjustments inside the draw loop
  background(0);
  drawFloor(); // for reference only

  dancer.update();
  dancer.display();

  // update and display
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    p.update();
    p.display();
    p.checkOnScreen();
  }


  // if(mouseIsPressed == true){
  //   for(let i = 0; i < NUM_OF_PARTICLES; i++){
  //   particles.push(new Particle (mouseX, mouseY));
  // }
  // }



}

// You only code inside this class.
// Start by giving the dancer your name, e.g. LeonDancer.
class GisDancer {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    // add properties for your dancer here:
    //this.xOffset = 0;
    this.yOffset = 0;
    this.ySpeed = 0;
    this.armWiggleY = 0;
    this.gravity = 0.6;
    this.armAngle = 0;
    this.armMoving = false;
    this.lastKeyTime = 0;
  }
  update() {
    // update properties here to achieve
    // your dancer's desired moves and behaviour
    this.yOffset += this.ySpeed;
    this.ySpeed += this.gravity;

    // Stop at "floor"
    if (this.yOffset > 0) {
      this.yOffset = 0;
      this.ySpeed = 0;
    }

    // If arm is moving, rotate
    if (this.armMoving) {
      this.armWiggleY = sin(frameCount * 0.3)* 10;
    } else{
      this.armWiggleY = 0;
    }

    // Stop arm movement after 1 second
    if (millis() - this.lastKeyTime > 1000) {
      this.armMoving = false;
    }



  }
  display() {
    // the push and pop, along with the translate 
    // places your whole dancer object at this.x and this.y.
    // you may change its position on line 19 to see the effect.

        // ******** //
    // ⬇️ draw your dancer from here ⬇️
    push();
    translate(this.x, this.y);
   
    //Body 
    noStroke();
    fill(255,62,165); 
    ellipse(0, 0, 80, 100); 

    fill(255); 
    ellipse(0, 10, 40, 60);



    // Head
    fill(255,62,165);
    ellipse(0, -60, 60, 60); 

    // Eyes
    fill(255);
    ellipse(-12, -65, 15, 15);
    ellipse(12, -65, 15, 15);
    fill(0);
    ellipse(-12, -65, 5, 5);
    ellipse(12, -65, 5, 5);


    // Mouth
    fill(255, 150, 0);
    triangle(0, -55, -5, -50, 5, -50);

    // Left arm
    push();
    translate(-40, -30 + this.armWiggleY);
    rotate(radians(this.armAngle*0.5));
    fill("yellow");
    ellipse(-40, -30, 40, 15);
    pop();

    // Right arm
    push();
    translate(40, -30 + this.armWiggleY);
    rotate(radians(this.armAngle));
    fill("yellow");
    ellipse(40, -30, 15, 40);
    pop();

    //Left foot
    push();
    translate(-35, 45);
    fill("yellow");
    ellipse(0, 0, 30, 40);
    pop();

    //Right foot
    push();
    translate(35, 45);
    fill("yellow");
    ellipse(0, 0, 30, 40);
    pop();

   

    // ⬆️ draw your dancer above ⬆️
    // ******** //

    // the next function draws a SQUARE and CROSS
    // to indicate the approximate size and the center point
    // of your dancer.
    // it is using "this" because this function, too, 
    // is a part if your Dancer object.
    // comment it out or delete it eventually.
    this.drawReferenceShapes()

    pop();
  }
  triggerA(){
    // this function will be called when the "a" key is pressed.
    // your dancer should perform some kind of reaction (i.e. make a special move or gesture) 
    this.armMoving = true;
    this.lastKeyTime = millis();
  }
  triggerD(){
    // this function will be called when the "d" key is pressed.
    // your dancer should perform some kind of reaction (i.e. make a special move or gesture) 
    this.ySpeed = -12;

  }
  drawReferenceShapes() {
    noFill();
    stroke(255, 0, 0);
    line(-5, 0, 5, 0);
    line(0, -5, 0, 5);
    stroke(255);
    rect(-100, -100, 200, 200);
    fill(255);
    stroke(0);
  }
}

/*
GOAL:
The goal is for you to write a class that produces a dancing being/creature/object/thing. In the next class, your dancer along with your peers' dancers will all dance in the same sketch that your instructor will put together. 

RULES:
For this to work you need to follow one rule: 
  - Only put relevant code into your dancer class; your dancer cannot depend on code outside of itself (like global variables or functions defined outside)
  - Your dancer must perform by means of the two essential methods: update and display. Don't add more methods that require to be called from outside (e.g. in the draw loop).
  - Your dancer will always be initialized receiving two arguments: 
    - startX (currently the horizontal center of the canvas)
    - startY (currently the vertical center of the canvas)
  beside these, please don't add more parameters into the constructor function 
  - lastly, to make sure our dancers will harmonize once on the same canvas, please don't make your dancer bigger than 200x200 pixels. 
*/

/*
Here are the key events that your dancer should react to in some way.
*/

function keyPressed(){
  if(key == "a"){
    dancer.triggerA()
  }else if(key == "d"){
    dancer.triggerD()
  }
}



class Particle {
  // constructor function
  constructor(startX, startY) {
    // properties (variables): particle's characteristics
    this.x = startX;
    this.y = startY;
    this.size = random(2, 10);

    this.speedX = random(5, 10); 
    this.speedY = random(-5, 10);
    
    //this.speedYoffset = 0;

    //this.noiseVal = 0;

    this.trsp = 255;
    this.gravity = 0.15;

    this.onScreen = true;

    this.c = color(random(360), 255, 255);
    
  }
  // methods (functions): particle's behaviors
  update() {
    // (add) 
    this.x+=this.speedX;
    this.y+=this.speedY;
    this.speedY+=this.gravity;
    
    this.trsp -= 50;

    // for(let i = 0; i < confettis.length; i++){
    //   this.speedX = (noise(i) * 0.01) * 10;
    // }

  }


  display() {
    // particle's appearance
    push();
    translate(this.x, this.y);
    noStroke();
    fill(this.c);
    
    quad(0, 12, 36, 0, 0, -12, -36, 0);

    pop();
  }

  checkOnScreen(){
  if(this.y > height){
    this.onScreen = false;
  }
 }



}