let stroColR = 255;  //line color
let stroColG = 255;
let stroColB = 255;
let stroColT = 255;
let staffYs = [100, 250, 400]; //y position of 3 sets of 5 lines

let notes = [];
let noteTypes = ["whole", "half", "dotted half", "quarter", "dotted quarter", "eighth", "dotted eighth", "sixteenth"]; // all possible note types
//add some rests

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

let specialNoteX;
let specialNoteY;
let creatureActive = false;
let notesActive = false;

let bgColR = 144;
let bgColG = 240;
let bgColB = 232;

let creaColR = 255;
let creaColG = 255;
let creaColB = 255;
let creaColT = 255;
let dia = 80;
let x1 = dia / 2;
let y1 = 200;
let speedX = 3;
let speedY = 3;

function setup() {
  createCanvas(800, 500);
  
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");
  
  let staffIndex = floor(random(0, 3));
  let lineIndex = int(random(-2, 10));  

  //random position for specialnote
  specialNoteX = random(100, 730);
  specialNoteY = staffYs[staffIndex] + lineIndex * 5;
 }

function draw() {
  background(bgColR, bgColG, bgColB);
  
  let noisiness = map(mouseX, 0, width, 0, 1);

//draw lines 
  stroke(stroColR, stroColG, stroColB, stroColT);
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
  if (notesActive) {
    for(let i = 0; i < notes0x.length; i++){
      // draw notes for the first line using notes0x anf notes0y array
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
    let fR = 127 + 127 * sin(frameCount * 0.1);
    let fG = 127 + 127 * sin(frameCount * 0.1 + TWO_PI / 3);
    let fB = 127 + 127 * sin(frameCount * 0.1 + (2 * TWO_PI) / 3);
      drawFermata(760, 400, 1000, noisiness, fR, fG, fB);
  
//draw special note
  push();
  translate(specialNoteX, specialNoteY);
  fill(fR, fG, fB);
  stroke(fR, fG, fB);
  strokeWeight(1);
  ellipse(0, 0, 12, 8); 
  pop();
  
  
// Draw the title "Muse"
  textSize(48);
  fill(fR, fG, fB);
  stroke(255);
  text("Muse", 345, 66);
  stroke(fR, fG, fB);
  noFill();
  stroke(0);
  strokeWeight(1);
  textSize(20);
  text("mp",65,170);
  line(100, 165, 200, 155);
  line(100, 165, 200, 175);
  line(540, 445, 720, 460);
  line(540, 475, 720, 460);
  text("ppp",740,465);
  text("f", 185, 315);
  line(200, 310, 300, 300);
  line(200, 310, 300, 320);
  text("ff", 315,315);
  text("sfz", 620, 315); 
  line(300, 460, 400, 450);
  line(300, 460, 400, 470);
  text("fff", 420, 465);
  text("Ped.", 120, 460);
  line(120, 465, 250, 465);
  textSize(20);
  text("Allegro", 60, 90); 

  
  noFill();
  stroke(0);
  arc(250, 230, 120, 30, PI, TWO_PI); 
  
  if (creatureActive) {
// draw the creature
  stroke(255);
  strokeWeight(1);
  fill(creaColR, creaColG, creaColB, creaColT);

  let noiseValue = noise(frameCount * 0.01);
  let dia = noiseValue * 200;
  let sinValue = sin(frameCount * 0.01);
  x1 = map(sinValue, -1, 1, dia / 2, width - dia / 2);
  let cosValue = cos(-frameCount * 0.01);
  //y1 = map(cosValue, -1, 1, dia / 2, height - dia / 2);
  circle(x1, y1, dia);
  x1 = x1 + speedX;
  y1 = y1 + speedY;
  
 // x2 = map(cosValue, -1, 1, dia / 2, height - dia / 2);
  
//bounce
  if (x1 - dia / 2 < 0 || x1 + dia / 2 > width) {
    speedX = -speedX;
  }
  if (y1 - dia / 2 < 100 || y1 + dia / 2 > 440) {
    speedY = -speedY;
    // Only regenerate if notes are active
    if (notesActive) {
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
  if(y1 + dia / 2 > 100 && y1 - dia / 2 < 140 ){
    stroColG = random(100, 255);
  } else{
    stroColG = 255;
  }
  if(y1 > 250 && y1 < 290 ){
    stroColR = random(100, 255);
  } else{
    stroColR = 255;
  }
  if(y1 + dia / 2 > 400 && y1 - dia / 2 < 440 ){
    stroColB = random(100, 255);
  } else{
    stroColB = 255;
  }
  let creatureDist = dist(x1,y1,760,373);
  if(creatureDist < dia / 2){
    creaColT = lerp(255,0,frameCount*0.01);
  }
  }
  // textSize(20);
  //  text(mouseX + ", " + mouseY, mouseX, mouseY);
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
  //fill(144, 240, 232);
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
  // noStroke();
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
  }
  
  if (mouseX > 345 && mouseX < 460 && mouseY > 32 && mouseY < 66){
    notesActive = true;
   // generateNewNotes();
    
  //empty arrays first...
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
  let dd = dist(mouseX, mouseY, 760, 425);
  if (dd < 12){
  
//   if (mouseX > 745 && mouseX < 770 && mouseY > 375 && mouseY < 390){
    bgColR = random(0, 255);
    bgColG = random(0, 255);
    bgColB = random(0, 255);
    background(bgColR, bgColG, bgColB);
    }
}