// Set up canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// Get width and height from canvas element
var width = canvas.width;
var height = canvas.height;

// Work out the width and height in blocks
var blockSize = 10;
var widthInBlocks = width / blockSize;
var heightInBlocks = height / blockSize;

// Set the score to zero
var score = 0;

// Draw the border
var drawBorder = function () {
	ctx.fillStyle = "Gray";
	ctx.fillRect(0, 0, width, blockSize);
	ctx.fillRect(0, height - blockSize, width, blockSize);
	ctx.fillRect(0, 0, blockSize, height);
	ctx.fillRect(width - blockSize, 0, blockSize, height);
};

// Draw the score in the top left corner
var drawScore = function () {
	ctx.font = "20px Courier";
	ctx.fillStyle = "Black";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Score: " + score, blockSize, blockSize);
};

// Clear the interval and display Game Over text	
var gameOver = function () {
	clearInterval(intervalId);
	ctx.font = "60px Courier";
	ctx.fillStyle = "Black";
	ctx.textAlign = "center";
	ctxBaseline = "middle";
	ctx.fillText("Game Over", width / 2, height / 2);
};

// Draw a circle (using the function from Ch 14)
var circle = function (x, y, radius, fillCircle) {
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI * 2, false);
	if (fillCircle) {
		ctx.fill();
	} else {
		ctx.stroke();
	}
};

// The Block constructor
var Block = function (col, row) {
	this.col = col;
	this.row = row;
};

// Draw a square at the block's location
Block.prototype.drawSquare = function (color) {
	var x = this.col * blockSize;
	var y = this.row * blockSize;
	ctx.fillStyle = color;
	ctx.fillRect(x, y, blockSize, blockSize);
};

Block.prototype.drawCircle = function (color) {
	var centerX = this.col * blockSize + blockSize / 2;
	var centerY = this.row * blockSize + blockSize / 2;
	ctx.fillStyle = color;
	circle(centerX, centerY, blockSize / 2, true);
};	

// Check if this block is in the same location as another block
Block.prototype.equal = function (otherBlock) {
	return this.col === otherBlock.col && this.row === otherBlock.row;
};

// The Snake constructor
var Snake = function () {
	this.segments = [
		new Block(7, 5),
		new Block(6, 5),
		new Block(5, 5)
	];
	
	this.direction = "right";
	this.nextDirection = "right";
};

// Draw a square for each segment of the snake's body
Snake.prototype.draw = function () {
	for (var i = 0; i < this.segments.length; i++) {
		this.segments[i].drawSquare("Blue");
	}
};

// Create a new head and add it to the beginning of 
// the snake to move the snake in its current direction
Snake.prototype.move = function () {
	var head = this.segments[0];
	var newHead;
	
	this.direction = this.nextDirection;
	
	if (this.direction === "right") {
		newHead = new Block(head.col + 1, head.row);
	} else if (this.direction === "down") {
		newHead = new Block(head.col, head.row + 1);
	} else if (this.direction === "left") {
		newHead = new Block(head.col - 1, head.row);
	} else if (this.direction === "up") {
		newHead = new Block(head.col, head.row - 1);
	}
	
	if (this.checkCollison(newHead)) {
		gameOver();
		return;
	}
	
	this.segments.unshift(newHead);
	
	if (newHead.equal(apple.position)) {
		score++;
		apple.move();
	} else {
		this.segments.pop();
	}
};

// Check if the snake's new head has collided with the wall or itself
Snake.prototype.checkCollison = function (head) {
	var leftCollison = (head.col === 0);
	var topCollison = (head.row === 0);
	var rightCollison = (head.col === widthInBlocks - 1);
	var bottomCollison = (head.row === heightInBlocks -1);
	
	var wallCollison = leftCollison || topCollison || 
		rightCollison || bottomCollison;
		
	var selfCollison = false;
	
	for (var i = 0; i < this.segments.length; i++) {
		if (head.equal(this.segments[i])) {
			selfCollison = true;
		}
	}
	
	return wallCollison || selfCollison;
};

// Set the snake's next direction based on the keyboard
Snake.prototype.setDirection = function (newDirection) {
	if (this.direction === "up" && newDirection === "down") {
		return;
	} else if (this.direction === "right" && newDirection === "left") {
		return;
	} else if (this.direction === "down" && newDirection === "up") {
		return;
	} else if (this.direction === "left" && newDirection === "right") {
		return;		
	}
	
	this.nextDirection = newDirection;
};

// The Apple constructor
var Apple = function () {
	this.position = new Block(10, 10);
};

// Draw a circle at the apple's location
Apple.prototype.draw = function () {
	this.position.drawCircle("LimeGreen");
};

// Move the apple to a new random location
Apple.prototype.move = function () {
	var randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
	var randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
	this.position = new Block(randomCol, randomRow);
};

// Create the snake and apple objects
var snake = new Snake();
var apple = new Apple();

// Pass an animation function to setInterval
var intervalId = setInterval(function () {
	ctx.clearRect(0, 0, width, height);
	drawScore();
	snake.move();
	snake.draw();
	apple.draw();
	drawBorder();
}, 100);

// Convert keycodes to directions
var directions = {
	37: "left",
	38: "up",
	39: "right",
	40: "down"
};

// The keydown handler for handling direction key presses
$("body").keydown(function (event) {
	var newDirection = directions[event.keyCode];
	if (newDirection !== undefined) {
		snake.setDirection(newDirection);
	}
});

$("canvas").click(function (event) {
	var snakeX = snake.segments[0].col * blockSize;
	var snakeY = snake.segments[0].row * blockSize;
	var differenceX = snakeX - event.clientX;
	var differenceY = snakeY - event.clientY;
	if (Math.abs(differenceX) > Math.abs(differenceY)) {
		if (differenceX < 0) {
			snake.setDirection("right");
		} else {
			snake.setDirection("left");
		}
	} else {
		if (differenceY > 0) {
			snake.setDirection("up");
		} else {
			snake.setDirection("down");
		}
	}		
});
		
	
	