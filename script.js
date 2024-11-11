// Basic Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Table
const tableGeometry = new THREE.PlaneGeometry(20, 10);
const tableMaterial = new THREE.MeshBasicMaterial({ color: 0x4CAF50, side: THREE.DoubleSide });
const table = new THREE.Mesh(tableGeometry, tableMaterial);
table.rotation.x = - Math.PI / 2;
scene.add(table);

// Ball
const ballGeometry = new THREE.SphereGeometry(0.3, 32, 32);
const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
ball.position.set(0, 0.5, 0);
scene.add(ball);

// Paddles
const paddleGeometry = new THREE.BoxGeometry(1, 0.2, 1);
const paddleMaterial = new THREE.MeshBasicMaterial({ color: 0xFF5733 });
const playerPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
playerPaddle.position.set(0, 0.2, 4.5);
scene.add(playerPaddle);

const aiPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
aiPaddle.position.set(0, 0.2, -4.5);
scene.add(aiPaddle);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

// Camera Position
camera.position.z = 15;
camera.position.y = 10;
camera.lookAt(0, 0, 0);

// Game variables
let ballSpeed = { x: 0.05, y: 0.05, z: 0.1 };
let playerScore = 0;
let aiScore = 0;

// Mouse control for player paddle
document.addEventListener("mousemove", (event) => {
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    playerPaddle.position.x = mouseX * 10; // Scale to table width
});

// Game Loop
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
        resetBall();
    } else if (ball.position.z < -5) {
        playerScore++;
        resetBall();
    }

    renderer.render(scene, camera);
}

// Reset ball position after a score
function resetBall() {
    ball.position.set(0, 0.5, 0);
    ballSpeed.z = -ballSpeed.z;
}

// Start the game loop
animate();

