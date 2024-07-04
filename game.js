const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const basket = {
    width: 100,
    height: 20,
    x: canvas.width / 2 - 50,
    y: canvas.height - 30,
    dx: 8, 
    originalWidth: 100, 
    powerupWidth: 150, 
    speedIncrement: 0.2 
};

const egg = {
    width: 20,
    height: 20,
    x: Math.random() * (canvas.width - 20),
    y: 0,
    dy: 5, 
    speedIncrement: 0.2 
};

const powerup = {
    types: ['speed', 'size'], 
    width: 20,
    height: 20,
    x: 0,
    y: 0,
    dx: 2, 
    active: false, 
    type: '', 
    duration: 5000, 
    timer: null 
};

const clouds = []; 
const numClouds = 5; 
const cloudSpeed = 0.5; 

const grassHeight = 20; 

let score = 0;
let isGameOver = false;
let animationFrameId; 


for (let i = 0; i < numClouds; i++) {
    clouds.push({
        x: Math.random() * canvas.width,
        y: Math.random() * (canvas.height / 2),
        radius: 30 + Math.random() * 20
    });
}

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

function drawPowerup() {
    if (powerup.active) {
        if (powerup.type === 'speed') {
            ctx.fillStyle = '#FF0000'; 
        } else if (powerup.type === 'size') {
            ctx.fillStyle = '#0000FF'; 
        }
        ctx.fillRect(powerup.x, powerup.y, powerup.width, powerup.height);
    }
}

function drawClouds() {
    ctx.fillStyle = '#FFFFFF'; 
    clouds.forEach(cloud => {
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    });
}

function drawGrass() {
    ctx.fillStyle = '#7CFC00'; 
    ctx.fillRect(0, canvas.height - grassHeight, canvas.width, grassHeight);
}

function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillStyle = '#000';
    ctx.fillText(`Score: ${score}`, 10, 20);
}

function drawRestartButton() {
    ctx.fillStyle = '#000';
    ctx.fillRect(canvas.width / 2 - 50, canvas.height / 2 + 50, 100, 40);
    ctx.font = '20px Arial';
    ctx.fillStyle = '#FFF';
    ctx.fillText('Restart', canvas.width / 2 - 35, canvas.height / 2 + 75);
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

function movePowerup() {
    if (!powerup.active) {
        
        if (Math.random() < 0.01) { 
            powerup.x = Math.random() * (canvas.width - powerup.width);
            powerup.y = Math.random() * (canvas.height / 2); 
            powerup.type = powerup.types[Math.floor(Math.random() * powerup.types.length)];
            powerup.active = true;

            
            powerup.timer = setTimeout(deactivatePowerup, powerup.duration);
        }
    } else {
        
        powerup.y += powerup.dx;

        
        if (powerup.x > basket.x && powerup.x < basket.x + basket.width &&
            powerup.y > basket.y && powerup.y < basket.y + basket.height) {
            activatePowerup();
        }

        
        if (powerup.y > canvas.height) {
            deactivatePowerup();
        }
    }
}

function activatePowerup() {
    if (powerup.type === 'speed') {
        basket.dx *= 1.5; 
        setTimeout(() => {
            basket.dx /= 1.5; 
        }, powerup.duration);
    } else if (powerup.type === 'size') {
        basket.width = basket.powerupWidth; 
        setTimeout(() => {
            basket.width = basket.originalWidth; 
        }, powerup.duration);
    }

    deactivatePowerup();
}

function deactivatePowerup() {
    powerup.active = false;
    clearTimeout(powerup.timer);
}

function resetEgg() {
    egg.x = Math.random() * (canvas.width - egg.width);
    egg.y = 0;
    egg.dy += egg.speedIncrement; 
}

function restartGame() {
    score = 0;
    isGameOver = false;
    basket.x = canvas.width / 2 - 50;
    basket.dx = 8;
    basket.width = basket.originalWidth;
    egg.dy = 5;
    clouds.forEach(cloud => {
        cloud.x = Math.random() * canvas.width;
        cloud.y = Math.random() * (canvas.height / 2);
    });

    
    canvas.removeEventListener('click', restartListener);
    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    
    ctx.fillStyle = '#87CEEB'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    
    drawClouds();

    
    drawGrass();

    
    drawBasket();
    drawEgg();
    drawPowerup();
    drawScore();

    if (isGameOver) {
        ctx.font = '40px Arial';
        ctx.fillStyle = '#000';
        ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);

        
        drawRestartButton();

        canvas.addEventListener('click', restartListener);
        return;
    }

    moveBasket();
    moveEgg();
    movePowerup();

    animationFrameId = requestAnimationFrame(draw);
}

function restartListener(event) {
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    if (clickX >= canvas.width / 2 - 50 && clickX <= canvas.width / 2 + 50 &&
        clickY >= canvas.height / 2 + 50 && clickY <= canvas.height / 2 + 90) {
        canvas.removeEventListener('click', restartListener); 
        cancelAnimationFrame(animationFrameId); 
        restartGame(); 
    }
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
