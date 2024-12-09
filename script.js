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
let snakeDirection = { x: 2, y: 2 };
let snakeSpeed = 2;
let target = {};
let isWizard = false;
let score = 0;
let gameRunning = false;
const nonWizardEmojis = ["🍎", "🍇", "🍓", "🍔", "🍟", "🍩", "🍕", "🍿", "🍰", "🥝"];
const wizardEmoji = "🧙‍♂️";

function resetGame() {
  snake = [{ x: 200, y: 200 }];
  snakeDirection = { x: 2, y: 2 };
  snakeSpeed = 2;
  score = 0;
  spawnTarget();
  gameRunning = true;
}

function spawnTarget() {
  const isTargetWizard = Math.random() < 0.2;
  target = {
    x: Math.random() * (canvas.width - 20) + 10,
    y: Math.random() * (canvas.height - 20) + 10,
    emoji: isTargetWizard ? wizardEmoji : randomNonWizardEmoji(),
    isWizard: isTargetWizard,
  };
}

function randomNonWizardEmoji() {
  return nonWizardEmojis[Math.floor(Math.random() * nonWizardEmojis.length)];
}

function drawSnake() {
  snake.forEach(segment => {
    ctx.fillStyle = "lime";
    ctx.fillRect(segment.x, segment.y, 10, 10);
  });
}

function drawTarget() {
  ctx.font = "20px Arial";
  ctx.fillText(target.emoji, target.x, target.y);
}

function updateSnake() {
  const head = { x: snake[0].x + snakeDirection.x, y: snake[0].y + snakeDirection.y };

  // Wall collision
  if (head.x < 0 || head.x > canvas.width - 10 || head.y < 0 || head.y > canvas.height - 10) {
    gameOver("The snake hit the wall!");
    return;
  }

  // Snake collision with itself
  for (let segment of snake) {
    if (head.x === segment.x && head.y === segment.y) {
      gameOver("The snake ate itself!");
      return;
    }
  }

  snake.unshift(head);
  if (Math.abs(head.x - target.x) < 15 && Math.abs(head.y - target.y) < 15) {
    if (target.isWizard) {
      gameOver("The snake ate a wizard!");
    } else {
      score++;
      if (score % 10 === 0) {
        snakeSpeed++;
      }
      spawnTarget();
    }
  } else {
    snake.pop();
  }
}

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSnake();
  drawTarget();
}

function gameOver(message) {
  gameRunning = false;
  endMessage.textContent = message;
  gameScreen.style.display = "none";
  endScreen.style.display = "flex";
}

function gameLoop() {
  if (gameRunning) {
    updateSnake();
    drawGame();
    setTimeout(gameLoop, 1000 / (snakeSpeed * 10));
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

// Initial Delay for Title Screen
setTimeout(() => {
  titleScreen.style.display = "none";
  gameScreen.style.display = "block";
}, 5000);
