const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const flapSound = document.getElementById('flapSound');
const gameOverSound = document.getElementById('gameOverSound');

let score = 0;
let gameSpeed = 2;
let gameRunning = false;
let animationId;
let frame = 0;
let obstacles = [];

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

bird.image.src = 'https://i.ibb.co/DYQ2ZPf/bird.png';

const backgroundImage = new Image();
backgroundImage.src = 'https://i.ibb.co/CVvCcD0/forest-bg.jpg';
let backgroundX = 0;

document.addEventListener('keydown', flap);
document.addEventListener('touchstart', flap);

function flap() {
  if (!gameRunning) return;
  bird.velocity = bird.jumpStrength;
  flapSound.currentTime = 0;
  flapSound.play();
}

function drawBird() {
  ctx.drawImage(bird.image, bird.x, bird.y, bird.width, bird.height);
}

function drawObstacles() {
  for (let obs of obstacles) {
    ctx.fillStyle = '#4caf50';
    ctx.fillRect(obs.x, 0, obs.width, obs.top);
    ctx.fillRect(obs.x, canvas.height - obs.bottom, obs.width, obs.bottom);
  }
}

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

function drawBackground() {
  const bgWidth = canvas.width;
  backgroundX -= gameSpeed;

  if (backgroundX <= -bgWidth) {
    backgroundX = 0;
  }

  ctx.drawImage(backgroundImage, backgroundX, 0, bgWidth, canvas.height);
  ctx.drawImage(backgroundImage, backgroundX + bgWidth, 0, bgWidth, canvas.height);
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (bird.y < 0 || bird.y + bird.height > canvas.height) {
    endGame();
  }

  drawBackground();
  drawBird();
  drawObstacles();
  updateObstacles();
  frame++;
  animationId = requestAnimationFrame(update);
}

function startGame() {
  document.getElementById('startScreen').style.display = 'none';
  gameRunning = true;
  score = 0;
  gameSpeed = 2;
  bird.y = 200;
  bird.velocity = 0;
  obstacles = [];
  frame = 0;
  document.getElementById('score').textContent = 'Score: 0';
  update();
}

function endGame() {
  cancelAnimationFrame(animationId);
  gameRunning = false;
  gameOverSound.play();
  document.getElementById('finalScore').textContent = 'Your score: ' + score;
  document.getElementById('gameOverScreen').style.display = 'flex';
}

function restartGame() {
  document.getElementById('gameOverScreen').style.display = 'none';
  startGame();
}
