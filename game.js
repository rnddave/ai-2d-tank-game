const canvas = document.getElementById('game-canvas');
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
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

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

// ... (Other game logic functions)

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
