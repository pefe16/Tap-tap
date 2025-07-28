const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let playerName = "";
let score = 0;
let lives = 5;
let rocketType = "Basic";
let gameRunning = false;
let missedMeteors = 0;
let showSettings = false;
let lastScore = 0;

const meteors = [];
const missiles = [];
const powerUps = [];

let meteorSpeed = 3;

const meteorImg = new Image();
meteorImg.src = "meteor.png";

const missileImg = new Image();
missileImg.src = "missile.png";

const powerUpImg = new Image();
powerUpImg.src = "powerup.png";

const bgImg = new Image();
bgImg.src = "space-bg.jpg";

let playerX = canvas.width / 2 - 20;
const playerY = canvas.height - 100;

function drawBackground() {
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
}

function drawPlayer() {
  ctx.drawImage(missileImg, playerX, playerY, 40, 80);
}

function drawMeteors() {
  meteors.forEach((meteor, index) => {
    meteor.y += meteorSpeed;
    ctx.drawImage(meteorImg, meteor.x, meteor.y, 50, 50);

    if (meteor.y > canvas.height) {
      meteors.splice(index, 1);
      missedMeteors++;
      if (missedMeteors >= 10) {
        lives--;
        missedMeteors = 0;
        if (lives <= 0) {
          gameOver();
        }
      }
    }
  });
}

function drawMissiles() {
  missiles.forEach((missile, index) => {
    missile.y -= 7;
    ctx.drawImage(missileImg, missile.x, missile.y, 10, 30);

    if (missile.y < 0) missiles.splice(index, 1);
  });
}

function drawPowerUps() {
  powerUps.forEach((p, i) => {
    p.y += 2;
    ctx.drawImage(powerUpImg, p.x, p.y, 30, 30);
    if (p.y > canvas.height) powerUps.splice(i, 1);
  });
}

function detectCollisions() {
  meteors.forEach((meteor, mIndex) => {
    missiles.forEach((missile, msIndex) => {
      if (
        missile.x < meteor.x + 40 &&
        missile.x + 10 > meteor.x &&
        missile.y < meteor.y + 40 &&
        missile.y + 30 > meteor.y
      ) {
        meteors.splice(mIndex, 1);
        missiles.splice(msIndex, 1);
        score += 10;
      }
    });
  });
}

function drawUI() {
  document.getElementById("stats").innerHTML =
    `Skor: ${score}<br>Roket: ${rocketType}<br>Can: ${lives}`;
}

function gameOver() {
  gameRunning = false;
  lastScore = score;
  document.getElementById("mainMenu").style.display = "flex";
  document.getElementById("lastScore").innerText = `Son Skor: ${lastScore}`;
  resetGame();
}

function resetGame() {
  score = 0;
  lives = 5;
  missedMeteors = 0;
  meteors.length = 0;
  missiles.length = 0;
  powerUps.length = 0;
}

function gameLoop() {
  if (!gameRunning) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawPlayer();
  drawMissiles();
  drawMeteors();
  drawPowerUps();
  detectCollisions();
  drawUI();
  requestAnimationFrame(gameLoop);
}

function spawnMeteor() {
  if (gameRunning) {
    const x = Math.random() * (canvas.width - 50);
    meteors.push({ x, y: -50 });
  }
}

setInterval(spawnMeteor, 1000);

function fireMissile(e) {
  if (!gameRunning) return;
  const missileX = playerX + 15;
  missiles.push({ x: missileX, y: playerY });
}

canvas.addEventListener("click", fireMissile);

function startGame() {
  playerName = document.getElementById("playerNameInput").value || "Oyuncu";
  document.getElementById("mainMenu").style.display = "none";
  gameRunning = true;
  gameLoop();
}

function toggleSettings() {
  showSettings = !showSettings;
  const menu = document.getElementById("settingsMenu");
  menu.style.display = showSettings ? "flex" : "none";
  gameRunning = !showSettings;
  if (gameRunning) gameLoop();
}

function goToMainMenu() {
  gameRunning = false;
  showSettings = false;
  document.getElementById("settingsMenu").style.display = "none";
  document.getElementById("mainMenu").style.display = "flex";
  document.getElementById("lastScore").innerText = `Son Skor: ${score}`;
  resetGame();
}

function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  document.getElementById("clock").innerText = `${h}:${m} 🌙`;
}
setInterval(updateClock, 1000);
updateClock();
