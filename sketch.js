var dog,happyDog,database,foodS,foodStock;
var feedPet,addDog;
var fedTime,lastFed;
var foodObj;
var readState;
var gameState = 0;
foodS = 30;
var currentTime;
var bedroomImg,washroomImg,gardenImg;
function preload()
{
  //load images here
dogImg = loadImage("images/dogImg.png");
dogHappy = loadImage("images/dogImg1.png");
bedroomImg = loadImage("images/BedRoom.png");
gardenImg = loadImage("images/Garden.png");
washroomImg = loadImage("images/WashRoom.png");


}

function setup() {
  database = firebase.database();
    console.log(database);
   
  createCanvas(550,650);
  readState = database.ref('gameState');
   readState.on("value",function(data){
     gameState = data.val();
   });
  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

 dog =  createSprite(280,550,50,50);
 dog.addImage(dogImg); 
 dog.scale = 0.2;

 
 feed = createButton("Feed the Dog")
 feed.position(500,95);
 feed.mousePressed(feedDog)

 addFood = createButton("Add Food")
addFood.position(596,95);
addFood.mousePressed(addFoods);

}


function draw() {  
background(46,139,87);

currentTime = hour();
if(currentTime==(lastFed+1)){
  update("Playing");
  foodObj.garden();
}else if(currentTime==(lastFed+2)){
  update("Sleeping");
  foodObj.bedroom();
}else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
  update("Bathing");
  foodObj.washroom();
}else{
  update("Hungry");
  foodObj.display();
}


fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  })
  
  fill(255,255,254);
  textSize(15)
  if(lastFed>=12){
    text("Last Feed : " + lastFed%12 + "PM",350,30);
  }
  else if(lastFed == 0){
    text("Last Feed : 12 AM ",350,30);
  }else{
    text("Last Feed : " + lastFed + "AM ",350,30);
  }



  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
    foodObj.hide();
  }else{
    feed.show();
    addFood.show();
    dog.addImage(dogImg);
  }


 
  drawSprites();
}

function readStock(data){

foodS = data.val();
foodObj.updateFoodStock(foodS);

}

function feedDog(){

  dog.addImage(dogHappy);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1)
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
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