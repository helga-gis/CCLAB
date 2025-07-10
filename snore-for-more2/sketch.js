// ⬇️ add these ⬇️

// arduino
let port;
let connectBtn;
let str; //string from arduino
let val; // array with sensor values

// ⬆️ add these ⬆️



let picked = false;
let whoToPick = [];
let whereRtheyX = [];
let avatar;

let ffs = [];

let bugMarksX = [];
let bugMarksY = [];
let bugMarksType = [];
let bugMarksSize = [];
let bugMarksCol = [];


let mic;
let turnAround = false;
let bugType;

let ffCaught = 0;

let h;
let textH;

function preload() {
  catFull = loadImage("assets/catFull.png");
  duck = loadImage("assets/duck.png");
  marcela = loadImage("assets/marcela.png");
  leon = loadImage("assets/leon.png");
  forest = loadImage("assets/forest.png");
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
  textH = (h + 180) % 360;
  //console.log(h, textH)





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
  push();
  colorMode(HSB);
  background(h, 50, 100);
  //let textH = (h + 180) % 360;
  pop();

  if (picked == false) {
    startPage();
  }else{
    playPage();
  }

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
    fill(255)
    // text(val[0], 20, 20)
    // the second and third value are either 0 or 1 and will most likely
    // trigger your dancer's two special motions
  
    if (val[0] > 500) {
      // trigger your particles, you will have to adjust the threshold in the if statements
    }
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



class Cat {
  constructor() {
    this.dia = 80;
    this.x = random(width);
    this.y = random(50, height - 50);
    // this.speedX = 0.5;
    // this.speedY = 0.5;

  }

  update() {

    let micLevel = mic.getLevel();
    // console.log(micLevel)

    this.normalSpeedX = random(0, 1);
    this.speedX = map(micLevel, 0, 0.6, 0, 100);

    this.x += this.normalSpeedX + this.speedX;

    if (this.x > width) {
      this.x = 0;
    }

    this.y = map((noise(frameCount * 0.01) ), 0, 1, 0, height);
    
    if (this.y > height) {
      this.y = 0;
    }


  }

  display() {
    push();

    translate(this.x, this.y);

    if (this.x >= width / 2) {
      turnAround = true;
    } else {
      turnAround = false;
    }

    if (turnAround == true) {
      scale(-1, 1);
    }
    //reference circle
    //fill(this.c, 50, 50);
    //noStroke();
    //circle(0, 0, this.dia);

    image(avatar, 0, 0, this.dia, this.dia);

    // console.log(turnAround);
    pop();
  }

}

class Firefly {
  constructor(startX, startY, type) {
    this.x = startX;
    this.y = startY;
    this.type = type;

    this.size = random(2, 10);

    this.initialX = startX;
    this.initialY = startY;

    this.offset = random(10000);

    this.fc = random(160, 250); //color
  
    //for each bug, it has 30 layers with different transparency to make the glowing effect
    //for ff, max possible dia among 30 circles
    //actual ff size in drawBug loop: ffDia = this.ffMaxDia - i
    this.ffMaxDia = random(15, 30);
    //for bf, scale size, for making actual size between 1-2
    //1.87 is calculated, see drawBug type "bf"
    //actual bf size in drawBug loop: bfSize = this.bfScale - i * 0.03
    this.bfScale = random(1.87, 2); 

    this.caught = false;

  }

  update() {
    if(this.caught){
      //send the bugs to jar when caught
      let bugJarX = this.initialX + sin(frameCount * 0.1 + this.offset) * 10;
      let bugJarY = this.initialY + noise(frameCount * 0.1 + this.offset) * 4;
      //console.log(bugJarX);

      //make the bugs fly to the jar, and keep moving in the jar
      this.x = lerp(this.x, bugJarX, 0.05);
      this.y = lerp(this.y, bugJarY, 0.05);

    } else{
      this.x = map(sin(frameCount * 0.1 + this.offset), -1, 1, this.initialX - 5, this.initialX + 5);
      this.y = map(noise(frameCount * 0.1 + this.offset), -1, 1, this.initialY - 5, this.initialY + 5);
   }

  }


  display() {
    this.drawBug();
  }


  drawBug() {

    let strokeTr = 0;

    if (this.type == "ff") {
      for (let i = 0; i < 30; i++) {
        push();
        //i⬆️: dia⬇️, trans⬆️;
        //the outer circle is bigger with less trans (more transparency)
        let ffDia = this.ffMaxDia - i;
        drawFf(this.x, this.y, ffDia, this.fc, (i+1)*3, strokeTr)

        pop();
      }
    } else if (this.type == "bf") {
      for (let i = 0; i < 30; i++) {
        push();
        let bfSize = this.bfScale - i * 0.03;
        //bfScale = random(1.87, 2); min:1.87 max:2
        //i min:0 max:29
        //bfSize min: 1.87 - 29*0.03 = 1
        //bfSize max: 2 - 0 = 2
        drawBf(this.x, this.y, bfSize, this.fc, (i + 1) * 3, strokeTr);

        pop();
      }
    }

  }






  checkIfCatch() {
    let d = dist(cat.x, cat.y, this.x, this.y);
    let catchDistance = 50;
    //console.log(d);

    //if (d < catchDistance) {}
      //if (this.initialX > 80 || this.initialY < 400) {

      if (this.caught == false && d < catchDistance){
        //console.log("CATCH!!!!!!!!!!");

        bugMarksX.push(this.x);
        bugMarksY.push(this.y);
        bugMarksType.push(this.type);
        
        if (this.type == "ff"){
          bugMarksSize.push(this.ffMaxDia);
        } else if (this.type == "bf"){
          bugMarksSize.push(this.bfScale);
        }
        //console.log(bugMarksSize);

        bugMarksCol.push(this.fc);


        this.initialX = random(30, 60);
        this.initialY = random(410, 490);
        ffCaught++;
        //port.write(ffCaught + "\n"); //send back to arduino

        this.caught = true;
        
      }
    
  }

 

}

function addFfs(x, y) {
  ffs.push(new Firefly(x, y, bugType));
}

function drawFf(x, y, dia, col, trans, strokeTrans) {
  push();
  blendMode(HARD_LIGHT);         // ⬅️ 发光模式
  translate(x, y);
  stroke(col, 252, 3, strokeTrans);
  strokeWeight(1.5);
  fill(col, 252, 3, trans);
  circle(0, 0, dia);
  pop();

  blendMode(BLEND);       // ⬅️ 恢复默认
}



// function drawFf(x, y, dia, col, trans, strokeTrans){
//       push();
//       translate(x,y);
//       stroke(col, 252, 3, strokeTrans);
//       strokeWeight(1.5);
//       fill(col, 252, 3, trans);

//       //scale(size);
//       circle(0, 0, dia); 

//       pop();
//     }

function drawBf(x, y, size, col, trans, strokeTrans){
      push();
      translate(x,y);
      stroke(col, 252, 3, strokeTrans);
      strokeWeight(1);
      fill(col, 252, 3, trans);
      
      scale(size);
      triangle(0, 0, -10, -5, -10, 5);
      triangle(0, 0, 10, -5, 10, 5);
      triangle(-8, 6, 0, 0, -2, 12);
      triangle(8, 6, 0, 0, 2, 12);

      pop();
    }







function startPage() {
  textAlign(CENTER);

  textSize(40);
  
  push();
  colorMode(HSB);
  fill(textH, 50, 100);

  text("Pick your snoring buddy!", width / 2, 130);
  text("Have a nice dream!", width / 2, 390);
  pop();

  
  //console.log("Start");
  whoToPick.push(catFull);
  whoToPick.push(duck);
  whoToPick.push(marcela);
  whoToPick.push(leon);

  for (i = 0; i < 4; i++) {
    whereRtheyX.push(160 * (i + 1));
    image(whoToPick[i], whereRtheyX[i], 250, 80, 80);
  }
}


function playPage() {
  background(0);

  image(forest, width / 2, height / 2, width , height);

  //black filter
  fill(0, 150);
  rect(0, 0, width, height);


  cat.update();
  cat.display();

  //draw bugMarks for caught bugs
  for (let i = 0; i < bugMarksX.length; i++) {
    let x = bugMarksX[i];
    let y = bugMarksY[i];
    let type = bugMarksType[i];
    let size = (bugMarksSize[i]) * 0.8; //bugMarksSize[] is the biggest value for each 30 layers
    //but transparency makes visual look smaller than the actual size
    
    let col = bugMarksCol[i];

    let strokeTr = 200;
    let fillTr = 0;   //fully transparent

  if (type == "ff") {
      drawFf(x, y, size, col, fillTr, strokeTr);
      //console.log(size);

    } else if (type == "bf") {
      drawBf(x, y, size, col, fillTr, strokeTr);
  }
}
  
  //normal bug, not caught
  for (let i = 0; i < ffs.length; i++) {
    ffs[i].update();
    ffs[i].display();
    ffs[i].checkIfCatch();
  }

  //jar
  noFill();
  strokeWeight(3);
  stroke(255);
  rect(5, 400, 75, 95);

  
  //filter color
  push();
  fill(9, 36, 64, 100);
  rect(0, 0, width, height);
  pop();


  //text
  strokeWeight(1);
  stroke(255);
  fill(255);
  textSize(20);
  text("Caught: " + ffCaught , 135, 490);

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
}

function keyPressed() {
  if (key == "a" || key == "A") {
    addFfs(random(20, width - 20), random(20, height - 20));
    //console.log(ffs.length);
  } else if (key == "q" || key == "Q") {
    console.log(bugType);
    if (bugType == "bf") {
      bugType = "ff";
    } else {
      bugType = "bf";
    }

    for(let i = 0; i < ffs.length; i++){
      ffs[i].type = bugType;
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
