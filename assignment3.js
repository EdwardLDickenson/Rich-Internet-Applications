var timer;
var canvasWidth = 600;
var canvasHeight = 600;
var spriteWidth = 45;
var spriteHeight = 120;
var xPos = 0;
var yPos = canvasHeight - spriteHeight;
var xV = 0;
var yV = 0;
var spriteIndex = 0;
var rects = [];
var maxRects = 5;
var score = 0;

function kvent(e)
{
  if(e.keyCode == '37')
  {
    xV -= 5;
  }

  if(e.keyCode == '39')
  {
    xV += 5;
  }

  if(e.keyCode == '32' && yPos > (canvasHeight / 4 * 2))  // The user can only jump if the top of sprite is less than three fifths of the height of the screen (can only jump twice)
  {
    yV -= 10;
  }
}

function figureWall()
{
  if(xPos < 0 || xPos + xV < 0 || xPos + spriteWidth > canvasWidth || xPos + xV + spriteWidth > canvasWidth || yPos > canvasHeight || yPos + yV > canvasHeight || yPos < 0 || yPos + canvasHeight < 0)
  {
    xV = 0;
  }

  if(yPos + spriteHeight > canvasHeight )
  {
    yPos = canvasHeight - spriteHeight;
  }

  if(yPos < 0)
  {
    yPos = 0;
  }
}

function rectsWall()
{
  for(var i = 0; i < rects.length; ++i)
  {
    if(rects[i].x <= 0)
    {
      var tmp = rects.splice(i, maxRects);
      rects = rects.splice(0, i - 1);
      rects = rects.concat(rects, tmp);
    }
  }
}

function figureRect()
{
  for(var i = 0; i < rects.length; ++i)
  {
    if(!(xPos + spriteWidth < rects[i].x || xPos > rects[i].x + rects[i].width || yPos + spriteHeight < rects[i].y || yPos > rects[i].y + rects[i].height))
    {
      window.alert("Game over!\nYour Score was: " + String(score));
      clearInterval(timer);
    }
  }
}

function collision()
{
  figureWall();
  rectsWall();
  figureRect();
}

function draw()
{
  var canvas = document.getElementById("game");
  var context = canvas.getContext("2d");

  context.beginPath();
  context.rect(0, 0, 600, 600);
  context.fillStyle = "#999999";
  context.fill();

  context.beginPath();
  for(var i = 0; i < rects.length; ++i)
  {
    context.rect(rects[i].x, rects[i].y, rects[i].width, rects[i].height);
    context.fillStyle = "#FF0000";
    context.fill();
  }
  context.closePath();

  //  Ideally, this logic should probably be self-contained in a separate function to handle multiple different sprites
  //  and sprite sheets, but I'm not certain how having multiple contexts would function in that case so we will keep
  //  track of which sprite is presently being displayed using a global iterator.
  var figure = new Image();
  //  I went with my own sprite sheet for this project. It's not pretty, but it works in a funky homebrew sense. The
  //  "artwork" was created in paint and I probably would have been better served by making a few more transitional
  //  frames for the sprite because walking looks quite fast.  Also, the borders between frames are not perfect
  figure.src = "spritesheet.png";
  context.drawImage(figure, spriteIndex * spriteWidth, 0, spriteWidth, spriteHeight, xPos, yPos, spriteWidth, spriteHeight);
}

function move()
{
  xPos += xV;
  yPos += yV;

  if(xV > 0)
  {
    spriteIndex += 1;
    if(spriteIndex > 4)
    {
        spriteIndex = 0;
    }
  }

  if(xV < 0)
  {
    spriteIndex -= 1;
    if(spriteIndex < 0 )
    {
        spriteIndex = 4;
    }
  }

  if(yPos + spriteHeight < canvasHeight)
  {
    ++yV;
  }
}

function makeTop()
{
  var rect = {};

  var height = Math.floor(Math.random() * canvasHeight / 4) + (Math.random() * canvasHeight / 6);
  rect.height = height;
  var width = Math.floor(Math.random() * canvasWidth / 10) + (Math.random() * canvasWidth / 20);
  rect.width = width;

  rect.x = canvasWidth - width;
  rect.y = 0;

  rects.push(rect);
}

function makeBottom()
{
  var rect = {};

  var height = Math.floor(Math.random() * canvasHeight / 4) + (Math.random() * canvasHeight / 8);
  rect.height = height;
  var width = Math.floor(Math.random() * canvasWidth / 10) + (Math.random() * canvasWidth / 20);
  rect.width = width;

  rect.x = canvasWidth - width;
  rect.y = canvasHeight - height;

  rects.push(rect);
}

function chance()
{
  if(rects.length < maxRects)
  {
    if(Math.floor(Math.random() * 100) + 1 == 50)
    {
      makeTop();
    }

    if(Math.floor(Math.random() * 100) + 1 == 51)
    {
      makeBottom();
    }
  }
}

function moveRects()
{
  for(var i = 0; i < rects.length; ++i)
  {
    rects[i].x -= 1;

    if(xPos >= rects[i].x && yPos + spriteHeight < rects[i].y)
    {
      score += 1;
      document.getElementById("score").innerHTML = "Score: " + String(score);
    }
  }
}

function main()
{
  draw();
  collision();
  move();
  chance();
  moveRects();
}

function init()
{
  timer = setInterval(main, 40);
}
window.onload = function(){init()};
document.onkeydown = kvent;
