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

let NUM_OF_PARTICLES = 200; // Decide the initial number of particles.
let particles = [];

function preload(){
  ah = loadSound("assets/ahh.mp3");
}


function setup() {
  // no adjustments in the setup function needed...
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-canvas-container");

  // ...except to adjust the dancer's name on the next line:
  dancer = new GisDancer(width / 2, height / 2);

  //colorMode(HSB);
}

function draw() {
  // you don't need to make any adjustments inside the draw loop
  background(0);
  drawFloor(); // for reference only


//particles

    //  if(mouseIsPressed == true){
    //   for(let i = 0; i < NUM_OF_PARTICLES; i++){
    //   particles.push(new Particle (mouseX, mouseY));
    //   }
    // } 

  // update and display
    for (let i = 0; i < particles.length; i++) {
    // let p = particles[i];
    particles[i].update();
    particles[i].display();
    particles[i].checkOnScreen();
  }

    // // delete confettis that are not on screen
    // // for(let i = 0; i < confettis.length; i++){

    for(let i = particles.length-1; i >= 0 ; i--){
      let p = particles[i];
      if(p.onScreen == false){
      // this confetti should go
          particles.splice(i, 1);
      }
    }

    //check how many particles on screen
      fill(255);  
      text(particles.length, 10, 10);



    dancer.hit = false;

    //if  particle hit dancer
    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];
      let dx = abs(p.x - dancer.x);
      let dy = abs(p.y - (dancer.y + dancer.offsetY));

      if (dx < 60 && dy < 100) { 
        dancer.hit = true;
        break;  //end this after one hit
      }
    }
     //console.log(dancer.hit);
     //console.log(windowWidth, windowHeight);

//dancer
  dancer.update();
  dancer.display();

}

// You only code inside this class.
// Start by giving the dancer your name, e.g. LeonDancer.
class GisDancer {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;

    this.initialX = startX; // SOLUTION1: keep record of ininital x and then change this.x
    this.offsetX = 0; // SOLUTION 2: make offset value and draw dancer off of its actual this.x location
    this.offsetY = 0;
    this.speedY = 0;
    this.gravity = 0.9;
    this.backY = false;  // y back to original place
    this.maxDrop = 50;       // max drop value

    // add properties for your dancer here:
    this.armAngleLeft = 135;
    this.armAngleRight = 45;
    this.armSpeed = 2;

    this.leftArmWaving = false;   //right arm uses this value as well
    this.lastWavingStart = 83974831;


