const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameRunning = false;
let score = 0;
let lives = 5;
let missedMeteors = 0;
let playerName = "";
let lastScore = 0;
let rocketType = "Basic";
let settingsOpen = false;
let meteors = [];
let missiles = [];
let gameInterval;
let meteorSpeed = 2;
let backgroundImage = new Image();
backgroundImage.src = "space-bg.jpg";

// DOM elementleri
const mainMenu = document.getElementById("mainMenu");
const nameInput = document.getElementById("nameInput");
const startButton = document.getElementById("startButton");
const lastScoreDisplay = document.getElementById("lastScore");
const scoreDisplay = document.getElementById("scoreDisplay");
const settingsBtn = document.getElementById("settingsBtn");
const settingsMenu = document.getElementById("settingsMenu");
const restartBtn = document.getElementById("restartBtn");

function startGame() {
  playerName = nameInput.value.trim() || "Player";
  score = 0;
  lives = 5;
  missedMeteors = 0;
  rocketType = "Basic";
  meteorSpeed = 2;
  missiles = [];
  meteors = [];
  mainMenu.style.display = "none";
  restartBtn.style.display = "none";
  scoreDisplay.innerHTML = `Skor: ${score}<br>Roket: ${rocketType}<br>Can: ${lives}`;
  gameRunning = true;
  gameInterval = requestAnimationFrame(updateGame);
}

function endGame() {
  gameRunning = false;
  cancelAnimationFrame(gameInterval);
  restartBtn.style.display = "block";
  lastScore = score;
  lastScoreDisplay.innerText = `Son Skor: ${lastScore}`;
}

function spawnMeteor() {
  meteors.push({
    x: Math.random() * (canvas.width - 40),
    y: -40,
    width: 40,
    height: 40,
    img: new Image(),
  });
  meteors[meteors.length - 1].img.src = "meteor.png";
}

function fireMissile(x, y) {
  missiles.push({
    x: canvas.width / 2 - 5,
    y: canvas.height - 60,
    targetX: x,
    targetY: y,
    speed: 5,
  });
}

function updateGame() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

  // Meteor oluşturma
  if (Math.random() < 0.03) spawnMeteor();

  // Meteorları çiz
  for (let i = 0; i < meteors.length; i++) {
    const m = meteors[i];
    m.y += meteorSpeed;
    ctx.drawImage(m.img, m.x, m.y, m.width, m.height);

    if (m.y > canvas.height) {
      meteors.splice(i, 1);
      missedMeteors++;
      i--;
      if (missedMeteors >= 10) {
        lives--;
        missedMeteors = 0;
        if (lives <= 0) {
          endGame();
        }
      }
    }
  }

  // Füzeleri çiz
  for (let i = 0; i < missiles.length; i++) {
    const missile = missiles[i];
    const dx = missile.targetX - missile.x;
    const dy = missile.targetY - missile.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const velX = (dx / distance) * missile.speed;
    const velY = (dy / distance) * missile.speed;
    missile.x += velX;
    missile.y += velY;

    ctx.fillStyle = "red";
    ctx.fillRect(missile.x, missile.y, 4, 10);

    // Hedefe ulaştıysa sil
    if (distance < 5) {
      missiles.splice(i, 1);
      i--;
    }
  }

  // Çarpışma kontrolü
  for (let i = 0; i < meteors.length; i++) {
    for (let j = 0; j < missiles.length; j++) {
      const m = meteors[i];
      const mis = missiles[j];
      if (
        mis.x < m.x + m.width &&
        mis.x + 4 > m.x &&
        mis.y < m.y + m.height &&
        mis.y + 10 > m.y
      ) {
        meteors.splice(i, 1);
        missiles.splice(j, 1);
        score += 10;
        if (score >= 1000) {
          meteorSpeed = 5;
        } else if (score % 90 === 0) {
          meteorSpeed += 0.2;
        }
        if (score >= 1000) rocketType = "Double";
        updateStats();
        i--;
        break;
      }
    }
  }

  gameInterval = requestAnimationFrame(updateGame);
}

function updateStats() {
  scoreDisplay.innerHTML = `Skor: ${score}<br>Roket: ${rocketType}<br>Can: ${lives}`;
}

canvas.addEventListener("click", (e) => {
  if (gameRunning) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    fireMissile(x, y);
  }
});

settingsBtn.addEventListener("click", () => {
  settingsOpen = !settingsOpen;
  settingsMenu.style.display = settingsOpen ? "block" : "none";
  gameRunning = !settingsOpen;
  if (gameRunning) {
    gameInterval = requestAnimationFrame(updateGame);
  } else {
    cancelAnimationFrame(gameInterval);
  }
});

startButton.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);
