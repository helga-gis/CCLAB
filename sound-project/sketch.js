let xArray = [];
let yArray = [];
let diaArray = [];
let redArray = [];

let initalSizeOfArray = 5; // i can use any number here
let bap;

function preload(){
  bap = loadSound("sounds/8000__cfork__cf_fx_bloibb.mp3")
}


function setup() {
  createCanvas(800, 500);
 
  
  for(let i = 0; i < initalSizeOfArray; i++){

    xArray[i] = random(0, width);
    yArray[i] = random(0, height);
    diaArray[i] = random(5,15);
    redArray[i] = random(0, 255);

  }
  
}

function draw() {
  background(220);

  for(let i = 0; i < xArray.length; i++){

  // xArray[0] += 1;



    let x = xArray[i];
    let y = yArray[i];
    //circle(x, y, 20);


    xArray[i] += random(-1,1);
    yArray[i] += random(-1,1);
    
    fill(redArray[i], 255, 255)
    circle(x,y, diaArray[i]);

  }
  

}




function mousePressed(){
  bap.play()
  xArray.push(mouseX);
  yArray.push(mouseY);
  diaArray.push(random(10,50));


}