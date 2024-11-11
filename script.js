const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const menu = document.getElementById("menu");

// Paddle settings
const paddleWidth = 10, paddleHeight = 100;
const playerSpeed = 5, aiSpeed = 3;
let playerY = canvas.height / 2 - paddleHeight / 2;
let aiY = canvas.height / 2 - paddleHeight / 2;

// Ball settings
let ballX = canvas.width / 2, ballY = canvas.height / 2;
let ballSpeedX = 3, ballSpeedY = 3;
const ballRadius = 10;

let playerScore = 0, aiScore = 0;
let gameRunning = false;

function startGame() {
    menu.style.display = "none";
    canvas.style.display = "block";
    gameRunning = true;
    gameLoop();
}

function endGame() {
    alert("Game Over!");
    window.location.reload();
}

function drawPaddle(x, y) {
    ctx.fillStyle = "#fff";
    ctx.fillRect(x, y, paddleWidth, paddleHeight);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.closePath();
}

function drawNet() {
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
}

function drawScore() {
    ctx.font = "20px Arial";
    ctx.fillText("Player: " + playerScore, 50, 30);
    ctx.fillText("AI: " + aiScore, canvas.width - 100, 30);
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
}

function update() {
    if (!gameRunning) return;

    // Ball movement
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with top and bottom walls
    if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) {
        ballSpeedY = -ballSpeedY;
    }

    // Ball collision with player paddle
    if (ballX - ballRadius < paddleWidth && ballY > playerY && ballY < playerY + paddleHeight) {
        ballSpeedX = -ballSpeedX;
    }

    // Ball collision with AI paddle
    if (ballX + ballRadius > canvas.width - paddleWidth && ballY > aiY && ballY < aiY + paddleHeight) {
        ballSpeedX = -ballSpeedX;
    }

    // AI movement
    if (aiY + paddleHeight / 2 < ballY) {
        aiY += aiSpeed;
    } else {
        aiY -= aiSpeed;
    }

    // Scoring
    if (ballX - ballRadius < 0) {
        aiScore++;
        resetBall();
    } else if (ballX + ballRadius > canvas.width) {
        playerScore++;
        resetBall();
    }

    // End game if a player reaches 10 points
    if (playerScore === 10 || aiScore === 10) {
        gameRunning = false;
        alert(playerScore === 10 ? "Player wins!" : "AI wins!");
        endGame();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawNet();
    drawScore();
    drawPaddle(0, playerY);
    drawPaddle(canvas.width - paddleWidth, aiY);
    drawBall();
}

function gameLoop() {
    update();
    draw();
    if (gameRunning) {
        requestAnimationFrame(gameLoop);
    }
}

// Player controls
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && playerY > 0) {
        playerY -= playerSpeed;
    }
    if (e.key === "ArrowDown" && playerY < canvas.height - paddleHeight) {
        playerY += playerSpeed;
    }
});
