let stroColR = 255;  //staff var
let stroColG = 255;
let stroColB = 255;
let staffYs = [100, 250, 400]; //y position of 3 sets of 5 lines

let notes = []; //notes arrays
let noteTypes = ["whole", "half", "dotted half", "quarter", "dotted quarter", "eighth", "dotted eighth", "sixteenth"]; 
// all possible note types
let noteCount;
let notes0x = [];
let notes0y = [];
let notes0types = [];
let notes1x = [];
let notes1y = [];
let notes1types = [];
let notes2x = [];
let notes2y = [];
let notes2types = [];

let notesActive = false;

let specialNoteX; //special note var
let specialNoteY;
let specialNoteR;
let specialNoteG;
let specialNoteB;
let specialNoteClicked = false;


let hiddenNoteX;  //hidden note var
let hiddenNoteY;
let hiddenNoteClicked = false;

let bgColR = 144; //background color
let bgColG = 240;
let bgColB = 232;

let creaColR = 255; //creature var
let creaColG = 255;
let creaColB = 255;
let creaColT = 255;
let dia = 80;
let x1 = dia / 2;
let y1 = 200;
let speedX = 3;
let speedY = 3;
let creatureDiaLocked = true; 

let creatureActive = false;


let noiseControlX = 0;  //noise, will be controled by creature's X later

//audios
let bap;
let cadence;

function preload(){
  bap = loadSound("audio/bloibb.mp3");
  cadence = loadSound("audio/GtoC_cadence");
}

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");
  
  let staffIndex = floor(random(0, 3));// three staffs
  let lineIndex = int(random(-2, 10)); // location on each staffs

  specialNoteX = random(100, 730);  //random position for specialnote
  specialNoteY = staffYs[staffIndex] + lineIndex * 5;
  
  let hiddenStaffIndex = floor(random(0, 3)) ; //same for hidden note
  let hiddenLineIndex = int(random(-2, 10));
  
  hiddenNoteX = random(111, 689);
  hiddenNoteY = staffYs[hiddenStaffIndex] + hiddenLineIndex * 5;
  
 }

