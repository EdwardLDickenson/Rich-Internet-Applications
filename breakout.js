window.onload = function(){init()}
document.onkeydown = kvent;

var paddleScore = 1;
var score = 0;
var launched = false;
var paused = false;
var updateInterval = 30; // 50ms
var canvasWidth = 600;
var canvasHeight = 600;
var timer;

var blockWidth = 50;
var blockHeight = 20;

var paddle = {};
var ball = {};

var blocks = [];

function board()
{
	var i = 0;
	while(blockWidth * i < canvasWidth - blockWidth * 2)
	{
		var j = 1;

		while(blockHeight * j < canvasHeight / 2)
		{
			var block = {};
			block.x = blockWidth * i + blockWidth;
			block.y = blockHeight * j;

			blocks.push(block);
			++j;
		}
		++i;
	}
}

function init()
{
	timer = setInterval(frame, updateInterval);
	board();

	paddle.width = 100;
	paddle.height = 20;
	paddle.x = (canvasWidth / 2) - paddle.width / 2;
	paddle.y = canvasHeight - paddle.height;
	paddle.xv =  0;

	ball.rad = 6;
	ball.x = (canvasWidth / 2) - (ball.rad / 2);
	ball.y = paddle.y - ball.rad - 1;
	ball.xv = 0;
	ball.yv = 0;
}

function kvent(e)
{
	if(!paused)
	{
		if(e.keyCode == '37' && paddle.x > 0)
		{
			paddle.xv -= 5;

			if(!launched)
			{
				ball.xv -= 5;
			}
		}

		if(e.keyCode == '39' && (paddle.x + paddle.width) < canvasWidth)
		{
			paddle.xv += 5;

			if(!launched)
			{
				ball.xv += 5;
			}
		}

		if(e.keyCode == '107')
		{
			updateInterval -= 10; // 10ms
			++paddleScore;
			clearInterval(timer);
			timer = setInterval(frame, updateInterval);
		}

		if(e.keyCode == '109')
		{
			updateInterval += 10; // 10ms
			--paddleScore;
			clearInterval(timer);
			timer = setInterval(frame, updateInterval);
		}
	}

	if(e.keyCode == "32")
	{
		if(!launched)
		{
			launched = true;
			ball.xv = 5;
			ball.yv = -6;
		}

		else
		{
			paused = !paused;
		}
	}
}

function frame()
{
	if(!paused)
	{
		draw();
		checkCollision();
	}
}

function reflectBallX()
{
	ball.xv = -ball.xv;
}

function reflectBallY()
{
	ball.yv = -ball.yv;
}

function circleRectCollision(ballX, ballY, rad, rectX, rectY, rectW, rectH)
//function circleRectCollision(ball, rect, rWidth, rHeight)
{
	if(ballX + rad / 2 < rectX || ballX + rad / 2 > rectX + rectW ||
	ballY + rad / 2< rectY || ballY - rad / 2 > rectY + rectH)
	//if(ball.x + ball.rad / 2 < rect.x || ball.x + ball.rad / 2 > rect.x + rWidth || ball.y + ball.rad / 2 < rect.y || ball.y - ball.rad / 2 > rect.y + rHeight)
	{
		return false;
	}

	return true;
}

function circleRectSide(ballX, ballY, rad, rectX, rectY, rectW, rectH)
//function circleRectSide(ball, rect, rWidth, rHeight)
{
	if((ballX + rad / 2 == rectX || ballX + rad / 2 == rectX + rectW) && (ballY + rad / 2 > rectY && ballY - rad / 2 < rectY + rectH))
	//if((ball.x + ball.rad / 2 == rect.x || ball.x + ball.rad / 2 == rect.x + rWidth) && (ball.y + ball.rad / 2 > rect.y && ball.y - ball.rad / 2 < rect.y + rHeight))
	{
		return true;
	}

	return false;
}

