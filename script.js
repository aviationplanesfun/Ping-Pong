// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create the table (Tischtennisplatte)
const tableGeometry = new THREE.BoxGeometry(10, 0.2, 6);  // Table size (length, height, width)
const tableMaterial = new THREE.MeshPhongMaterial({ color: 0x00AA00, flatShading: true });
const table = new THREE.Mesh(tableGeometry, tableMaterial);
table.position.set(0, 0, 0);
scene.add(table);

// Create net
const netGeometry = new THREE.BoxGeometry(0.2, 1, 6);
const netMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
const net = new THREE.Mesh(netGeometry, netMaterial);
net.position.set(0, 0.5, 0);
scene.add(net);

// Create paddles
const paddleGeometry = new THREE.BoxGeometry(1.2, 0.2, 0.05);
const paddleMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
const leftPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
const rightPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
leftPaddle.position.set(-4, 0.1, 0);
rightPaddle.position.set(4, 0.1, 0);
scene.add(leftPaddle, rightPaddle);

// Create ball
const ballGeometry = new THREE.SphereGeometry(0.1, 32, 32);
const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
ball.position.set(0, 0.1, 0);
scene.add(ball);

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040);
const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
directionalLight.position.set(5, 5, 5).normalize();
scene.add(ambientLight, directionalLight);

// Ball physics variables
let ballSpeedX = 0.1;
let ballSpeedY = 0.1;
let ballSpeedZ = 0.1;
let ballTrajectory = [];  // Save ball trajectory for replay
let leftPaddleSpeed = 0;
let rightPaddleSpeed = 0;
let isInReplayMode = false; // Flag for replay mode

// Camera position
camera.position.z = 15;

// AI Logic: Simple AI to control the right paddle
function aiMove() {
    if (ball.position.y > rightPaddle.position.y) {
        rightPaddleSpeed = 0.1;
    } else if (ball.position.y < rightPaddle.position.y) {
        rightPaddleSpeed = -0.1;
    } else {
        rightPaddleSpeed = 0;
    }
}

// Mouse control for left paddle
document.addEventListener('mousemove', (event) => {
    const mouseY = (event.clientY / window.innerHeight) * 2 - 1;
    leftPaddle.position.y = mouseY * 2.5; // Paddle moves between -2.5 and 2.5
});

// Game loop
function animate() {
    requestAnimationFrame(animate);

    // AI movement for right paddle
    if (!isInReplayMode) aiMove();

    // Update paddles' positions
    leftPaddle.position.y += leftPaddleSpeed;
    rightPaddle.position.y += rightPaddleSpeed;

    // Boundary checks for paddles
    if (leftPaddle.position.y < -2.5) leftPaddle.position.y = -2.5;
    if (leftPaddle.position.y > 2.5) leftPaddle.position.y = 2.5;
    if (rightPaddle.position.y < -2.5) rightPaddle.position.y = -2.5;
    if (rightPaddle.position.y > 2.5) rightPaddle.position.y = 2.5;

    // Move the ball
    ball.position.x += ballSpeedX;
    ball.position.y += ballSpeedY;
    ball.position.z += ballSpeedZ;

    // Ball collision with top and bottom walls
    if (ball.position.y > 2.9 || ball.position.y < -2.9) {
        ballSpeedY = -ballSpeedY;
    }

    // Ball collision with paddles
    if (
        ball.position.x > 3.9 && ball.position.x < 4.1 &&
        ball.position.y > rightPaddle.position.y - 0.1 && ball.position.y < rightPaddle.position.y + 0.1
    ) {
        ballSpeedX = -ballSpeedX;
        saveBallTrajectory(); // Save the ball trajectory when it hits the paddle
    }
    if (
        ball.position.x < -3.9 && ball.position.x > -4.1 &&
        ball.position.y > leftPaddle.position.y - 0.1 && ball.position.y < leftPaddle.position.y + 0.1
    ) {
        ballSpeedX = -ballSpeedX;
        saveBallTrajectory(); // Save the ball trajectory when it hits the paddle
    }

    // Ball out of bounds
    if (ball.position.x > 5 || ball.position.x < -5) {
        ball.position.set(0, 0.1, 0);
        ballSpeedX = -ballSpeedX;
        // Optionally trigger replay if you want to save and show the last few plays
        if (!isInReplayMode) {
            triggerReplay();
        }
    }

    // Render the scene
    renderer.render(scene, camera);
}

// Save the ball trajectory for replay
function saveBallTrajectory() {
    if (!isInReplayMode) {
        ballTrajectory.push({ x: ball.position.x, y: ball.position.y, z: ball.position.z });
    }
}

// Trigger replay after a good play
function triggerReplay() {
    isInReplayMode = true;
    // Rewind the ball trajectory for replay (simple version)
    setTimeout(() => {
        ballTrajectory.forEach((position, index) => {
            setTimeout(() => {
                ball.position.set(position.x, position.y, position.z);
            }, index * 30); // Replay with a delay to simulate motion
        });
    }, 500);  // Wait half a second before starting replay
    setTimeout(() => {
        isInReplayMode = false; // Exit replay mode after it finishes
    }, ballTrajectory.length * 30 + 1000); // Wait for the replay to finish
}

// Start the animation loop
animate();
