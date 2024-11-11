// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a plane for the table
const tableGeometry = new THREE.PlaneGeometry(10, 6);
const tableMaterial = new THREE.MeshBasicMaterial({ color: 0x008000, side: THREE.DoubleSide });
const table = new THREE.Mesh(tableGeometry, tableMaterial);
table.rotation.x = -Math.PI / 2;
scene.add(table);

// Create paddles
const paddleGeometry = new THREE.BoxGeometry(1, 0.2, 0.1);
const paddleMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
const leftPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
const rightPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
leftPaddle.position.set(-4, 0.1, 0);
rightPaddle.position.set(4, 0.1, 0);
scene.add(leftPaddle, rightPaddle);

// Create the ball
const ballGeometry = new THREE.SphereGeometry(0.1, 32, 32);
const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
ball.position.set(0, 0.1, 0);
scene.add(ball);

// Ball physics variables
let ballSpeedX = 0.1;
let ballSpeedY = 0.1;
let ballSpeedZ = 0.1;
let leftPaddleSpeed = 0;
let rightPaddleSpeed = 0;

// Set the camera position
camera.position.z = 10;

// Handle paddle movement with arrow keys
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') rightPaddleSpeed = 0.1;
    if (event.key === 'ArrowDown') rightPaddleSpeed = -0.1;
    if (event.key === 'w') leftPaddleSpeed = 0.1;
    if (event.key === 's') leftPaddleSpeed = -0.1;
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') rightPaddleSpeed = 0;
    if (event.key === 'w' || event.key === 's') leftPaddleSpeed = 0;
});

// Game loop
function animate() {
    requestAnimationFrame(animate);

    // Move the paddles
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
    if (ball.position.x > 3.9 && ball.position.x < 4.1 && ball.position.y > rightPaddle.position.y - 0.1 && ball.position.y < rightPaddle.position.y + 0.1) {
        ballSpeedX = -ballSpeedX;
    }
    if (ball.position.x < -3.9 && ball.position.x > -4.1 && ball.position.y > leftPaddle.position.y - 0.1 && ball.position.y < leftPaddle.position.y + 0.1) {
        ballSpeedX = -ballSpeedX;
    }

    // Ball out of bounds
    if (ball.position.x > 5 || ball.position.x < -5) {
        ball.position.set(0, 0.1, 0);
        ballSpeedX = -ballSpeedX;
    }

    // Render the scene
    renderer.render(scene, camera);
}

// Start the animation loop
animate();

