window.onload = function(){init()};
//var timer;

var canvasWidth = 600;
var canvasHeight = 600;
var img = new Image();

var menuFileClicked = false;
var menuEditClicked = false;
var imageToBeEdited = null;
var canvasClicked = false;

var menuItem = "";
var selectedColor = {"red": 0, "green": 0, "blue": 0};
var lineWidth = 1;
var downPos = {"x": -1, "y": -1};
var upPos = {"x": -1, "y": -1};
var hoverPos = {"x": -1, "y": -1};

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

function formatSelectedColor()
{
  //  So unfortunately, JS toString(radix) does not pad zero indexed colors,
  //  for example the value "0" would be "0" and not "#00", which canvas
  //  requires. So the following few lines of code are required to check if
  //  the hex number is formatted correctly.

  var colorString = String(parseInt(selectedColor.red).toString(16));
  if(colorString.length % 2 != 0)
  {
    colorString += "0";
  }

  colorString += String(parseInt(selectedColor.green).toString(16));
  if(colorString.length % 2 != 0)
  {
    colorString += "0";
  }

  colorString += String(parseInt(selectedColor.blue).toString(16));
  if(colorString.length % 2 != 0)
  {
    colorString += "0";
  }

  return colorString;
}

function downLocation(evt)
{
  if(menuItem != "")
  {
    var canvas = document.getElementById("main.canvas");

    var x = evt.pageX - canvas.offsetLeft;
    var y = evt.pageY - canvas.offsetTop;

    console.log("main.canvas mousedown at: (" + String(x) + "," + String(y) + ")");

    downPos.x = x;
    downPos.y = y;
    canvasClicked = true;
  }
}

//  The current system works for the draw line tool, although it's a bit quirky,
//  but it is not functional for the polygon tool and probably for the draw
//  tool.  The best system is probably to pair both the mousedown and mouseup
//  events after the tool has been slected.
function upLocation(evt)
{
  var canvas = document.getElementById("main.canvas");

  var x = evt.pageX - canvas.offsetLeft;
  var y = evt.pageY - canvas.offsetTop;
  upPos.x = x;
  upPos.y = y;

  console.log("main.canvas mouseup at: (" + String(x) + "," + String(y) + ")");

  if(canvasClicked)
  {
    if(menuItem == "Line Tool")
    {
      var context = canvas.getContext("2d");

      context.beginPath();
      context.moveTo(downPos.x, downPos.y);
      context.lineTo(x, y);
      context.lineWidth = lineWidth;
      console.log(context.lineWidth);
      context.strokeStyle = "#" + formatSelectedColor();
      console.log(context.strokeStyle);
      context.stroke();
    }

    if(menuItem == "Polygon Tool")
    {
      var context = canvas.getContext("2d");

      context.beginPath();
      context.rect(downPos.x, downPos.y, x - downPos.x, y - downPos.y);
      context.lineWidth = lineWidth;
      console.log(context.lineWidth);
      context.strokeStyle = "#" + formatSelectedColor();
      console.log(context.strokeStyle);
      context.stroke();

      console.log();
    }

  }
  canvasClicked = false;
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

  var updatedWidth = $("#main\\.controls\\.canvas\\.width").val();
  var updatedHeight = $("#main\\.controls\\.canvas\\.height").val();

  //  The following two conditions can probably be thrown out if the values are added to the HTML file instead of checking on them
  if(updatedWidth <= 0 || updatedWidth == undefined || updatedWidth == null)
  {
    updatedWidth = 600;
  }

  if(updatedHeight <= 0 || updatedHeight == undefined || updatedHeight == null)
  {
    updatedHeight = 600;
  }

  var canvas = document.getElementById("main.canvas")

  fillScreen("#FFFFFF");
  canvas.width = updatedWidth;
  canvas.height = updatedHeight;
  canvasWidth = updatedWidth;
  canvasHeight = updatedHeight;

  canvas.getContext("2d").drawImage(img, 0, 0, canvasWidth, canvasHeight);
  fillScreen("#FFFFFF");

  menuClicked = true;
}

/*
  So, apparently the only officially supported image type is PNG.  Some browsers
  support other formats by default, FireFox, but others, Chrome, do not.
*/
function download(evt)
{
  console.log("main.controls.canvas.download");

  console.log("Selected format: " + $("#main\\.controls\\.format").val());
  var format = $("#main\\.controls\\.canvas\\.format").val();

  var url = document.getElementById("main.canvas").toDataURL("image/" + format.toLowerCase());
  console.log("image/" + format.toLowerCase());
  document.getElementById("main.controls.canvas.download").href = url;
  document.getElementById("main.controls.canvas.download").download = "image." + format.toLowerCase();
}

function menuFile()
{
  console.log("main.menu.file");
  var option = $("#main\\.menu\\.file").val();

  if(menuFileClicked && option != "File")
  {
    console.log("selected: " + option);
    menuItem = option;

    menuFileClicked = false;

    if(option == "Download Image")
    {
      download();
    }

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
    menuItem = option;

    menuEditClicked = false;
    return;
  }

  menuEditClicked = true;
}

function colorSubmit(evt)
{
  console.log("main.color.rgb");
  evt.preventDefault();

  //  Unfortunately, JS is not a strongly typed language. Thus, we have to cast
  //  keyboard input from strings to integers before we can reset the radix
  var red = parseInt($("#main\\.controls\\.color\\.rgb\\.red").val());
  var green = parseInt($("#main\\.controls\\.color\\.rgb\\.green").val());
  var blue = parseInt($("#main\\.controls\\.color\\.rgb\\.blue").val());
  var width = parseInt($("#main\\.controls\\.color\\.rgb\\.width").val());

  if(red > -1 && red < 256 && red != null && red != undefined)
  {
    selectedColor.red = $("#main\\.controls\\.color\\.rgb\\.red").val();
  }

  if(green > -1 && green < 256 && green != null && green != undefined)
  {
    selectedColor.green = $("#main\\.controls\\.color\\.rgb\\.green").val();
  }

  if(blue > -1 && blue < 256 && blue != null && blue != undefined)
  {
    selectedColor.blue = $("#main\\.controls\\.color\\.rgb\\.blue").val();
  }

  if(width > 0 && width != null && width != null)
  {
    lineWidth = width;
  }

  console.log("Width: " + String(width));
  console.log("Color: #" + formatSelectedColor());
  $("#main\\.controls\\.color\\.sample").css("background-color", "#" + formatSelectedColor());
}

function init()
{
  console.log("JavaScript file loaded correctly");

  $("#main\\.controls\\.canvas").submit(controlsSubmit);
  $("#main\\.menu\\.file").click(menuFile);
  $("#main\\.menu\\.edit").click(menuEdit);
  $("#main\\.canvas").mousedown(upLocation);
  $("#main\\.canvas").mouseup(downLocation);
  $("#main\\.controls\\.canvas\\.image").change(loadImage)
  $("#main\\.controls\\.color\\.rgb").submit(colorSubmit);
  $("#main\\.controls\\.canvas\\.download").click(download);

  fillScreen("#FFFFFF");
  //  In retrospect, this is probably not necessary because there are not
  //  animations in this applications - only stationary images which are procedurally edited
}



/*
  TODO:
  Add custom cursors for different tools?

  Implement import/export formats

  Implement a "context cursor" or something similar which allows users to see
  where the mousedown position is located. A crosshair or something similar
  would work well.

*/
