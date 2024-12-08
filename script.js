const gameBoard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const titleScreen = document.getElementById('title-screen');
const gameContainer = document.getElementById('game-container');

let snake = [{ x: 200, y: 200 }];
let score = 0;
let muggle = generateRandomPosition();
let wizard = generateRandomPosition();
let direction = { x: 0, y: 0 };
let gameOver = false;
let gameStarted = false;

// Show title screen and wait for player to start
document.addEventListener('keydown', e => {
  if (!gameStarted && e.key === 'Enter') {
    titleScreen.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    gameStarted = true;
    startGame();
  }
});

// Spawn items on the board
function renderBoard() {
  gameBoard.innerHTML = '';

  // Draw the snake
  snake.forEach(segment => {
    const snakeElement = document.createElement('div');
    snakeElement.style.left = `${segment.x}px`;
    snakeElement.style.top = `${segment.y}px`;
    snakeElement.classList.add('snake');
    gameBoard.appendChild(snakeElement);
  });

  // Draw the muggle
  const muggleElement = document.createElement('div');
  muggleElement.style.left = `${muggle.x}px`;
  muggleElement.style.top = `${muggle.y}px`;
  muggleElement.classList.add('muggle');
  gameBoard.appendChild(muggleElement);

  // Draw the wizard
  const wizardElement = document.createElement('div');
  wizardElement.style.left = `${wizard.x}px`;
  wizardElement.style.top = `${wizard.y}px`;
  wizardElement.classList.add('wizard');
  gameBoard.appendChild(wizardElement);
}

// Move the snake
function moveSnake() {
  if (gameOver) return;

  const head = { x: snake[0].x + direction.x * 20, y: snake[0].y + direction.y * 20 };

  if (head.x < 0 || head.x >= 400 || head.y < 0 || head.y >= 400 || snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    alert('Game Over! You ate a wizard or hit a wall.');
    gameOver = true;
    return;
  }

  if (head.x === muggle.x && head.y === muggle.y) {
    score++;
    scoreDisplay.textContent = score;
    muggle = generateRandomPosition();
  } else {
    snake.pop();
  }

  if (head.x === wizard.x && head.y === wizard.y) {
    alert('Game Over! You ate a wizard.');
    gameOver = true;
    return;
  }

  snake.unshift(head);
}

// Generate random position
function generateRandomPosition() {
  return {
    x: Math.floor(Math.random() * 20) * 20,
    y: Math.floor(Math.random() * 20) * 20,
  };
}

// Handle keyboard input
document.addEventListener('keydown', e => {
  if (!gameStarted) return;

  switch (e.key) {
    case 'ArrowUp': if (direction.y === 0) direction = { x: 0, y: -1 }; break;
    case 'ArrowDown': if (direction.y === 0) direction = { x: 0, y: 1 }; break;
    case 'ArrowLeft': if (direction.x === 0) direction = { x: -1, y: 0 }; break;
    case 'ArrowRight': if (direction.x === 0) direction = { x: 1, y: 0 }; break;
  }
});

// Game loop
function gameLoop() {
  if (gameOver) return;
  moveSnake();
  renderBoard();
  setTimeout(gameLoop, 200 - Math.min(score * 5, 150)); // Speed up slightly with score
}

// Start the game
function startGame() {
  renderBoard();
  gameLoop();
}
