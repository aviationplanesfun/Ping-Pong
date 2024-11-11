const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const menu = document.getElementById("menu");

// Paddle settings
const paddleWidth = 10, paddleHeight = 100;
const playerSpeed = 6, aiSpeed = 3.5;
let playerY = canvas.height / 2 - paddleHeight / 2;
let aiY = canvas.height / 2 - paddleHeight / 2;
let playerVelocity = 0;

// Ball settings
let ballX = canvas.width / 2, ballY = canvas.height / 2;
let ballSpeedX = 4, ballSpeedY = 4;
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
    ctx.arc(ballX,