function draw() {
  background(bgColR, bgColG, bgColB);
  if (creatureActive == true) {
    noiseControlX = x1;
  }
  let noisiness = map(noiseControlX, 0, width, 0, 1); 

//draw staffs 
  stroke(stroColR, stroColG, stroColB);
    for (let g = 0; g < 3; g++) {
      for (let i = 0; i < 5; i++) {
      drawLine(width/2, staffYs[g] + i * 10, 1000 * (g + 1) + i * 100, noisiness);
      }
    }

//draw bass clefs
  for (let g = 0; g < 3; g++) {
    drawBassClef(10, staffYs[g] - 30, 1000 * (g + 1), noisiness);
  }
  
//draw notes
  if (notesActive == true) {
    for(let i = 0; i < notes0x.length; i++){
      // draw notes for the first line using notes0x anf notes0y array... etc
      drawNote(notes0x[i], notes0y[i], notes0types[i], 1000, noisiness)
    }
    for(let i = 0; i < notes1x.length; i++){
      drawNote(notes1x[i], notes1y[i], notes1types[i], 2000, noisiness)
    }
    for(let i = 0; i < notes2x.length; i++){
      drawNote(notes2x[i], notes2y[i], notes2types[i], 3000, noisiness)
    }
  }
  
//draw fermata
    let fR = 127 + 127 * sin(frameCount * 0.1); //fermata colors
    let fG = 127 + 127 * sin(frameCount * 0.1 + TWO_PI / 3);  //two_pi radians = 360
    let fB = 127 + 127 * sin(frameCount * 0.1 + (2 * TWO_PI) / 3);
    let fT = 127 + 127 * sin(frameCount * 0.1);
      drawFermata(760, 400, 1000, noisiness, fR, fG, fB);
  
//draw special note
  if(specialNoteClicked == false){  //click get color
    specialNoteR = fR;
    specialNoteG = fG;
    specialNoteB = fB; 
  } else {  //bg color
    specialNoteR = bgColR;
    specialNoteG = bgColG;
    specialNoteB = bgColB;
  }
  
  push();
  translate(specialNoteX, specialNoteY);
  fill(specialNoteR, specialNoteG, specialNoteB);
  stroke(specialNoteR, specialNoteG, specialNoteB);
  strokeWeight(1);
  ellipse(0, 0, 12, 8); 
  pop();
  
//draw hidden note
  let hoveringHiddenNote = false; //if mouse on hidden note
  if (mouseX > hiddenNoteX - 6 && mouseX < hiddenNoteX + 6 && mouseY > hiddenNoteY - 4 && mouseY < hiddenNoteY + 4) {
    hoveringHiddenNote = true;
  }
  //console.log(hiddenNoteX, hiddenNoteY);

  //set color depending on hover
  let noteR;
  let noteG;
  let noteB;
  
  if (hoveringHiddenNote == true) {
    noteR = fR;
    noteG = fG;
    noteB = fB;
  } else if (hiddenNoteClicked == true) {
    noteR = fR;
    noteG = fG;
    noteB = fB;
  } else {
    noteR = bgColR;
    noteG = bgColG;
    noteB = bgColB;
  }
//hidden note
  fill(noteR, noteG, noteB);
  stroke(255, fT);
  ellipse(hiddenNoteX, hiddenNoteY, 12, 8);

  if (hoveringHiddenNote == true) { //if mouse on hidden note
  let hiddenText = "You found a hidden note!";
  textSize(20);
  fill(fR, fG, fB);
  text(hiddenText, hiddenNoteX - textWidth(hiddenText) / 2, hiddenNoteY - 20);
  }

  
// Draw title, notations, dynamics...etc
  textSize(48); //title "Muse"
  fill(fR, fG, fB);
  stroke(255);
  text("Muse", 345, 66);

  stroke(fR, fG, fB); //tempos
  textSize(20);
  text("Allegro", 60, 90); 
  text("Largo", 60, 390);
  
  noFill();
  stroke(0);
  strokeWeight(1);
  textSize(20);
  text("mp",65,170);  
  line(100, 165, 200, 155);
  line(100, 165, 200, 175);

  text("ppp",740,465);
  line(540, 445, 720, 460);
  line(540, 475, 720, 460);
  
  text("f", 185, 315);
  line(200, 310, 300, 300);
  line(200, 310, 300, 320);
  text("ff", 315,315);

  text("sfz", 620, 315); 

  text("fff", 420, 465);
  line(300, 460, 400, 450);
  line(300, 460, 400, 470);
  
  text("Ped.", 120, 460);
  line(120, 465, 250, 465);
  
  noFill();
  stroke(0);
  arc(250, 230, 120, 30, PI, TWO_PI);   //slur
  

  if (creatureActive == true) { // draw the creature

    stroke(255);
    strokeWeight(1);
    creaColR = fR;
    creaColG = fG;
    creaColB = fB;
    fill(creaColR, creaColG, creaColB, creaColT);

    if (creatureDiaLocked == true) {  //when not clicked on the creature, dia is locked to 80
      dia = 80;
    } else if (creatureDiaLocked == false) {
      let noiseValue = noise(frameCount * 0.01);
      dia = noiseValue * 200;
    }
      
    let sinValue = sin(frameCount * 0.01);
    x1 = map(sinValue, -1, 1, dia / 2, width - dia / 2);
    let cosValue = cos(-frameCount * 0.01);
    circle(x1, y1, dia);
    x1 = x1 + speedX;
    y1 = y1 + speedY;
    
    // Eye positions 
    let eyeOffsetX = dia * 0.2;
    let eyeOffsetY = dia * 0.2;
    let eyeSize = dia * 0.15;
    let pupilSize = dia * 0.07;

    let maxOffset = dia * 0.05;   

    let pupilOffsetX = map(mouseX, x1 - 100, x1 + 100, -maxOffset, maxOffset);
    let pupilOffsetY = map(mouseY, y1 - 100, y1 + 100, -maxOffset, maxOffset);
    pupilOffsetX = constrain(pupilOffsetX, -maxOffset, maxOffset);  //to not burn my laptop :D
    pupilOffsetY = constrain(pupilOffsetY, -maxOffset, maxOffset);  

    // Draw eyes
    fill(255);
    noStroke();
    ellipse(x1 - eyeOffsetX, y1 - eyeOffsetY, eyeSize * 3/2, eyeSize);  //  3/2 is note w/h ratio, to make eyes look like notes
    ellipse(x1 + eyeOffsetX, y1 - eyeOffsetY, eyeSize * 3/2, eyeSize);

    // Draw pupils looking toward mouse
    fill(0);
    ellipse(x1 - eyeOffsetX + pupilOffsetX, y1 - eyeOffsetY + pupilOffsetY, pupilSize, pupilSize);
    ellipse(x1 + eyeOffsetX + pupilOffsetX, y1 - eyeOffsetY + pupilOffsetY, pupilSize, pupilSize);
      
    //creature bounce
    if (x1 - dia / 2 < 0 || x1 + dia / 2 > width) {
      speedX = -speedX;
      }
    if (y1 - dia / 2 < 100 || y1 + dia / 2 > 440) {
      speedY = -speedY;
      // Only regenerate if notes are active
    if (notesActive == true) {
        // Clear all note arrays
        notes0x = [];
        notes0y = [];
        notes0types = [];
        notes1x = [];
        notes1y = [];
        notes1types = [];
        notes2x = [];
        notes2y = [];
        notes2types = [];

        generateNotes();
      }
    }
    
    // staff line color change
    if(y1 + dia / 2 > 100 && y1 - dia / 2 < 140 ){  //staff 1
      stroColG = random(100, 255);
    } else{
      stroColG = 255;
    }
    if(y1 > 250 && y1 < 290 ){  //staff 2
      stroColR = random(100, 255);
    } else{
      stroColR = 255;
    }
    if(y1 + dia / 2 > 400 && y1 - dia / 2 < 440 ){  //staff 3
      stroColB = random(100, 255);
    } else{
      stroColB = 255;
    }

    //if creature reaches fermata/bassclefs, get transparent 
     let creaFerDist = dist(x1,y1,760,373);
     let creaBass1Dist = dist(x1,y1,45,120);
     let creaBass2Dist = dist(x1,y1,45,270);
     let creaBass3Dist = dist(x1,y1,45,420);

      if(creaFerDist < dia / 2){
       creaColT = lerp(255,0,frameCount*0.005);
      } else if(creaBass1Dist < dia / 2){
       creaColT = lerp(255,170,frameCount*0.001);
      } else if(creaBass2Dist < dia / 2){
       creaColT = lerp(255,85,frameCount*0.001);
      } else if(creaBass3Dist < dia / 2){
       creaColT = lerp(255,0,frameCount*0.001);
      } else {
       creaColT = 255;
      }
  }
  // textSize(20);
  // text(mouseX + ", " + mouseY, mouseX, mouseY);
  
  //console.log(speedX, speedY);
  
}