function ballRectCollision()
{
	if(circleRectCollision(ball.x, ball.y, ball.rad, paddle.x, paddle.y, paddle.width, paddle.height))
	//if(circleRectCollision(ball, paddle, blockWidth, blockHeight))
	{
		reflectBallY();

		score += paddleScore;
		updateScoreDiv();
	}

	if(circleRectSide(ball.x, ball.y, ball.rad, paddle.x, paddle.y, paddle.width, paddle.height))
	//if(circleRectSide(ball, paddle, blockWidth, blockHeight))
	{
		reflectBallX();

		score += paddleScore;
		updateScoreDiv();
	}
}

function removeBlock(blockToBeRemoved)
{
	blocks.splice(blockToBeRemoved, 1);
}

function ballBlockCollision()
{
	for(var i = 0; i < blocks.length; ++i)
	{
		if(circleRectSide(ball.x, ball.y, ball.rad, blocks[i].x, blocks[i].y, blockWidth, blockHeight))
		//if(circleRectSide(ball, blocks[i], blockWidth, blockHeight))
		{
			reflectBallX();

			score += paddleScore;
			updateScoreDiv();

			removeBlock(i);
			return;
		}

		if(circleRectCollision(ball.x, ball.y, ball.rad, blocks[i].x, blocks[i].y, blockWidth, blockHeight) /*&& !circleRectSide(ball.x, ball.y, ball.rad, blocks[i].x, blocks[i].y, blockWidth, blockHeight)*/)
		//if(circleRectCollision(ball, blocks[i], blockWidth, blockHeight))
		{
			reflectBallY();

			score += paddleScore;
			updateScoreDiv();

			removeBlock(i);
		}
	}
}

function checkBallCollision()
{
	if(launched)
	{
		if(ball.x + ball.rad >= canvasWidth || ball.x - ball.rad <= 0)
		{
			reflectBallX();
		}
	}

	else
	{
		if(paddle.x + paddle.width >= canvasWidth || paddle.x <= 0)
		{
			ball.xv = 0;
		}
	}

	if(ball.y - ball.rad <= 0)
	{
		reflectBallY();
	}

	if(ball.y - ball.rad >= canvasWidth)
	{
		window.alert("Game over!\nScore: " + score);
		clearInterval(timer);
	}
}

function checkRectCollision()
{
	if(paddle.x + paddle.width >= canvasWidth || paddle.x <= 0)
	{
		paddle.xv = 0;
	}
}

function checkCollision()
{
	checkBallCollision();
	checkRectCollision();
	ballRectCollision();
	ballBlockCollision();
}

function updateScoreDiv()
{
	var scoreDiv = document.getElementById("scoreDiv");
	scoreDiv.innerHTML = "Score: " + score;
}

function drawRect(x, y, width, height, color)
{
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");

	context.beginPath();
	context.rect(x, y, width, height);
	context.fillStyle = color;
	context.fill();
	context.closePath();
}

function drawCircle(x, y, rad, color)
{
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");

	context.beginPath();
	context.arc(x, y, rad, 0, 2 * Math.PI);
	context.fillStyle = color;
	context.fill();
	context.closePath();
}

function draw()
{
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");

	ball.x += ball.xv;
	ball.y += ball.yv;
	paddle.x += paddle.xv;

	/*These conditions can probably be turned into an equation that check if the new location of the paddle will be outside of the canvas*/
	/*This would be a great application for saturated arithmetic*/
	if(paddle.x + paddle.width > canvasWidth)
	{
		paddle.x = canvasWidth - paddle.width;
		paddle.xv = 0;
	}

	if(paddle.x < 0)
	{
		paddle.x = 0;
		paddle.xv = 0;
	}

	drawRect(0, 0, canvasWidth, canvasHeight, "#999999");
	drawRect(paddle.x, paddle.y, paddle.width, paddle.height, "#0000FF");

	for(var i = 0; i < blocks.length; ++i)
	{
		drawRect(blocks[i].x, blocks[i].y, blockWidth, blockHeight, "#880000");
		drawRect(blocks[i].x + 2, blocks[i].y + 2, blockWidth - 2, blockHeight - 4, "#FF0000");
	}

	drawCircle(ball.x, ball.y, ball.rad, "#FFFF00");
}
