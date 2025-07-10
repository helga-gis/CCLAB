// ⬇️ add these ⬇️

// arduino
let port;
let connectBtn;
let str; //string from arduino
let val; // array with sensor values

// ⬆️ add these ⬆️


//start page
let picked = false;
let whoToPick = []; //pair of arrays: store images
let whereRtheyX = [];  //             store x

let avatar;

let mic;
let catModeMicX = false;  //mic on X or Y (default)

let bugType;
let ffs = []; //bugs (both ffs and bfs) not caught

//bug marks
let bugMarksX = [];
let bugMarksY = [];
let bugMarksType = [];
let bugMarksSize = [];
let bugMarksCol = [];
let showMarks = false;
let rainbowMarks = false;

//caught bugs in different states
let ffCaught = 0; //bugs caught in total
let ffInJar = 0;  //bugs current in jar
let currentSetCft = 0;  //current set (in jar)

//instruction arrays
let keys = ["A -- ", "S -- ", "M -- ", "C -- ", "Y -- "];
let instructions = ["Add", "Switch", "Marks", "Mark Color", "Cat Mode"];

//slider settings
let barTs = 100;
let sliderX = 20;
let sliderY = 20;
let sliderW = 100;
let sliderH = 10;
let sliderSwitchX = 70;
let dragging = false;

//for sometimes switching to hsb mode
let h;
let textH;

function preload() {
  catFull = loadImage("assets/catFull.png");
  duck = loadImage("assets/duck.png");
  marcela = loadImage("assets/marcela.png");
  leon = loadImage("assets/leon.png");
  forest = loadImage("assets/forest.png");
  jar = loadImage("assets/jar.png");
}


function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");

  canvas.mousePressed(userStartAudio);
  mic = new p5.AudioIn();
  mic.start();

  imageMode(CENTER);
  colorMode(RGB);

  cat = new Cat();

  bugType = random(["ff", "bf"]);

  h = random(360);
  textH = (h + 180) % 360;  //contrast color of h
  //console.log(h, textH)


  //start page avatars
  whoToPick.push(catFull);
  whoToPick.push(duck);
  whoToPick.push(marcela);
  whoToPick.push(leon);

  for (i = 0; i < 4; i++) {
    whereRtheyX.push(160 * (i + 1));
  }

  // ⬇️ add these lines ⬇️

  port = createSerial();

  // in setup, we can open ports we have used previously
  // without user interaction
  let usedPorts = usedSerialPorts();
  if (usedPorts.length > 0) {
    port.open(usedPorts[0], 57600);
  }

  // any other ports can be opened via a dialog after
  // user interaction (see connectBtnClick below)
  connectBtn = createButton("Connect to Arduino");
  connectBtn.position(20, 370);
  connectBtn.mousePressed(connectBtnClick);

  // ⬆️ add these lines ⬆️
}

function draw() {
 //check on which page first, then call page function
  if (picked == false) {
    push();
      colorMode(HSB);
      background(h, 50, 100);
    pop();

    startPage();
  }else{
    playPage();
  }

  //mouse emoji
  text("💤", mouseX, mouseY);


 // ⬇️ add these lines nd adjust the details ⬇️

  str = port.readUntil("\n");
  //str = trim(str); //remove any empty space

  if (str.length > 0) {
    val = int(str.split(",")); //split the values if there is a comma in between and convert them into numbers

    console.log(val);

    // you receive three values from arduino that are stored
    // in the array called val
    // the first value is a range, see it like this
    // fill(255)
    // text(val[0], 20, 20)
    // the second and third value are either 0 or 1 and will most likely
    // trigger your dancer's two special motions
  
    // if (val[0] > 500) {
    // }
    // val[0] mapped in Cat
    if (val[1] == 1) {
      addFfs(random(20, width - 20), random(20, height - 20));
    }
    if (val[2] == 0) {
      if (bugType == "bf") {
        bugType = "ff";
      } else {
        bugType = "bf";
      }
    }
  }
}

function startPage() {
  textAlign(CENTER);
  textSize(40);
  
  //change to hsb mode
  push();
  colorMode(HSB);
  fill(textH, 50, 100);

  text("Pick your snoring buddy!", width / 2, 130);
  text("Have a nice dream!", width / 2, 390);
  pop();

  //draw avatar
  for (i = 0; i < 4; i++) {
    image(whoToPick[i], whereRtheyX[i], 250, 80, 80);
  }
}

