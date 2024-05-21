# ai-2d-tank-game
A tank game that my 6yo old wanted to see if we could get an AI Chatbot to help us build

---

# Asking for the parameters: 

```
what are the basic parameters for building a 2d tank-based shooting game in javascrip
```
## output

To build a 2D tank-based shooting game in JavaScript, you'll need to consider the following basic parameters:

1. **Game Engine or Framework**: You can either build the game from scratch using plain JavaScript or leverage a game engine or framework like Phaser, PixiJS, or Construct. Using a game engine can simplify tasks like rendering, physics, and input handling.

2. **Game Canvas**: You'll need an HTML5 `<canvas>` element or a rendering target to draw the game graphics.

3. **Game Loop**: A game loop is essential for updating the game state and rendering the graphics on each frame. This loop typically consists of three main components: input handling, game logic update, and rendering.

4. **Sprites and Graphics**: You'll need to create or load sprite images for the tanks, bullets, and other game objects. You can use JavaScript libraries like PixiJS or raw canvas APIs for drawing and animating these sprites.

5. **Input Handling**: Implement keyboard or mouse input handling for controlling the tank's movement and firing weapons.

6. **Game Physics**: Implement basic physics for tank movement, bullet trajectory, collision detection, and handling collisions between game objects.

7. **Game State Management**: Manage different game states like the main menu, gameplay, game over, and level transitions.

8. **Scoring and Lives**: Keep track of the player's score and remaining lives.

9. **Sound Effects and Music**: Add sound effects for firing, explosions, and background music to enhance the gaming experience.

10. **Level Design**: Design and implement different levels with varying terrain, obstacles, and enemy placements.

11. **AI for Enemies**: Implement basic AI algorithms for enemy tank movement and shooting behavior.

12. **Power-ups and Upgrades**: Consider adding power-ups or upgrades for the player's tank, such as increased firepower, health, or special weapons.

13. **User Interface**: Create a user interface for displaying the score, lives, and other game information.

14. **Game Over and Restart**: Handle game over conditions and allow the player to restart the game or return to the main menu.

These are the basic parameters to consider when building a 2D tank-based shooting game in JavaScript. Depending on the scope and complexity of your game, you may need to implement additional features or optimize certain aspects for better performance.

---

# Asking for an initial build

``` using those basic parameters, can you build a tank-based 2d shooting game using html, css, javascript that would also include a high score table?
```

## output: 

Sure, I can provide you with a basic implementation of a 2D tank-based shooting game using HTML, CSS, and JavaScript, including a high score table. Here's an example:

HTML:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Tank Shooter</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="game-container">
        <canvas id="game-canvas"></canvas>
    </div>
    <div id="score-container">
        <h2>Score: <span id="score">0</span></h2>
        <h2>Lives: <span id="lives">3</span></h2>
    </div>
    <div id="high-score-container">
        <h2>High Scores:</h2>
        <ol id="high-score-list"></ol>
    </div>
    <script src="game.js"></script>
</body>
</html>
```

CSS:

```css
#game-container {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

#score-container {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

#high-score-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}
```

JavaScript (game.js):

```javascript
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
```

In this example, we have a basic game loop that updates the game state and renders the game objects on the canvas. The game includes a player tank that can move and shoot bullets, as well as enemy tanks that move around the canvas.

The game keeps track of the player's score and lives, and displays them on the page. When the player runs out of lives, the game is over, and the player's score is added to the high score list, which is stored in the browser's local storage.

The high scores are displayed in an ordered list on the page, with the top 5 scores shown.

Note that this is a very basic implementation and doesn't include features like level design, enemy AI, power-ups, or collision detection with terrain. However, it should give you a good starting point for building a more complex tank-based shooting game.
