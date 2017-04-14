window.onload = function(){init()};
var timer;

var canvasWidth = 600;
var canvasHeight = 600;

function controlsSubmit(e)
{
  console.log("main.controls.submit");
  e.preventDefault();
}

function menuFile()
{
  console.log("main.menu.file");
  
}

function menuEdit()
{
  console.log("main.menu.edit");
}

function uploadImage()
{
  console.log("Uploading image");
}

function fillScreen()
{
  var canvas = document.getElementById("main.canvas");
  var context = canvas.getContext("2d");

  context.rect(0, 0, canvasWidth, canvasHeight);
  context.fillStyle = "#FFFFFF";
  context.fill();
}

function main()
{

}

function init()
{
  console.log("JavaScript file loaded correctly");

  $("#main\\.controls\\.submit").click(controlsSubmit);
  $("#main\\.menu\\.file").click(menuFile);
  $("#main\\.menu\\.edit").click(menuEdit);


  //$("#main\\.menu\\.file\\.upload").click(uploadImage);

  fillScreen();
  timer = setInterval(main(), 50);
}