function playPage() {
  background(0);

  //background forest image
  image(forest, width / 2, height / 2, width , height);

  ///////////// SILDER BAR & INSTRUCTIONS
  push();
    barTs = map(sliderSwitchX, sliderX, sliderX + sliderW, 0, 255); //map switch on slider bar with transparent value

    //black filter
    fill(0, barTs);
    noStroke();
    rect(0, 0, width, height);

  pop();

    //slider bar
  push();
    fill(100);
    noStroke();
    rect(sliderX, sliderY, sliderW, sliderH);

    //switch
    fill(255);
    rect(sliderSwitchX - 5, sliderY -5, 10, sliderH + 10);

    //slider text
    textSize(13);
    textAlign(CENTER);
    let barPercent = int(map(sliderSwitchX, sliderX, sliderX + sliderW, 0, 100));
    barPercent = constrain (barPercent, 0, 100);
    text("Night Filter: " + barPercent + "%", sliderX + sliderW / 2, sliderY + sliderH + 20);
  
  pop();
  

    //dark night color filter
  push();
    fill(9, 36, 64, 100);
    rect(0, 0, width, height);

  pop();

    //instructions
  push();
    textSize(15);
    textAlign(LEFT);
    noStroke();
    for (let i = 0; i < keys.length; i++){
      let r = map(i, 0, keys.length - 1, 255, 148);
      let g = map(i, 0, keys.length - 1, 122, 0);
      let b = 203;
      fill(r, g, b);
      text(keys[i] + instructions[i], width - 120, 50 + i * 28);
    }

  pop();

  //cat 
  cat.update();
  cat.display();


  ////////////// MARKS
  if (showMarks == true){  
    push();

      for (let i = 0; i < bugMarksX.length; i++) {
        let fillTr = 0;   //fully transparent
        let strokeTr = 200;

        let x = bugMarksX[i];
        let y = bugMarksY[i];
        let type = bugMarksType[i];
        let size = (bugMarksSize[i]) * 0.8; //bugMarksSize[] is the biggest value for each 30 layers
        //but transparency makes visual look smaller than the actual size

        if (rainbowMarks == true){
          colorMode(HSB);//in hsb mode
          let rbHue = map(x, 0, width, 0, 360);
          markR = rbHue;  //hue
          markG = 100;    //saturation
          markB = 100;    //brightness
        } else {
          markR = bugMarksCol[i];
          markG = 252;
          markB = 3;
        }
        
        if (type == "ff") {
            drawFf(x, y, size, markR, markG, markB, fillTr, strokeTr);
            //console.log(size);

          } else if (type == "bf") {
            drawBf(x, y, size, markR, markG, markB, fillTr, strokeTr);
        }
      
      }

    pop();
  }

   
  ////////////// JAR
  push();
    //noFill();
    // strokeWeight(3);
    // stroke(255);
    //rect(5, 400, 75, 95);   //reference rect
    tint(180, 120, 255, 100);  //image color: R,G,B,A 
    image(jar, 43, 440, 130, 130);

  pop();

  //jar text
  strokeWeight(1);
  stroke(255);
  fill(255);
  textSize(20);
  textAlign(LEFT);
  text("In Jar: " + ffInJar, 88, 460);
  text("Caught: " + ffCaught, 88, 490);
  

  ///////////// ALIVE BUGS (NOT CAUGHT)
  
  for (let i = 0; i < ffs.length; i++) {
    ffs[i].update();

    if (showMarks == false){  //if not on mark page
      ffs[i].display();
    }
    
    ffs[i].checkIfCatch();
  }
  
  //delete ffs not on screen
  for(let i = ffs.length - 1; i >= 0; i--){
    if(ffs[i].onScreen == false){
      ffs.splice (i, 1);
    }
  }

  console.log(ffs.length);
}


class Cat {
  constructor() {
    this.dia = 80;
    this.x = random(width);
    this.y = random(50, height - 50);
    
    this.turnAround = false;
  }

