const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let playerX = canvas.width / 2;
const playerY = canvas.height - 60;
let missiles = [];
let asteroids = [];
let score = 0;
let lives = 5;
let missed = 0;
let gameRunning = false;
let gamePaused = false;
let lastScore = 0;

const playerImage = new Image();
playerImage.src = "rocket.png";

const asteroidImage = new Image();
asteroidImage.src = "asteroid.png";

const bgImage = new Image();
bgImage.src = "space-bg.jpg";

canvas.addEventListener("click", (e) => {
  if (!gameRunning || gamePaused) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  missiles.push({ x: x - 2, y: playerY });
});

function spawnAsteroid() {
  const x = Math.random() * (canvas.width - 40);
  asteroids.push({ x: x, y: -40 });
}

function updateMissiles() {
  for (let i = 0; i < missiles.length; i++) {
    missiles[i].y -= 7;
    if (missiles[i].y < 0) {
      missiles.splice(i, 1);
      i--;
    }
  }
}

function updateAsteroids() {
  for (let i = 0; i < asteroids.length; i++) {
    asteroids[i].y += 2.5;
    if (asteroids[i].y > canvas.height) {
      missed++;
      asteroids.splice(i, 1);
      i--;
      if (missed >= 10) {
        lives--;
        missed = 0;
        if (lives <= 0) {
          endGame();
        }
      }
    }
  }
}

function checkCollisions() {
  for (let i = 0; i < missiles.length; i++) {
    for (let j = 0; j < asteroids.length; j++) {
      const m = missiles[i];
      const a = asteroids[j];
      if (
        m.x < a.x + 40 &&
        m.x + 4 > a.x &&
        m.y < a.y + 40 &&
        m.y + 10 > a.y
      ) {
        missiles.splice(i, 1);
        asteroids.splice(j, 1);
        score += 10;
        i--;
        break;
      }
    }
  }
}

function drawBackground() {
  ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
}

function drawPlayer() {
  ctx.drawImage(playerImage, playerX - 20, playerY, 40, 40);
}

function drawMissiles() {
  ctx.fillStyle = "red";
  missiles.forEach((m) => {
    ctx.fillRect(m.x, m.y, 4, 10);
  });
}

function drawAsteroids() {
  asteroids.forEach((a) => {
    ctx.drawImage(asteroidImage, a.x, a.y, 40, 40);
  });
}

function drawStats() {
  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.fillText("Skor: " + score, 10, 50);
  ctx.fillText("Roket: Basic", 10, 70);
  ctx.fillText("Can: " + lives, 10, 90);
}

function gameLoop() {
  if (!gameRunning || gamePaused) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawPlayer();
  drawMissiles();
  drawAsteroids();
  drawStats();
  updateMissiles();
  updateAsteroids();
  checkCollisions();

  requestAnimationFrame(gameLoop);
}

function startGame() {
  playerX = canvas.width / 2;
  score = 0;
  lives = 5;
  missed = 0;
  missiles = [];
  asteroids = [];
  gameRunning = true;
  gamePaused = false;
  document.getElementById("restartButton").style.display = "none";
  document.getElementById("gameCanvas").style.display = "block";
  document.getElementById("mainMenu").style.display = "none";
  gameLoop();
}

function endGame() {
  gameRunning = false;
  lastScore = score;
  document.getElementById("restartButton").style.display = "block";
}

function toggleSettings() {
  const menu = document.getElementById("settingsMenu");
  if (menu.style.display === "block") {
    menu.style.display = "none";
    gamePaused = false;
    gameLoop();
  } else {
    menu.style.display = "block";
    gamePaused = true;
  }
}

function goToMainMenu() {
  gameRunning = false;
  gamePaused = false;
  document.getElementById("mainMenu").style.display = "block";
  document.getElementById("gameCanvas").style.display = "none";
  document.getElementById("restartButton").style.display = "none";
  document.getElementById("settingsMenu").style.display = "none";
  updateLastScoreDisplay();
}

function updateLastScoreDisplay() {
  document.getElementById("lastScoreDisplay").textContent = "Son Skor: " + lastScore;
}

document.getElementById("startButton").addEventListener("click", startGame);
document.getElementById("restartButton").addEventListener("click", startGame);
