const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let missiles = [];
let meteors = [];
let powerUps = [];
let score = 0;
let rocketType = "Basic";
let gameStarted = false;
let playerName = "";

let background = new Image();
background.src = "space-bg.jpg";

let missileImg = new Image();
missileImg.src = "missile.png";

let meteorImg = new Image();
meteorImg.src = "meteor.png";

function startGame() {
  const nameInput = document.getElementById("playerName");
  playerName = nameInput.value || "Oyuncu";
  document.getElementById("menu").style.display = "none";
  gameStarted = true;
  spawnMeteor();
  gameLoop();
}

function drawBackground() {
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
}

function drawMissiles() {
  missiles.forEach((m, index) => {
    m.y -= m.speed;
    if (m.y + m.height < 0) {
      missiles.splice(index, 1);
    } else {
      ctx.drawImage(missileImg, m.x, m.y, m.width, m.height);
    }
  });
}

function drawMeteors() {
  meteors.forEach((m, index) => {
    m.y += m.speed;
    if (m.y > canvas.height) {
      meteors.splice(index, 1);
    } else {
      ctx.drawImage(meteorImg, m.x, m.y, m.width, m.height);
    }
  });
}

function checkCollisions() {
  missiles.forEach((missile, mIndex) => {
    meteors.forEach((meteor, tIndex) => {
      if (
        missile.x < meteor.x + meteor.width &&
        missile.x + missile.width > meteor.x &&
        missile.y < meteor.y + meteor.height &&
        missile.y + missile.height > meteor.y
      ) {
        missiles.splice(mIndex, 1);
        meteors.splice(tIndex, 1);
        score += 10;
        document.getElementById("score").innerText = score;
      }
    });
  });
}

function spawnMeteor() {
  setInterval(() => {
    const x = Math.random() * (canvas.width - 40);
    meteors.push({
      x,
      y: -60,
      width: 40,
      height: 40,
      speed: 2 + Math.random() * 2,
    });
  }, 1000);
}

function gameLoop() {
  if (!gameStarted) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawMissiles();
  drawMeteors();
  checkCollisions();
  requestAnimationFrame(gameLoop);
}

canvas.addEventListener("click", (e) => {
  if (!gameStarted) return;
  const missileX = e.clientX - 10;
  const missileY = canvas.height - 60;

  missiles.push({
    x: missileX,
    y: missileY,
    width: 20,
    height: 40,
    speed: 8,
  });
});

document.getElementById("settingsToggle").addEventListener("click", () => {
  const panel = document.getElementById("settingsPanel");
  panel.style.display = panel.style.display === "none" ? "block" : "none";
});

document.getElementById("backToMenu").addEventListener("click", () => {
  location.reload(); // Oyunu sıfırla ve menüye dön
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