  update() {
    let micLevel;

    if (val && val.length >= 1){
      micLevel = map(val[0], 0, 1023, 0, 0.6);
    } else {
      micLevel = mic.getLevel();
    }
    //console.log(micLevel)

    
    //////////// mic on X
    if (catModeMicX == true){
      this.normalSpeedX = random(0, 1); //slow speed moving itself...
      this.speedX = map(micLevel, 0, 0.6, 0, 100);  //mic to speed up
      this.x += this.normalSpeedX + this.speedX;
        if (this.x > width + this.dia / 2) {  
          this.x = - this.dia / 2;  //smoother than if x > width {x = 0}
        }
      this.y = map((noise(frameCount * 0.01) ), 0, 1, 0, height);

      //////////// mic on Y
    } else {
      let offset = random(123456789); //make the speed changes
      let speedX = map((noise(frameCount * 0.01 + offset) ), 0, 1, 1, 5);
      //console.log(noiseSpeedX);
      this.x += speedX;
        if (this.x > width + this.dia / 2) {
          this.x = - this.dia / 2;
        }
      this.speedY = map(micLevel, 0, 0.25, height, 0);
      this.y = lerp (this.y, this.speedY, 0.05); //smoother
      this.y = constrain(this.y, this.dia / 2, height - this.dia / 2);
    }
  }

  display() {
    push();
      translate(this.x, this.y);

      //if reaches mid of canvas, flip around
      if (this.x >= width / 2) {
        this.turnAround = true;
      } else {
        this.turnAround = false;
      }

      // console.log(this.turnAround);
      if (this.turnAround == true) {
        scale(-1, 1);
      }

      //reference circle
      //fill(this.c, 50, 50);
      //noStroke();
      //circle(0, 0, this.dia);

      image(avatar, 0, 0, this.dia, this.dia);

    pop();
  }

}

class Firefly {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.initialX = startX;
    this.initialY = startY;
    this.flyingSpeedX = random(-2, 2);
    this.flyingSpeedY = random(-1, -3);
    this.size = random(2, 10);
    this.offset = random(10000);
    this.r = random(160, 250); 
    this.g = 252;
    this.b = 3;

    //for each bug, it has 30 layers with different transparency to make the glowing effect
    this.ffMaxDia = random(20, 35);//for ff, max possible dia among 30 circles
    //actual ff size in drawBug loop: ffDia = this.ffMaxDia - i

    this.bfScale = random(1.87, 2); //for bf, scale size, for making actual size between 1-2
    //1.87 is calculated, see drawBug type "bf"
    //actual bf size in drawBug loop: bfSize = this.bfScale - i * 0.03

    this.caught = false;
    this.inJar = false;
    this.flyingOut = false;
    this.onScreen = true;
    
  }

  update() {
     ////////////  bugs flying out
    if(this.caught && this.flyingOut){
      this.x+=this.flyingSpeedX;
      this.flyingSpeedX *= 0.99;
      this.y+=this.flyingSpeedY;
      this.flyingSpeedY-=0.1;

      if(this.y > height){
        this.onScreen = false;
      }
      
     //////////// caught bugs:
     //////////// on the way to jar (not jar yet)
    }else if(this.caught && this.inJar == false){
      //send the bugs to jar when caught
      let jarBugX = this.initialX + sin(frameCount * 0.1 + this.offset) * 10;
      let jarBugY = this.initialY + noise(frameCount * 0.1 + this.offset) * 4;
      //console.log(jarBugX);
      this.x = lerp(this.x, jarBugX, 0.05);
      this.y = lerp(this.y, jarBugY, 0.05);

      //////////// arrived jar
      if(this.inJar == false && dist(this.x, this.y, jarBugX, jarBugY) < 15){
        this.inJar = true;
        this.jarSet = currentSetCft;
        ffInJar++;
        //if 10 arrived jar, flyingout
        if(ffInJar == 10){
          triggerConfettis(currentSetCft); //a set for this 10 bugs
          currentSetCft++;
          ffInJar = 0;
        }
      }

      //////////// bugs not caught
    } else{
      //random location with wiggling movements 
      this.x = map(sin(frameCount * 0.1 + this.offset), -1, 1, this.initialX - 5, this.initialX + 5);
      this.y = map(noise(frameCount * 0.1 + this.offset), -1, 1, this.initialY - 5, this.initialY + 5);
   }


  }


  display(){
    this.drawBug();
  }


  drawBug() {
    let strokeTr = 0;
    let flashTp = 1;  //breathing effect
    flashTp = map(sin(frameCount * 0.05 + this.offset), -1, 1, 0.3, 1);
    
    if (bugType == "ff") {
      for (let i = 0; i < 30; i++) {  //30 layers of each ff with different dia and trans
        push();
          //i⬆️: dia⬇️, trans⬆️;
          let ffDia = this.ffMaxDia - i;  //the outer circle is bigger with less trans (more transparency)
          drawFf(this.x, this.y, ffDia, this.r, this.g, this.b, (i + 1) * 3 * flashTp, strokeTr);
        
        pop();
      }
    } else if (bugType == "bf") {
      for (let i = 0; i < 30; i++) {
        push();
          let bfSize = this.bfScale - i * 0.03;
          //bfScale = random(1.87, 2); min:1.87 max:2
          //i min:0 max:29
          //bfSize min: 1.87 - 29*0.03 = 1
          //bfSize max: 2 - 0 = 2
          drawBf(this.x, this.y, bfSize, this.r, this.g, this.b, (i + 1) * 3 * flashTp, strokeTr);
        
        pop();
      }
    }
  }


  checkIfCatch() {
    let d = dist(cat.x, cat.y, this.x, this.y);
    let catchDistance = 50;

      if (this.caught == false && d < catchDistance){
        //console.log("CATCH!!!!!!!!!!");

        //1. push caugth location to marks
        bugMarksX.push(this.x);
        bugMarksY.push(this.y);
        bugMarksType.push(bugType);
        if (bugType == "ff"){
          bugMarksSize.push(this.ffMaxDia);
        } else if (bugType == "bf"){
          bugMarksSize.push(this.bfScale);
        }
        bugMarksCol.push(this.r);

        //2. move to jar
          //jar location
        this.initialX = random(30, 60);
        this.initialY = random(410, 490);
        
        //port.write(ffCaught + "\n"); //send back to arduino
        ffCaught++;
        this.caught = true;

      }
    
  }
}


