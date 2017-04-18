window.onload = function(){init()};
var timer;

var canvasWidth = 600;
var canvasHeight = 600;
var img = new Image();

var menuFileClicked = false;
var menuEditClicked = false;
var imageToBeEdited = null;

function createContext()
{
  var canvas = document.getElementById("main.canvas");
  var context = canvas.getContext("2d");

  return context;
}
function fillScreen(str)
{
  var context = createContext();

  context.rect(0, 0, canvasWidth, canvasHeight);
  context.fillStyle = str;
  context.fill();
}

function loadImage(e)
{
  //var img = new Image;
  img.src = URL.createObjectURL(e.target.files[0]);

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
  console.log("main.controls.update");
  e.preventDefault();

  var updatedWidth = $("#main\\.controls\\.size\\.width").val();
  var updatedHeight = $("#main\\.controls\\.size\\.height").val();

  //  The following two conditions can probably be thrown out if the values are added to the HTML file instead of checking on the
  if(updatedWidth <= 0 || updatedWidth == undefined || updatedWidth == null)
  {
    updatedWidth = 600;
  }

  if(updatedHeight <= 0 || updatedHeight == undefined || updatedHeight == null)
  {
    updatedHeight = 600;
  }

  var canvas = document.getElementById("main.canvas")
  canvas.width = updatedWidth;
  canvas.height = updatedHeight;

  canvasWidth = updatedWidth;
  canvasHeight = updatedHeight;

  fillScreen("#FFFFFF");
  canvas.width = updatedWidth;
  canvas.height = updatedHeight;
  img.width = updatedWidth;
  img.height = updatedHeight;

  canvasWidth = updatedWidth;
  canvasHeight = updatedHeight;

  //fillScreen("#FFFFFF");
  var context = canvas.getContext("2d");
  context.drawImage(img, 0, 0);

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

  fillScreen("#FFFFFF");
  //  In retrospect, this is probably not necessary because there are not
  //  animations in this applications - only stationary images which are procedurally edited
  timer = setInterval(main(), 50);
}
