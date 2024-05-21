const canvas = document.getElementById('game-canvas');
canvas.width = 800;
canvas.height = 600;
const ctx = canvas.getContext('2d');
const playerScoreDisplay = document.getElementById('player-score');
const aiScoreDisplay = document.getElementById('ai-score');
const highScoreList = document.getElementById('high-score-list');

// Game constants
const TANK_SIZE = 30;
const BULLET_SIZE = 5;
const TANK_SPEED = 2; // Slowed down speed
const BULLET_SPEED = 6;
const SHOT_DELAY = 5000; // 5 seconds
const WIN_SCORE = 10;
const OBSTACLE_SIZE = 50;

// Game state
let playerScore = 0;
let aiScore = 0;
let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
let obstacles = [
    { x: 300, y: 200, width: OBSTACLE_SIZE, height: OBSTACLE_SIZE, health: 3 },
    { x: 500, y: 400, width: OBSTACLE_SIZE, height: OBSTACLE_SIZE, health: 3 }
];

// Player tank
let playerTank = {
    x: canvas.width / 4,
    y: canvas.height - TANK_SIZE,
    angle: 0,
    bullets: [],
    lastShot: 0
};

// AI tank
let aiTank = {
    x: canvas.width * 3 / 4,
    y: TANK_SIZE,
    angle: Math.PI,
    bullets: [],
    lastShot: 0
};

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
        case 32: // Spacebar
            shootBullet(playerTank);
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
    movePlayerTank(playerTank);

    // Move AI tank
    moveAITank(aiTank);

    // Move bullets
    moveBullets(playerTank);
    moveBullets(aiTank);

    // Check collisions
    checkCollisions();

    // Draw game objects
    drawTank(playerTank);
    drawTank(aiTank);
    drawBullets(playerTank.bullets);
    drawBullets(aiTank.bullets);
    drawObstacles();

    // Update score display
    playerScoreDisplay.textContent = playerScore;
    aiScoreDisplay.textContent = aiScore;

    // Check win condition
    if (playerScore >= WIN_SCORE || aiScore >= WIN_SCORE) {
        gameOver();
    } else {
        // Request next frame
        requestAnimationFrame(gameLoop);
    }
}

// Start the game loop
gameLoop();

// Move player tank
function movePlayerTank(tank) {
    if (moveLeft && tank.x > 0) {
        tank.x -= TANK_SPEED;
    }
    if (moveRight && tank.x < canvas.width - TANK_SIZE) {
        tank.x += TANK_SPEED;
    }
    if (moveUp && tank.y > 0) {
        tank.y -= TANK_SPEED;
    }
    if (moveDown && tank.y < canvas.height - TANK_SIZE) {
        tank.y += TANK_SPEED;
    }
}

// Move AI tank
function moveAITank(tank) {
    // Basic AI to move towards the player tank
    const dx = playerTank.x - tank.x;
    const dy = playerTank.y - tank.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
        tank.x += (dx / distance) * TANK_SPEED;
        tank.y += (dy / distance) * TANK_SPEED;
    }

    // Shoot at the player tank
    const now = Date.now();
    if (now - tank.lastShot > SHOT_DELAY) {
        shootBullet(tank);
        tank.lastShot = now;
    }
}

// Shoot bullet
function shootBullet(tank) {
    const now = Date.now();
    if (now - tank.lastShot > SHOT_DELAY) {
        const bullet = {
            x: tank.x + TANK_SIZE / 2,
            y: tank.y + TANK_SIZE / 2,
            angle: tank.angle
        };
        tank.bullets.push(bullet);
        tank.lastShot = now;
    }
}

// Move bullets
function moveBullets(tank) {
    for (let i = 0; i < tank.bullets.length; i++) {
        const bullet = tank.bullets[i];
        bullet.x += Math.cos(bullet.angle) * BULLET_SPEED;
        bullet.y -= Math.sin(bullet.angle) * BULLET_SPEED;

        // Remove bullets that go off-screen
        if (
            bullet.x < 0 ||
            bullet.x > canvas.width ||
            bullet.y < 0 ||
            bullet.y > canvas.height
        ) {
            tank.bullets.splice(i, 1);
            i--;
        }
    }
}