function generateNotes() {
  notes = [];
  for (let setOfStaffs = 0; setOfStaffs < 3; setOfStaffs++) {    //the three staffs
    let groupNotes = [];
     let noteCount = round(random(5, 17));    //how many notes on a staff
      //                        (min amount of notes, max)
      for(i = 0; i < noteCount; i ++){
        // generate random lineindex 
        let lineIndex = int(random(-2, 10));
        //pos of the notes on each stave, the first line is 0 
        // turn lineIndex into a y position staffheight + lineIndex * lineheight
        let noteX = round(random(100, 730));
        let noteY = staffYs[setOfStaffs] + lineIndex * 5;  //lineheight is 5
        let ranNoteType = random(noteTypes);

        if(setOfStaffs == 0){
          notes0x.push(noteX);
          notes0y.push(noteY);
          notes0types.push(ranNoteType); 
        }else if(setOfStaffs == 1){
          notes1x.push(noteX);
          notes1y.push(noteY);
          notes1types.push(ranNoteType);
        }else if(setOfStaffs == 2){
          notes2x.push(noteX);
          notes2y.push(noteY);
          notes2types.push(ranNoteType);
        }
      }
  }
}

function drawLine(x, y, noiseOffset, noiseyFactor) {
//    noiseOffset gets different section of noise
  push();
    strokeWeight(1);
    translate(x, y);
    let lineLength = width *2;
    for (let i = -lineLength / 2; i < lineLength / 2; i++) {
      let currentNoiseValue = noise(noiseOffset + i * 0.052) * noiseyFactor + (1 - noiseyFactor) * 0.5; 
      let nextNoiseValue = noise(noiseOffset + (i + 1) * 0.052) * noiseyFactor + (1 - noiseyFactor) * 0.5;
      let curveHeight = 50; //the range of the curve
      let currentY = map(currentNoiseValue, 0, 1, curveHeight / 2, -curveHeight / 2);
      let nextY = map(nextNoiseValue, 0, 1, curveHeight / 2, -curveHeight / 2);
      let x1 = i * 10;
      line(x1, currentY, x1 + 10, nextY);
    }
    // fill("red");
    // circle(0, 0, 5)
  pop();
}

