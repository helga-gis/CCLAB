let bassArray = [false, false, false, false, false, false, false, false];
let canArray = [false, false, false, false, false, false, false, false];
let sandraArray = [false, false, false, false, false, false, false, false];
let tapeArray = [false, false, false, false, false, false, false, false];
let tongueArray = [false, false, false, false, false, false, false, false];
let boxSize = 100;
let topMargin = 0;

let speed = 5;
let playheadX = -speed;

let bass, can, sandra, tape, tongue;

function preload(){
  bass = loadSound("assets/chestBeat.mp3")
  can = loadSound("assets/brendanCan.mp3")
  sandra = loadSound("assets/sandra.mp3")
  tape = loadSound("assets/tape.mp3")
  tongue = loadSound("assets/tongue.mp3")
}


function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");
}

function draw() {
  background(220);

  // drawBox(50, 50, boxSize, true);
  // drawBox(200, 50, boxSize, false);

  for(let i = 0; i < bassArray.length; i++){
    let x = i*boxSize;
    // bass
    drawBox(x, topMargin+boxSize*0, boxSize, bassArray[i], "🦧");
    // can
    drawBox(x, topMargin+boxSize*1, boxSize, canArray[i], "🥫");
    // sandra
    drawBox(x, topMargin+boxSize*2, boxSize, sandraArray[i], "👩‍💻");
    // tape
    drawBox(x, topMargin+boxSize*3, boxSize, tapeArray[i], "🩹");
    // tongue
    drawBox(x, topMargin+boxSize*4, boxSize, tongueArray[i], "👅");
  }
 
  
  for(let i = 0; i < 15; i++){
    stroke(255, 10, 50, 30)
    strokeWeight(i)
    line(playheadX, 0, playheadX, height);
  }
 

  playheadX+=speed;
  // set back to 0 at end of boxes
  if(playheadX >= bassArray.length*boxSize){
    playheadX = 0;
  }
  // check if we enter a new box:
  // we use % MODULO or REMAINDER
  if(playheadX%boxSize == 0){
    
    let boxIdx = playheadX/boxSize;
    console.log("reached box", boxIdx)
    // bass
    let bassBoxStatus = bassArray[boxIdx]
    // console.log(bassBoxStatus)
    if(bassBoxStatus == true){
      bass.play()
    }
    //can
    let canBoxStatus = canArray[boxIdx]
    // console.log(bassBoxStatus)
    if(canBoxStatus == true){
      can.play()
    }

    // sandra
    let sandraBoxStatus = sandraArray[boxIdx]
    // console.log(bassBoxStatus)
    if(sandraBoxStatus == true){
      sandra.play()
    }

    // tape
    let tapeBoxStatus = tapeArray[boxIdx]
    // console.log(bassBoxStatus)
    if(tapeBoxStatus == true){
      tape.play()
    }

    // tongue
    let tongueBoxStatus = tongueArray[boxIdx]
    // console.log(bassBoxStatus)
    if(tongueBoxStatus == true){
      tongue.play()
    }
  }


}

function drawBox(x, y, size, checked, symbol){
  push();
  translate(x, y);
  stroke(0);
  strokeWeight(2)
  if(checked == true){
    fill(0)
  }else{
    fill(255)
  }

  rect(0, 0, size, size);

  textAlign(CENTER)
  textSize(size*0.8)
  if(checked == true){
    text(symbol, size/2, size*0.8)
  }


  pop();

}


function mousePressed(){
  // console.log(mouseX, mouseY)
  
  if(mouseY > topMargin+boxSize*0 && mouseY < topMargin+boxSize*1 && mouseX < bassArray.length*boxSize){
    // on the boxes YES
    // but which box are we on?

    // index of the box that was clicked:
    let boxIdx = floor(mouseX / boxSize)
    // console.log(mouseX, boxIdx)
    console.log(bassArray[boxIdx])
    
    // flip the corresponding value in the array
    if(bassArray[boxIdx] == false){
      bassArray[boxIdx] = true;
    }else{
      bassArray[boxIdx] = false;
    }
  }

  if(mouseY > topMargin+boxSize*1 && mouseY < topMargin+boxSize*2 && mouseX < canArray.length*boxSize){
    // index of the box that was clicked:
    let boxIdx = floor(mouseX / boxSize)
    
    // flip the corresponding value in the array
    if(canArray[boxIdx] == false){
      canArray[boxIdx] = true;
    }else{
      canArray[boxIdx] = false;
    }
  }


  if(mouseY > topMargin+boxSize*2 && mouseY < topMargin+boxSize*3 && mouseX < sandraArray.length*boxSize){
    // index of the box that was clicked:
    let boxIdx = floor(mouseX / boxSize)
    
    // flip the corresponding value in the array
    if(sandraArray[boxIdx] == false){
      sandraArray[boxIdx] = true;
    }else{
      sandraArray[boxIdx] = false;
    }
  }

  if(mouseY > topMargin+boxSize*3 && mouseY < topMargin+boxSize*4 && mouseX < tapeArray.length*boxSize){
    // index of the box that was clicked:
    let boxIdx = floor(mouseX / boxSize)
    
    // flip the corresponding value in the array
    if(tapeArray[boxIdx] == false){
      tapeArray[boxIdx] = true;
    }else{
      tapeArray[boxIdx] = false;
    }
  }

  if(mouseY > topMargin+boxSize*4 && mouseY < topMargin+boxSize*5 && mouseX < tongueArray.length*boxSize){
    // index of the box that was clicked:
    let boxIdx = floor(mouseX / boxSize)
    
    // flip the corresponding value in the array
    if(tongueArray[boxIdx] == false){
      tongueArray[boxIdx] = true;
    }else{
      tongueArray[boxIdx] = false;
    }
  }

}