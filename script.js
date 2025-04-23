const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const flapSound = document.getElementById('flapSound');  // Flap sound
const gameOverSound = document.getElementById('gameOverSound');  // Game Over sound
let score = 0;
let gameSpeed = 2;
let gameRunning = false;
let animationId;

const bird = {
  x: 80,
  y: 200,
  width: 40,
  height: 40,
  velocity: 0,
  gravity: 0.6,
  jumpStrength: -10,
  image: new Image(),
};

bird.image.src = 'https://i.ibb.co/wBhXTz8/bird.png';  // Bird sprite image

// Scroll background variables
let backgroundX = 0;  // Starting position for background
const backgroundImage = new Image();
backgroundImage.src = 'https://i.ibb.co/RHgJMBg/forest-bg.png';  // Forest background image

// Handle bird flap
function flap() {
  if (!gameRunning) return;
  bird.velocity = bird.jumpStrength;
  flapSound.currentTime = 0;  // Reset sound to start from the beginning
  flapSound.play();
}

document.addEventListener('keydown', flap);
document.addEventListener('touchstart', flap);

// Draw the bird
function drawBird() {
  ctx.drawImage(bird.image, bird.x, bird.y, bird.width, bird.height);
}

// Draw the obstacles
function drawObstacles() {
  for (let obs of obstacles) {
    ctx.fillStyle = '#556b2f';
    ctx.fillRect(obs.x, 0, obs.width, obs.top);
    ctx.fillRect(obs.x, canvas.height - obs.bottom, obs.width, obs.bottom);
  }
}

// Create obstacles
function updateObstacles() {
  if (frame % 100 === 0) {
    const height = Math.floor(Math.random() * 200) + 50;
    const gap = 150;
    obstacles.push({
      x: canvas.width,
      width: 50,
      top: height,
      bottom: canvas.height - height - gap
    });
  }

  for (let obs of obstacles) {
    obs.x -= gameSpeed;

    if (
      bird.x < obs.x + obs.width &&
      bird.x + bird.width > obs.x &&
      (bird.y < obs.top || bird.y + bird.height > canvas.height - obs.bottom)
    ) {
      endGame();
    }
  }

  if (obstacles.length > 0 && obstacles[0].x + obstacles[0].width < 0) {
    obstacles.shift();
    score++;
    document.getElementById('score').textContent = 'Score: ' + score;
    gameSpeed += 0.1;
  }
}

// Draw the scrolling background
function drawBackground() {
  const bgWidth = canvas.width;
  backgroundX -= gameSpeed;
  
  // When background reaches the left side, reset it
  if (backgroundX <= -bgWidth) {
    backgroundX = 0;
  }

  // Draw the background at the current position
  ctx.drawImage(backgroundImage, backgroundX, 0, bgWidth, canvas.height);
  ctx.drawImage(backgroundImage, backgroundX + bgWidth, 0, bgWidth, canvas.height);
}

// Main update function
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (bird.y < 0 || bird.y + bird.height > canvas.height) {
    endGame();
  }

  // Draw the scrolling background
  drawBackground();
  
  drawBird();
  drawObstacles();
  updateObstacles();
  frame++;
  animationId = requestAnimationFrame(update);
}

// Start the game
function startGame() {
  document.getElementById('startScreen').style.display = 'none';
  gameRunning = true;
  score = 0;
  gameSpeed = 2;
  bird.y = 200;
  bird.velocity = 0;
  obstacles.length = 0;
  frame = 0;
  document.getElementById('score').textContent = 'Score: 0';
  update();
}

// End the game
function endGame() {
  cancelAnimationFrame(animationId);
  gameRunning = false;
  gameOverSound.play();  // Play game over sound
  document.getElementById('finalScore').textContent = 'Your score: ' + score;
  document.getElementById('gameOverScreen').style.display = 'flex';
}

// Restart the game
function restartGame() {
  document.getElementById('gameOverScreen').style.display = 'none';
  startGame();
}