function drawBassClef(x, y, noiseOffset, noiseyFactor) {
  let clefNoiseValue = noise(noiseOffset + x * 0.052) * noiseyFactor + (1 - noiseyFactor) * 0.5; 
  let curveHeight = 50; //the range of the curve
  let dynamicCelfY = map(clefNoiseValue, 0, 1, curveHeight / 2, -curveHeight / 2);
  push();
  translate(x, y + dynamicCelfY);
  stroke(255);
  strokeWeight(2.5);
  noFill();
  beginShape();
  // Add the first anchor point.
  vertex(0, 40);
  // Add the Bézier vertex.
  bezierVertex(35, 10, 35, 70, 10, 70);
  endShape();
  fill(255);
  circle(35, 35, 4);
  circle(35, 45, 4);
  circle(0, 40, 4);
  pop();
}

function drawFermata(x, y, noiseOffset, noiseyFactor, eR, eG, eB){
  let ferNoiseValue = noise(noiseOffset + x * 0.052) * noiseyFactor + (1 - noiseyFactor) * 0.5; 
  let curveHeight = 50; //the range of the curve
  let dynamicferY = map(ferNoiseValue, 0, 1, curveHeight / 2, -curveHeight / 2);
  push();
  translate(x, y + dynamicferY);
//ending note
  noStroke(0);
  fill(eR, eG, eB);
  ellipse(0, 0 + 25, 12, 8);
//fermata
  stroke(eR, eG, eB);
  strokeWeight(2);
  noFill();
  arc(0, 0 - 10, 25, 25, PI, TWO_PI, OPEN);
  noStroke();
  fill(eR, eG, eB);
  circle(0, 0 -12, 3);
  pop();
}