    this.hit = false;
  }
  update() {
    // update properties here to achieve
    // your dancer's desired moves and behaviour
    // this.armAngleLeft += this.armSpeed; 

    if(this.leftArmWaving == true){
      this.armAngleLeft = map( sin(frameCount * 0.1), -1, 1, 135, 225);
      this.armAngleRight = map( sin(frameCount * 0.1), -1, 1, 45, -45);
    }

    // check how long we waed already
    if(  frameCount - this.lastWavingStart > 400 ){
      this.leftArmWaving = false;
    }
    
    this.x = map( sin(frameCount * 0.1 ) , -1, 1, this.initialX-20, this.initialX+20); // SOLUTION1: keep record of ininital x and then change this.x
    // this.offsetX = map( sin(frameCount * 0.1 ) , -1, 1, -30, 30  ); // SOLUTION 2: make offset value and draw dancer off of its actual this.x location
  

    // jump up

    // this.offsetY += this.speedY;
    // this.speedY += this.gravity;
    // if(this.offsetY > 0){
    //   this.offsetY = 0
    // }

  if(this.backY){
    this.offsetY += this.speedY;
    this.speedY += this.gravity;

    if(this.offsetY >= this.maxDrop){
    this.speedY = -10;
    }

    if(this.offsetY <= 0){
    this.offsetY = 0;
    this.speedY = 0;
    this.backY = false;
    }
  }
  
  
  }

  display() {
    // the push and pop, along with the translate 
    // places your whole dancer object at this.x and this.y.
    // you may change its position on line 19 to see the effect.
    push();
    translate(this.x, this.y + this.offsetY);      // SOLUTION1: keep record of ininital x and then change this.x
    // translate(this.x+this.offsetX, this.y); // SOLUTION 2: make offset value and draw dancer off of its actual this.x location

    // ******** //
    // ⬇️ draw your dancer from here ⬇️

    
    if (this.hit) {
    stroke(random(360), 255, 255);
    strokeWeight(3);
    ahh.play();
    } else {
    noStroke();
    }
    
    //Body 
    //noStroke();
    fill(255,62,165); 
    ellipse(0, 0, 80, 100); 

    fill(255); 
    ellipse(0, 10, 40, 60);

    // Head
    fill(255,62,165);
    ellipse(0, -60, 60, 60); 

    // Eyes
    fill(255);
    ellipse(-12, -65, 15, 20);
    ellipse(12, -65, 15, 20);
    fill(0);
    ellipse(-12, -65, 7, 7);
    ellipse(12, -65, 7, 7);

    // Mouth
    fill(255, 150, 0);
    triangle(0, -52, -10, -45, 10, -45);

    // Left arm
    push()
    translate(-34, -30);
    rotate( radians(this.armAngleLeft) )
    fill("yellow");
    ellipse(20, 0, 50, 15);
    // fill("red")
    // circle(0, 0, 5)
    pop()
  
    // Right arm
    push()
    translate(34, -30);
    rotate( radians(this.armAngleRight) )
    fill("yellow");
    ellipse(20, 0, 50, 15);
    // fill("red")
    // circle(0, 0, 5)
    pop()

    //Left foot
    fill("yellow");
    ellipse(-31, 45, 24, 30);
   
    //Right foot
    fill("yellow");
    ellipse(31, 45, 24, 30);


    // ⬆️ draw your dancer above ⬆️
    // ******** //

    // the next function draws a SQUARE and CROSS
    // to indicate the approximate size and the center point
    // of your dancer.
    // it is using "this" because this function, taoo, 
    // is a part if your Dancer object.
    // comment it out or deletea it eventually.
    //this.drawReferenceShapes()

    pop();
  }
  triggerA(){
    // this function will be called when the "a" key is pressed.
    // your dancer should perform some kind of reaction (i.e. make a special move or gesture) 
    //console.log("helklo")
    this.leftArmWaving = true;
    this.lastWavingStart = frameCount;
  }
  triggerD(){
    // this function will be called when the "d" key is pressed.
    // your dancer should perform some kind of reaction (i.e. make a special move or gesture) 
    //this.speedY = -10
    this.speedY = 10;   
    this.backY = true; 

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

function keyPressed() {
  if (key == "a") {
    dancer.triggerA();
  } else if (key == "d") {
    dancer.triggerD();
  } else if (key == "p") {
    let burstX = random(width);
    let burstY = random(height);
      for (let i = 0; i < NUM_OF_PARTICLES; i++) {
        let p = new Particle(burstX, burstY);
        if (burstX > width / 2) {
          p.speedX *= -1; 
        }
        particles.push(p);
      }
  }
}

class Particle {
  // constructor function
  constructor(startX, startY) {
    // properties (variables): particle's characteristics
    this.x = startX;
    this.y = startY;
    this.originX = startX;
    this.size = 3;
    

    this.speedX = random(2, 5); 
    this.speedY = random(-0.5, 2.5);

    //console.log(this.SpeedX, ",", this.speedY);
    this.gravity = 0.05;

    this.spreadTimer = 0;

    // this.trsp = 255;

    // this.c = color(random(360), 255, 255, this.trsp);

    this.h = random(360);
    this.s = 255;
    this.b = 255;
    this.trsp = 255;

    this.onScreen = true;
  }

  // methods (functions): particle's behaviors
  update() {
    this.x += this.speedX;
    this.spreadTimer++;

    this.spreadspeed = 0.5;

    this.spreadDist = this.x - this.originX;

    if (this.spreadDist < 50) {
      this.spreadspeed = 0.5;
    } else if (this.spreadDist < 100) {
      this.spreadspeed = 1;
    } else {
      this.spreadspeed = 1.25;
    }

    if (this.spreadTimer > 30) {
      this.spreadspeed *= 1.5;
    }
    this.y += this.speedY * this.spreadspeed;

    if(abs(this.spreadDist) > 200){
      this.maxDistToEdge = max(this.originX, windowWidth - this.originX);

      this.trsp = map(this.spreadDist, 200, windowWidth/2, 255, 0);

      this.trsp = map(abs(this.spreadDist), 200, this.maxDistToEdge, 255, 0);
      this.trsp = constrain(this.trsp, 0,255);
      console.log(this.trsp);
    }
    

  }


  display() {
    // particle's appearance
    push();
    translate(this.x, this.y);
    noStroke();
    fill(this.h, this.s, this.b, this.trsp);
    
    quad(0, this.size, this.size*3, 0, 0, -this.size, -this.size*3, 0);

    pop();
  }

  checkOnScreen(){
  if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
    this.onScreen = false;
  }
 }

}