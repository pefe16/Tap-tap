const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gameStarted = false;
let gamePaused = false;
let playerName = "";
let score = 0;
let rockets = [];
let meteors = [];
let powerups = [];
let rocketImg = new Image();
rocketImg.src = "missile.png";
let meteorImg = new Image();
meteorImg.src = "meteor.png";
let powerupImg = new Image();
powerupImg.src = "powerup.png";

document.getElementById("rocket-type").textContent = "Basic";

// Başlat
function startGame() {
  playerName = document.getElementById("player-name").value || "Oyuncu";
  document.getElementById("start-screen").style.display = "none";
  gameStarted = true;
  spawnMeteor();
  spawnPowerup();
  animate();
}

function toggleSettings() {
  const panel = document.getElementById("settings-panel");
  panel.style.display = panel.style.display === "none" ? "block" : "none";
}

function togglePause() {
  gamePaused = !gamePaused;
  if (!gamePaused) animate();
}

function spawnMeteor() {
  setInterval(() => {
    if (!gameStarted || gamePaused) return;
    meteors.push({
      x: Math.random() * canvas.width,
      y: -60,
      size: 60,
      speed: 2 + Math.random() * 3,
    });
  }, 800);
}

function spawnPowerup() {
  setInterval(() => {
    if (!gameStarted || gamePaused) return;
    powerups.push({
      x: Math.random() * canvas.width,
      y: -50,
      size: 40,
      speed: 2,
    });
  }, 10000);
}

canvas.addEventListener("click", (e) => {
  if (!gameStarted || gamePaused) return;
  rockets.push({
    x: canvas.width / 2,
    y: canvas.height,
    targetX: e.clientX,
    targetY: e.clientY,
    speed: 10,
  });
});

function drawRocket(rocket) {
  let angle = Math.atan2(rocket.targetY - rocket.y, rocket.targetX - rocket.x);
  rocket.x += rocket.speed * Math.cos(angle);
  rocket.y += rocket.speed * Math.sin(angle);
  ctx.save();
  ctx.translate(rocket.x, rocket.y);
  ctx.rotate(angle);
  ctx.drawImage(rocketImg, -15, -15, 30, 30);
  ctx.restore();
}

function drawMeteor(meteor, index) {
  meteor.y += meteor.speed;
  ctx.drawImage(meteorImg, meteor.x, meteor.y, meteor.size, meteor.size);
  if (meteor.y > canvas.height) meteors.splice(index, 1);
}

function drawPowerup(p, index) {
  p.y += p.speed;
  ctx.drawImage(powerupImg, p.x, p.y, p.size, p.size);
  if (p.y > canvas.height) powerups.splice(index, 1);
}

function detectCollisions() {
  rockets.forEach((r, ri) => {
    meteors.forEach((m, mi) => {
      if (
        r.x > m.x &&
        r.x < m.x + m.size &&
        r.y > m.y &&
        r.y < m.y + m.size
      ) {
        meteors.splice(mi, 1);
        rockets.splice(ri, 1);
        score += 10;
        document.getElementById("score").textContent = score;
      }
    });

    powerups.forEach((p, pi) => {
      if (
        r.x > p.x &&
        r.x < p.x + p.size &&
        r.y > p.y &&
        r.y < p.y + p.size
      ) {
        powerups.splice(pi, 1);
        rockets.splice(ri, 1);
        score += 25;
        document.getElementById("score").textContent = score;
      }
    });
  });
}

function animate() {
  if (!gameStarted || gamePaused) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  rockets.forEach((r, i) => drawRocket(r, i));
  meteors.forEach((m, i) => drawMeteor(m, i));
  powerups.forEach((p, i) => drawPowerup(p, i));
  detectCollisions();

  requestAnimationFrame(animate);
}
