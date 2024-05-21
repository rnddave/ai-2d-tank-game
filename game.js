const canvas = document.getElementById('game-canvas');
canvas.width = 800;
canvas.height = 600;
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const highScoreList = document.getElementById('high-score-list');

// Game constants
const TANK_SIZE = 30;
const BULLET_SIZE = 5;
const TANK_SPEED = 3;
const BULLET_SPEED = 6;

// Game state
let score = 0;
let lives = 3;
let highScores = JSON.parse(localStorage.getItem('highScores')) || [];

// Player tank
let playerTank = {
    x: canvas.width / 2,
    y: canvas.height - TANK_SIZE,
    angle: 0,
    bullets: []
};

// Enemy tanks
let enemies = [];

// Input handling
let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

function handleKeyDown(event) {
    switch (event.keyCode) {
        case 37: // Left arrow
            moveLeft = true;
            break;
        case 39: // Right arrow
            moveRight = true;
            break;
        case 38: // Up arrow
            moveUp = true;
            break;
        case 40: // Down arrow
            moveDown = true;
            break;
    }
}

function handleKeyUp(event) {
    switch (event.keyCode) {
        case 37: // Left arrow
            moveLeft = false;
            break;
        case 39: // Right arrow
            moveRight = false;
            break;
        case 38: // Up arrow
            moveUp = false;
            break;
        case 40: // Down arrow
            moveDown = false;
            break;
    }
}

// Game loop
function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move player tank
    movePlayerTank();

    // Move bullets
    moveBullets();

    // Move enemies
    moveEnemies();

    // Check collisions
    checkCollisions();

    // Draw game objects
    drawPlayerTank();
    drawBullets();
    drawEnemies();

    // Update score and lives display
    scoreDisplay.textContent = score;
    livesDisplay.textContent = lives;

    // Request next frame
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();

// Move player tank
function movePlayerTank() {
    if (moveLeft && playerTank.x > 0) {
        playerTank.x -= TANK_SPEED;
    }
    if (moveRight && playerTank.x < canvas.width - TANK_SIZE) {
        playerTank.x += TANK_SPEED;
    }
    if (moveUp && playerTank.y > 0) {
        playerTank.y -= TANK_SPEED;
    }
    if (moveDown && playerTank.y < canvas.height - TANK_SIZE) {
        playerTank.y += TANK_SPEED;
    }
}

// Move bullets
function moveBullets() {
    for (let i = 0; i < playerTank.bullets.length; i++) {
        const bullet = playerTank.bullets[i];
        bullet.x += Math.cos(bullet.angle) * BULLET_SPEED;
        bullet.y -= Math.sin(bullet.angle) * BULLET_SPEED;

        // Remove bullets that go off-screen
        if (
            bullet.x < 0 ||
            bullet.x > canvas.width ||
            bullet.y < 0 ||
            bullet.y > canvas.height
        ) {
            playerTank.bullets.splice(i, 1);
            i--;
        }
    }
}

// Move enemies
function moveEnemies() {
    // Placeholder for enemy movement logic
}

// Check collisions
function checkCollisions() {
    // Placeholder for collision detection logic
}

// Draw player tank
function drawPlayerTank() {
    ctx.save();
    ctx.translate(playerTank.x + TANK_SIZE / 2, playerTank.y + TANK_SIZE / 2);
    ctx.rotate(playerTank.angle);
    ctx.fillRect(-TANK_SIZE / 2, -TANK_SIZE / 2, TANK_SIZE, TANK_SIZE);
    ctx.restore();
}

// Draw bullets
function drawBullets() {
    ctx.fillStyle = 'red';
    for (const bullet of playerTank.bullets) {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, BULLET_SIZE, 0, 2 * Math.PI);
        ctx.fill();
    }
}

// Draw enemies
function drawEnemies() {
    // Placeholder for drawing enemies
}

// Display high scores
function displayHighScores() {
    highScoreList.innerHTML = '';
    highScores.forEach((score, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${score}`;
        highScoreList.appendChild(listItem);
    });
}

// Update high scores
function updateHighScores() {
    highScores.push(score);
    highScores.sort((a, b) => b - a);
    highScores = highScores.slice(0, 5); // Keep top 5 scores
    localStorage.setItem('highScores', JSON.stringify(highScores));
    displayHighScores();
}

// Game over logic
function gameOver() {
    // Display game over message
    alert(`Game Over! Your score: ${score}`);

    // Update high scores
    updateHighScores();

    // Reset game state
    score = 0;
    lives = 3;
    playerTank.bullets = [];
    enemies = [];

    // Display updated high scores
    displayHighScores();
}
