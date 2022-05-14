var PLAY = 1
var END = 0
var gameState = 1
var score = 0

var dantheman,dantheman_running,dantheman_jump,dantheman_collided;
var invisibleGround,bg,backgroundImg,restart,restartImg

function preload(){
     backgroundImg = loadImage("background.png");
     dantheman_running = loadAnimation("dantheman1.png","dantheman2.png","dantheman3.png","dantheman4.png")
     dantheman_jump = loadImage("dantheman_jump-removebg-preview.png")
     dantheman_collided = loadAnimation("dantheman_die.png")
     restartImg=loadImage("restart.png")
     obstacle1 = loadImage("enemy.png")
     obstacle2 = loadImage("snake.png")
     checkPoint = loadSound("checkpoint.mp3")
}

function setup() {
    
     createCanvas(windowWidth,windowHeight)

 bg = createSprite(1000,200,30,40) 
 bg.addImage(backgroundImg)
bg.scale = 1

dantheman=createSprite(150,height-150,30,60)
dantheman.addAnimation("running",dantheman_running);
dantheman.addAnimation("collided",dantheman_collided);


invisibleGround = createSprite(500,640,2000,10);
  invisibleGround.visible = false;

restart= createSprite(470,697/2);
restart.addImage(restartImg)

  obstaclesGroup = createGroup();
 
  dantheman.setCollider("rectangle",0,0,50,150);
  dantheman.debug=true

  obstaclesGroup = createGroup();
}

function draw() {


 background(0)
 
 if(gameState === PLAY){

restart.visible = false

bg.velocityX = -(4 + 3* score/300)

score = score + Math.round(getFrameRate()/60)

//dantheman.visible=true

if(score%100 === 0){
checkPoint.play()
}


if (bg.x < 500){
     bg.x = bg.width/2;
   }

   if(keyDown("space")&& dantheman.y >= height- 145) {
    dantheman.velocityY = -15;
   }

   dantheman.velocityY = dantheman.velocityY + 0.8
  
//spawnObstacles
spawnObstacles();



if(obstaclesGroup.isTouching(dantheman)){
  console.log("obstacleTouched")
  gameState = END;
 }
 }
else if(gameState === END){
  console.log("end called")
  restart.visible = true

  dantheman.changeAnimation("collided", dantheman_collided);


  bg.velocityX = 0;
  
      dantheman.velocityY = 0

      obstaclesGroup.setLifetimeEach(-1);

      obstaclesGroup.setVelocityXEach(0);


     
}

if(mousePressedOver(restart)){
  reset();
}

 drawSprites();
fill("green")
 textSize(30)
 text("Score: "+ score,1200,65,100,100);

dantheman.collide(invisibleGround);
 
}


function reset(){
  gameState = PLAY;


  restart.visible = false;
  
  obstaclesGroup.destroyEach();



  dantheman.changeAnimation("running",dantheman_running);

  score = 0;
}

function spawnObstacles(){
  if (frameCount % 60 === 0){
    var obstacle = createSprite(1500,height-80,50,30);
    obstacle.velocityX = -(6 + score/100);
    
     //generate random obstacles
     var rand = Math.round(random(1,2));
     switch(rand) {
       case 1: obstacle.addImage(obstacle1);
       obstacle.setCollider("rectangle",0,0,360,300)
       obstacle.scale = 0.3
               break;
       case 2: obstacle.addImage(obstacle2);
       obstacle.scale = 0.5
               break;
               default: break;
     }
     obstacle.debug = false
     
     obstacle.lifetime = 300;
    
    //add each obstacle to the group
     obstaclesGroup.add(obstacle);
  }
}