window.onload = function(){init()};
var timer;

var canvasWidth = 600;
var canvasHeight = 600;

var menuFileClicked = false;
var menuEditClicked = false;
var imageToBeEdited = null;

/*function uploadImage()
{
  console.log("Uploading image");

  $("#main\\.menu\\.file\\.upload").find("#main\\.menu\\.file\\.upload\\.image").remove();

  // $("#main\\.menu\\.file\\.upload").append("<input type=\"file\" value=\"image\" id=\"main.menu.file.upload.image\">");
  //$("#main\\.menu\\.file\\.upload\\.image").click();
}*/

function createContext()
{
  var canvas = document.getElementById("main.canvas");
  var context = canvas.getContext("2d");

  return context;
}

function drawLoadedImage(img)
{
  console.log(img.width);
  createContext().drawImage(img, 0, 0);
}

//http://stackoverflow.com/questions/6775767/how-can-i-draw-an-image-from-the-html5-file-api-on-canvas
function loadImage(e)
{
  var img = new Image;
  img.src = URL.createObjectURL(e.target.files[0]);

  //img.onload = drawLoadedImage(img);
  //  Cannot seem to offload this to an external function
  img.onload = function() {
    if(canvasWidth != img.width)
    {
      canvasWidth = img.width;
      var canvas = document.getElementById("main.canvas").width = canvasWidth;
    }

    if(canvasHeight != img.height)
    {
      canvasHeight = img.height;
      var canvas = document.getElementById("main.canvas").height = canvasHeight;
    }

    createContext().drawImage(img, 0, 0);
    imageToBeEdited = img;
  }
}

function controlsSubmit(e)
{
  console.log("main.controls.submit");
  e.preventDefault();

  menuClicked = true;
}

function menuFile()
{
  console.log("main.menu.file");
  var option = $("#main\\.menu\\.file").val();

  if(menuFileClicked && option != "File")
  {
    console.log("selected: " + option);

    menuFileClicked = false;
    return;
  }

  menuFileClicked = true;
}

function menuEdit()
{
  console.log("main.menu.edit");
  var option = $("#main\\.menu\\.edit").val();

  if(menuEditClicked && option != "Edit")
  {
    console.log("selected: " + option);

    menuEditClicked = false;
    return;
  }

  menuEditClicked = true;
}

function fillScreen()
{
  /*var canvas = document.getElementById("main.canvas");
  var context = canvas.getContext("2d");*/

  var context = createContext();

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

  $("#main\\.controls").submit(controlsSubmit);
  $("#main\\.menu\\.file").click(menuFile);
  $("#main\\.menu\\.edit").click(menuEdit);
  $("#main\\.controls\\.image").change(loadImage);

  fillScreen();
  //  In retrospect, this is probably not necessary because there are not
  //  animations in this applications - only stationary images which are procedurally edited
  timer = setInterval(main(), 50);
}
