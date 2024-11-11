// Initialize Scene, Camera, and Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Handle window resizing
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Table setup
const tableGeometry = new THREE.PlaneGeometry(20, 10);
const tableMaterial = new THREE.MeshBasicMaterial({ color: 0x2E8B57 });
const table = new THREE.Mesh(tableGeometry, tableMaterial);
table.rotation.x = -Math.PI / 2;
table.position.y = -0.1;
scene.add(table);

// Add a simple net
const netGeometry = new THREE.PlaneGeometry(0.1, 10);
const netMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
const net = new THREE.Mesh(netGeometry, netMaterial);
net.position.y = 0.05;
scene.add(net);

// Ball setup
const ballGeometry = new THREE.SphereGeometry(0.3, 32, 32);
const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
ball.position.set(0, 0.3, 0);
scene.add(ball);

// Player Paddle setup
const paddleGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32);
const paddleMaterial = new THREE.MeshBasicMaterial({ color: 0xFF6347 }); // Reddish color
const playerPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
playerPaddle.rotation.x = Math.PI / 2;
playerPaddle.position.set(0, 0.2, 4.5);
scene.add(playerPaddle);

// AI Paddle setup
const aiPaddleMaterial = new THREE.MeshBasicMaterial({ color: 0x4682B4 }); // Blue color for AI paddle
const aiPaddle = new THREE.Mesh(paddleGeometry, aiPaddleMaterial);
aiPaddle.rotation.x = Math.PI / 2;
aiPaddle.position.set(0, 0.2, -4.5);
scene.add(aiPaddle);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

// Camera Position
camera.position.z = 12;
camera.position.y = 8;
camera.lookAt(0, 0, 0);

// Game variables
let ballSpeed = { x: 0.05, y: 0, z: 0.1 };
let playerScore = 0;
let aiScore = 0;

// Scoreboard elements
const playerScoreElement = document.getElementById("playerScore");
const aiScoreElement = document.getElementById("aiScore");

// Mouse control for player paddle
document.addEventListener("mousemove", (event) => {
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    playerPaddle.position.x = mouseX * 9;
});

// Main game loop
function animate() {
    requestAnimationFrame(animate);

    // Move the ball
    ball.position.x += ballSpeed.x;
    ball.position.z += ballSpeed.z;

    // Ball collision with table edges
    if (ball.position.x > 9.5 || ball.position.x < -9.5) {
        ballSpeed.x = -ballSpeed.x;
    }

    // Basic AI movement
    if (aiPaddle.position.x < ball.position.x) {
        aiPaddle.position.x += 0.05;
    } else if (aiPaddle.position.x > ball.position.x) {
        aiPaddle.position.x -= 0.05;
    }

    // Ball collision with paddles
    if (ball.position.z >= playerPaddle.position.z - 0.5 &&
        ball.position.x >= playerPaddle.position.x - 0.5 &&
        ball.position.x <= playerPaddle.position.x + 0.5) {
        ballSpeed.z = -ballSpeed.z;
    }
    if (ball.position.z <= aiPaddle.position.z + 0.5 &&
        ball.position.x >= aiPaddle.position.x - 0.5 &&
        ball.position.x <= aiPaddle.position.x + 0.5) {
        ballSpeed.z = -ballSpeed.z;
    }

    // Scoring
    if (ball.position.z > 5) {
        aiScore++;
        aiScoreElement.textContent = `${aiScore}`;
        resetBall();
    } else if (ball.position.z < -5) {
        playerScore++;
        playerScoreElement.textContent = `${playerScore}`;
        resetBall();
    }

    renderer.render(scene, camera);
}

// Reset ball position after a score
function resetBall() {
    ball.position.set(0, 0.3, 0);
    ballSpeed.z = -ballSpeed.z;
}

// Start the game loop
animate();
