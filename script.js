const titleScreen = document.getElementById("title-screen");
const gameScreen = document.getElementById("game-screen");
const endScreen = document.getElementById("end-screen");
const playButton = document.getElementById("play-button");
const restartButton = document.getElementById("restart-button");
const endMessage = document.getElementById("end-message");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 400;

let snake = [{ x: 200, y: 200 }];
let snakeSpeed = 2;
let snakeDirection = { x: 2, y: 2 };
let target = {};
let score = 0;
let gameRunning = false;

// Emojis
const nonWizardEmojis = ["🍎", "🍇", "🍓", "🍔", "🍟", "🍩", "🍕", "🍿", "🍰", "🥝"];
const wizardEmoji = "🧙‍♂️";

// Reset the game
function resetGame() {
  snake = [{ x: 200, y: 200 }];
  snakeSpeed = 2;
  snakeDirection = { x: 2, y: 2 };
  score = 0;
  spawnTarget();
  gameRunning = true;
}

// Spawn a new target
function spawnTarget() {
  const isWizard = Math.random() < 0.2; // 20% chance of wizard
  target = {
    x: Math.random() * (canvas.width - 30) + 15,
    y: Math.random() * (canvas.height - 30) + 15,
    emoji: isWizard ? wizardEmoji : randomNonWizardEmoji(),
    isWizard: isWizard,
  };
}

function randomNonWizardEmoji() {
  return nonWizardEmojis[Math.floor(Math.random() * nonWizardEmojis.length)];
}

// Draw the snake
function drawSnake() {
  snake.forEach(segment => {
    ctx.fillStyle = "lime";
    ctx.fillRect(segment.x, segment.y, 10, 10);
  });
}

// Draw the target
function drawTarget() {
  ctx.font = "20px Arial";
  ctx.fillText(target.emoji, target.x, target.y);
}

// Update the snake's position
function updateSnake() {
  const head = snake[0];

  // Bounce off walls
  if (head.x <= 0 || head.x >= canvas.width - 10) snakeDirection.x *= -1;
  if (head.y <= 0 || head.y >= canvas.height - 10) snakeDirection.y *= -1;

  // Move the snake
  head.x += snakeDirection.x;
  head.y += snakeDirection.y;

  // Check if the snake eats the target
  if (Math.abs(head.x - target.x) < 15 && Math.abs(head.y - target.y) < 15) {
    if (target.isWizard) {
      gameOver("The snake ate a wizard!");
    } else {
      score++;
      snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
      if (score % 10 === 0) snakeSpeed++;
      spawnTarget();
    }
  }
}

// Draw the game elements
function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSnake();
  drawTarget();
}

// Handle game over
function gameOver(message) {
  gameRunning = false;
  endMessage.textContent = message;
  gameScreen.style.display = "none";
  endScreen.style.display = "flex";
}

// Game loop
function gameLoop() {
  if (gameRunning) {
    updateSnake();
    drawGame();
    setTimeout(gameLoop, 1000 / 60);
  }
}

// Event Listeners
playButton.addEventListener("click", () => {
  titleScreen.style.display = "none";
  gameScreen.style.display = "block";
  resetGame();
  gameLoop();
});

restartButton.addEventListener("click", () => {
  endScreen.style.display = "none";
  titleScreen.style.display = "flex";
});

// Start the game
resetGame();
