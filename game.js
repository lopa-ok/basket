const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const basket = {
    width: 100,
    height: 20,
    x: canvas.width / 2 - 50,
    y: canvas.height - 30,
    dx: 5
};

const egg = {
    width: 20,
    height: 20,
    x: Math.random() * (canvas.width - 20),
    y: 0,
    dy: 5, 
    speedIncrement: 0.2 
};

let score = 0;
let isGameOver = false;

function drawBasket() {
    ctx.fillStyle = '#8B4513'; 
    ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
}

function drawEgg() {
    ctx.beginPath();
    ctx.arc(egg.x, egg.y, egg.width / 2, 0, Math.PI * 2);
    ctx.fillStyle = '#FFD700'; 
    ctx.fill();
    ctx.closePath();
}

function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillStyle = '#000';
    ctx.fillText(`Score: ${score}`, 10, 20);
}

function moveBasket() {
    if (rightPressed && basket.x < canvas.width - basket.width) {
        basket.x += basket.dx;
    } else if (leftPressed && basket.x > 0) {
        basket.x -= basket.dx;
    }
}

function moveEgg() {
    egg.y += egg.dy;

    if (egg.y + egg.height > canvas.height) {
        if (egg.x > basket.x && egg.x < basket.x + basket.width) {
            score++;
            resetEgg();
        } else {
            isGameOver = true;
        }
    }
}

function resetEgg() {
    egg.x = Math.random() * (canvas.width - egg.width);
    egg.y = 0;
    egg.dy += egg.speedIncrement; 
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBasket();
    drawEgg();
    drawScore();

    if (isGameOver) {
        ctx.font = '40px Arial';
        ctx.fillStyle = '#000';
        ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
        return;
    }

    moveBasket();
    moveEgg();

    requestAnimationFrame(draw);
}

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

let rightPressed = false;
let leftPressed = false;

function keyDownHandler(e) {
    if (e.key == 'Right' || e.key == 'ArrowRight') {
        rightPressed = true;
    } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == 'Right' || e.key == 'ArrowRight') {
        rightPressed = false;
    } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
        leftPressed = false;
    }
}

draw();