function drawNote(x, y, typeOfNote, noiseOffset, noiseyFactor) {
  let noteNoiseValue = noise(noiseOffset + x * 0.052) * noiseyFactor + (1 - noiseyFactor) * 0.5; 
  let curveHeight = 50; //the range of the curve
  let dynamicNoteY = map(noteNoiseValue, 0, 1, curveHeight / 2, -curveHeight / 2);
  push()

  translate(x, y + dynamicNoteY);
  strokeWeight(1);
  let w = 12;  //note width
  let h = 8;   //note height

//note head
  if (typeOfNote == "whole" || typeOfNote == "half") {
    fill(255);      //white notehead
    stroke(0);
    ellipse(0, 0, w, h);
  } else if(typeOfNote == "dotted half"){
    fill(255);      //white notehead
    stroke(0);
    ellipse(0, 0, w, h);
    fill(0);
    circle(10, 2, 3);  //dot
  }else if(typeOfNote == "dotted quarter" || typeOfNote == "dotted eighth"){
    fill(0);          //black notehead
    noStroke();
    ellipse(0, 0, w, h);
    circle(10, 2, 3);  //dot
  } else{
    fill(0);          //black notehead
    noStroke();
    ellipse(0, 0, w, h);
  }
  
//note stem
  if (typeOfNote != "whole") {
    stroke(0);
    strokeWeight(1);
    line(w / 2, 0, w / 2, -25);  //note stem if not whole   
  }
//note flag
  if (typeOfNote == "eighth" || typeOfNote == "dotted eighth" || typeOfNote == "sixteenth") {
    line(w / 2, -25, w / 2 + 7, -30);  //note flag
  }
  if (typeOfNote == "sixteenth") {
    line(w / 2, -15, w / 2 + 7, -20);  //another noteflag for 16th
  }
  
  pop();
}


function mousePressed() {
//if  mouse clicked special note
  let d = dist(mouseX, mouseY, specialNoteX, specialNoteY);
  if (d < 12) {
    creatureActive = true;
    specialNoteClicked = true; 
  }

//if mouse clicked the creature
  if (creatureActive == true) {
  let distToCreature = dist(mouseX, mouseY, x1, y1);
    if (distToCreature < dia / 2) {
    creatureDiaLocked = false;
    }
  }

//if mouse clicked hidden note
  if (hiddenNoteClicked == false ) {
    let dHidden = dist(mouseX, mouseY, hiddenNoteX, hiddenNoteY);
     if (dHidden < 8) {
      hiddenNoteClicked = true;
      bap.play();
     }
  }
//if mouse clicked fermata  
  let fermataDist = dist(mouseX, mouseY, 760, 425);
  if (fermataDist < 12) {
    cadence.play();
  }
   
//if mouse clicked "Muse"
  if (mouseX > 345 && mouseX < 460 && mouseY > 32 && mouseY < 66){
    notesActive = true;  
   //generate new notes with empty arrays first...
    notes0x = [];
    notes0y = [];
    notes0types = [];
    notes1x = [];
    notes1y = [];
    notes1types = [];
    notes2x = [];
    notes2y = [];
    notes2types = [];
   //...then generateNotes
    generateNotes();
  }
  
// if mouse clicked "Allegro", speed up
  if (mouseX > 60 && mouseX < 122 && mouseY > 75 && mouseY < 96) {
    let speedFactor = 1.2;
    if (speedX > 0) {
    speedX = constrain(abs(speedX) * speedFactor, 0.5, 20);   //abs: absolute value
    } else {
    speedX = -constrain(abs(speedX) * speedFactor, 0.5, 20);  //if creature bounce, speed = -speed, so abs needed
    }
    
    if (speedY > 0) {
    speedY = constrain(abs(speedY) * speedFactor, 0.5, 20);
    } else {
    speedY = -constrain(abs(speedY) * speedFactor, 0.5, 20);
    }  
  }
// if mouse clicked "Largo", speed down
  if (mouseX > 60 && mouseX < 110 && mouseY > 375 && mouseY < 396) {
    let speedFactor = 0.8;
    if (speedX > 0) {
    speedX = constrain(abs(speedX) * speedFactor, 0.5, 20);
    } else {
    speedX = -constrain(abs(speedX) * speedFactor, 0.5, 20);
    }

    if (speedY > 0) {
    speedY = constrain(abs(speedY) * speedFactor, 0.5, 20);
    } else {
    speedY = -constrain(abs(speedY) * speedFactor, 0.5, 20);
    }
  }
  
//if mouse clicked on ending note
  let dd = dist(mouseX, mouseY, 760, 425);
  if (dd < 12){
    bgColR = random(0, 255);
    bgColG = random(0, 255);
    bgColB = random(0, 255);
    background(bgColR, bgColG, bgColB);
  }
}