function addFfs(x, y) {
  ffs.push(new Firefly(x, y, bugType));
}

function triggerConfettis(whichSet){
  for (let i = 0; i < ffs.length; i++){
    //let inJar and in current set bugs fly out of jar
    if(ffs[i].inJar && ffs[i].jarSet == whichSet){
      ffs[i].speedX = random(-1, 3);
      ffs[i].speedY = random(-2, -5);
      ffs[i].flyingOut = true;
    }
  }
}

function drawFf(x, y, dia, r, g, b, trans, strokeTrans){
  push();
    translate(x,y);
    stroke(r, g, b, strokeTrans);
    strokeWeight(1.5);
    fill(r, g, b, trans);

    //scale(size);
    circle(0, 0, dia); 

  pop();
}

function drawBf(x, y, size, r, g, b, trans, strokeTrans){
  push();
    translate(x,y);
    stroke(r, g, b, strokeTrans);
    strokeWeight(1);
    fill(r, g, b, trans);
          
    scale(size);
    triangle(0, 0, -10, -5, -10, 5);
    triangle(0, 0, 10, -5, 10, 5);
    triangle(-8, 6, 0, 0, -2, 12);
    triangle(8, 6, 0, 0, 2, 12);

  pop();
}




function mousePressed() {
  if (picked == false) {
    for (i = 0; i < whoToPick.length; i++) {
      if (abs(mouseX - whereRtheyX[i]) <= 20 && mouseY > 200 && mouseY < 300) {
        avatar = whoToPick[i];
        picked = true;
      }
    }
  }

  if(mouseX > sliderSwitchX - 5 && mouseX < sliderSwitchX + 5 && mouseY > sliderY - 5 && mouseY < sliderY + sliderH + 5){
    dragging = true;
  }
}

function mouseDragged(){
  if(dragging){
    sliderSwitchX = constrain(mouseX, sliderX, sliderX + sliderW);
  }
}

function mouseReleased(){
  dragging = false;
}


function keyPressed() {
  if (key == "a" || key == "A") {   //add ffs
    addFfs(random(20, width - 20), random(20, height - 20));
    //console.log(ffs.length);

  } else if (key == "s" || key == "S") {  //switch bug type
    if (bugType == "bf") {
      bugType = "ff";
    } else {
      bugType = "bf";
    }
    console.log(bugType);

  } else if (key == "m" || key == "M"){   //show marks
    if (showMarks == false){
      showMarks = true;
    } else {
      showMarks = false;
    }

  } else if ( key == "c" || key == "C"){    //mark color change
    if(rainbowMarks == false){
      rainbowMarks = true;
    } else {
      rainbowMarks = false;
    }

  } else if (key == "y" || key == "Y"){     //cat mode
    if (catModeMicX == false){
      catModeMicX = true;
    } else {
      catModeMicX = false;
    }
  }
}

// ⬇️ add this function ⬇️

function connectBtnClick() {
    if (!port.opened()) {
      port.open("Arduino", 57600);
    } else {
      port.close();
    }
  }

