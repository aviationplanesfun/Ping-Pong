// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create the 3D table (Tischtennisplatte)
const tableGeometry = new THREE.BoxGeometry(10, 0.2, 6);  // Tischgröße (Länge, Höhe, Breite)
const tableMaterial = new THREE.MeshPhongMaterial({ color: 0x00AA00, flatShading: true });
const table = new THREE.Mesh(tableGeometry, tableMaterial);
table.position.set(0, 0, 0);  // Positioniere die Platte in der Szene
scene.add(table);

// Create edges for the table
const edgeMaterial = new THREE.MeshPhongMaterial({ color: 0x663300 });
const edgeGeometry = new THREE.BoxGeometry(10.2, 0.4, 0.2);  // Kanten der Platte
const edgeTop = new THREE.Mesh(edgeGeometry, edgeMaterial);
edgeTop.position.set(0, 0.1, -3.1);
scene.add(edgeTop);

const edgeBottom = new THREE.Mesh(edgeGeometry, edgeMaterial);
edgeBottom.position.set(0, 0.1, 3.1);
scene.add(edgeBottom);

const edgeLeft = new THREE.Mesh(edgeGeometry, edgeMaterial);
edgeLeft.rotation.z = Math.PI / 2;
edgeLeft.position.set(-5.1, 0.1, 0);
scene.add(edgeLeft);

const edgeRight = new THREE.Mesh(edgeGeometry, edgeMaterial);
edgeRight.rotation.z = Math.PI / 2;
edgeRight.position.set(5.1, 0.1, 0);
scene.add(edgeRight);

// Create the net (Tischtennisnetz)
const netGeometry = new THREE.BoxGeometry(0.2, 1, 6);  // Netzgröße
const netMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
const net = new THREE.Mesh(netGeometry, netMaterial);
net.position.set(0, 0.5, 0);  // Netz in der Mitte der Platte
scene.add(net);

// Create paddles
const paddleGeometry = new THREE.BoxGeometry(1, 0.1, 0.2);  // Paddle-Größe
const paddleMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
const leftPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
const rightPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
leftPaddle.position.set(-4, 0.1, 0);
rightPaddle.position.set(4, 0.1, 0);
scene.add(leftPaddle, rightPaddle);

// Create the ball
const ballGeometry = new THREE.SphereGeometry(0.1, 32, 32);  // Ballgröße
const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
ball.position.set(0, 0.1, 0);
scene.add(ball);

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040);  // Umgebungslicht
const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);  // Hauptlichtquelle
directionalLight.position.set(5, 5, 5).normalize();
scene.add(ambientLight, directionalLight);

// Ball physics variables
let ballSpeedX = 0.1;
let ballSpeedY = 0.1;
let ballSpeedZ = 0.1;
let leftPaddleSpeed = 0;
let rightPaddleSpeed = 0;

// Set the camera position
camera.position.z = 15;

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
    if (
        ball.position.x > 3.9 && ball.position.x < 4.1 &&
        ball.position.y > rightPaddle.position.y - 0.05 && ball.position.y < rightPaddle.position.y + 0.05
    ) {
        ballSpeedX = -ballSpeedX;
    }
    if (
        ball.position.x < -3.9 && ball.position.x > -4.1 &&
        ball.position.y > leftPaddle.position.y - 0.05 && ball.position.y < leftPaddle.position.y + 0.05
    ) {
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

