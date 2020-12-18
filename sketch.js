var dog,happyDog,database,foodS,foodStock;

var fedTime,lastFed;

var foodObj;

var gameState,readState;

function preload()
{
  dog=loadImage("Dog.png");
  happyDog=loadImage("happydog.png");
  bedroom=loadImage("bedroom.png");
  garden=loadImage("Garden.png");
  washroom=loadImage("washroom.png");
}

function setup() {
  database=firebase.database();

  createCanvas(1000,400);
 
  foodObj=new Food();
  
  foodStock=database.ref("Food");
  foodStock.on("value",readStock);

  readState=database.ref("gameState");
  readState.on("value",function(data){
     gameState=data.val();
  });

  ripster=createSprite(800,200,150,150);
  ripster.addImage(dog);
  ripster.scale=0.3;

  feed=createButton("Feed Ripster");
  feed.position(400,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(500,95);
  addFood.mousePressed(addFoods)
 

}


function draw() {  
 // background(46,139,87);
  currentTime=hour();

  fedTime=database.ref('feedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  if(currentTime==(lastFed+1)){
    update("Playing");
    foodObj.garden();
  }
  else if(currentTime==(lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();
  }
  else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
    foodObj.washroom();
  }
  else{
    update("Hungry");
    foodObj.display();
  }
  
  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    ripster.remove();
  }
  else{
    feed.show();
    addFood.show();
    ripster.addImage(dog);
  }
  
  drawSprites();
  
  /*textSize(15);
  fill("white");
  text("Note:-Press UP_ARROW key to feed ripster",150,20);
  text("Ripster",250,400);
  text("Milk Bottles:-"+foodS,230,100);*/
}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  ripster.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    feedTime:hour()
  })
}

function addFoods(){
   foodS++;
   database.ref('/').update({
     Food:foodS
   })
}

function update(state){
  database.ref('/').update({
    gameState:state
  })

  
}



/*function writeStock(x){
  
  if(x<=0){
    x=0;
  }
  else{
    x-=1;
  }

  database.ref('/').update({
    Food:x
  })
}*/