// Check collisions
function checkCollisions() {
    // Check player tank collisions with AI bullets
    for (const bullet of aiTank.bullets) {
        if (isColliding(bullet, playerTank)) {
            // AI bullet hits player tank, increment AI score
            aiScore++;
            // Remove the bullet from the AI tank's bullet array
            aiTank.bullets = aiTank.bullets.filter(b => b !== bullet);
        }
    }

    // Check AI tank collisions with player bullets
    for (const bullet of playerTank.bullets) {
        if (isColliding(bullet, aiTank)) {
            // Player bullet hits AI tank, increment player score
            playerScore++;
            // Remove the bullet from the player tank's bullet array
            playerTank.bullets = playerTank.bullets.filter(b => b !== bullet);
        }
    }

    // Check obstacle collisions
    checkObstacleCollisions(playerTank.bullets);
    checkObstacleCollisions(aiTank.bullets);
}

// Check collision between a bullet and a tank
function isColliding(bullet, tank) {
    const dx = bullet.x - (tank.x + TANK_SIZE / 2);
    const dy = bullet.y - (tank.y + TANK_SIZE / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < TANK_SIZE / 2;
}

function checkObstacleCollisions(bullets) {
    for (let i = 0; i < bullets.length; i++) {
        const bullet = bullets[i];
        for (let j = 0; j < obstacles.length; j++) {
            const obstacle = obstacles[j];
            if (
                bullet.x > obstacle.x &&
                bullet.x < obstacle.x + obstacle.width &&
                bullet.y > obstacle.y &&
                bullet.y < obstacle.y + obstacle.height
            ) {
                obstacle.health--;
                bullets.splice(i, 1);
                i--;
                if (obstacle.health <= 0) {
                    obstacles.splice(j, 1);
                    j--;
                }
                break;
            }
        }
    }
}

// Draw tank
function drawTank(tank) {
    ctx.save();
    ctx.translate(tank.x + TANK_SIZE / 2, tank.y + TANK_SIZE / 2);
    ctx.rotate(tank.angle);

    // Draw tank body
    ctx.fillStyle = 'green';
    ctx.fillRect(-TANK_SIZE / 2, -TANK_SIZE / 4, TANK_SIZE, TANK_SIZE / 2);

    // Draw tank turret
    ctx.fillStyle = 'grey';
    ctx.fillRect(-TANK_SIZE / 4, -TANK_SIZE / 4, TANK_SIZE / 2, TANK_SIZE / 4);

    // Draw tank barrel
    ctx.fillStyle = 'black';
    ctx.fillRect(TANK_SIZE / 4, -TANK_SIZE / 8, TANK_SIZE / 2, TANK_SIZE / 8);

    ctx.restore();
}

// Draw bullets
function drawBullets(bullets) {
    ctx.fillStyle = 'red';
    for (const bullet of bullets) {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, BULLET_SIZE, 0, 2 * Math.PI);
        ctx.fill();
    }
}

// Draw obstacles
function drawObstacles() {
    ctx.fillStyle = 'brown';
    for (const obstacle of obstacles) {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }
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
function updateHighScores(winner) {
    const score = winner === 'player' ? playerScore : aiScore;
    highScores.push(score);
    highScores.sort((a, b) => b - a);
    highScores = highScores.slice(0, 5); // Keep top 5 scores
    localStorage.setItem('highScores', JSON.stringify(highScores));
    displayHighScores();
}

// Game over
function gameOver() {
    let winner;
    if (playerScore >= WIN_SCORE) {
        winner = 'player';
    } else {
        winner = 'ai';
    }

    // Display game over message
    alert(`Game Over! The ${winner} wins!`);

    // Update high scores
    updateHighScores(winner);

    // Reset game state
    playerScore = 0;
    aiScore = 0;
    playerTank.bullets = [];
    aiTank.bullets = [];
    playerTank.lastShot = 0;
    aiTank.lastShot = 0;

    // Reset tank positions
    playerTank.x = canvas.width / 4;
    playerTank.y = canvas.height - TANK_SIZE;
    aiTank.x = canvas.width * 3 / 4;
    aiTank.y = TANK_SIZE;

    // Reset obstacles
    obstacles = [
        { x: 300, y: 200, width: OBSTACLE_SIZE, height: OBSTACLE_SIZE, health: 3 },
        { x: 500, y: 400, width: OBSTACLE_SIZE, height: OBSTACLE_SIZE, health: 3 }
    ];

    // Display updated high scores
    displayHighScores();
}
