console.log("Starting game setup...");

// Initialize Scene, Camera, and Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set a gradient background
const gradientBackground = new THREE.Color(0x87CEEB); // Light sky blue
scene.background = gradientBackground;

// Handle window resizing
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Table setup
const tableGeometry = new THREE.PlaneGeometry(20, 10);
const tableMaterial = new THREE.MeshBasicMaterial({ color: 0x2E8B57, side: THREE.DoubleSide }); // Dark green
const table = new THREE.Mesh(tableGeometry, tableMaterial);
table.rotation.x = -Math.PI / 2;
scene.add(table);

// Add table border lines
const borderLineMaterial = new THREE.LineBasicMaterial({ color: 0xFFFFFF });
const centerLine = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0.01, -5), new THREE.Vector3(0, 0.01, 5)]),
    borderLineMaterial
);
scene.add(centerLine);

// Create the net
const netGeometry = new THREE.PlaneGeometry(0.1, 10);
const netMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide });
const net = new THREE.Mesh(netGeometry, netMaterial);
net.position.y = 0.25;
scene.add(net);

// Ball setup
const ballGeometry = new THREE.SphereGeometry(0.2, 32, 32); // Smaller ball
const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
ball.position.set(0, 0.3, 0);
scene.add(ball);
console.log("Ball created and added to the scene.");

// Paddles setup
const paddleGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 32);
const paddleMaterial = new THREE.MeshBasicMaterial({ color: 0xFF4500 }); // Reddish color for player paddle

const playerPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
playerPaddle.rotation.x = Math.PI / 2;
playerPaddle.position.set(0, 0.2, 4.5);
scene.add(playerPaddle);

const aiPaddleMaterial = new THREE.MeshBasicMaterial({ color: 0x1E90FF }); // Blue color for AI paddle
const aiPaddle = new THREE.Mesh(paddleGeometry, aiPaddleMaterial);
aiPaddle.rotation.x = Math.PI / 2;
aiPaddle.position.set(0, 0.2, -4.5);
scene.add(aiPaddle);
console.log("Paddles created and added to the scene.");

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);
console.log("Lighting added.");

// Camera Position
camera.position.z = 15;
camera.position.y = 10;
camera.lookAt(0, 0, 0);
console.log("Camera positioned and oriented.");

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
    playerPaddle.position.x = mouseX * 9; // Scale to fit table width
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
        aiScoreElement.textContent = `AI: ${aiScore}`;
        console.log("AI scored. Score - Player:", playerScore, "AI:", aiScore);
        resetBall();
    } else if (ball.position.z < -5) {
        playerScore++;
        playerScoreElement.textContent = `Player: ${playerScore}`;
        console.log("Player scored. Score - Player:", playerScore, "AI:", aiScore);
        resetBall();
    }

    renderer.render(scene, camera);
}

// Reset ball position after a score
function resetBall() {
    ball.position.set(0, 0.3, 0);
    ballSpeed.z = -ballSpeed.z;
    console.log("Ball reset to center.");
}

// Start the game loop
animate();
console.log("Game animation started.");

