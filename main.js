const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameRunning = false;
let gamePaused = false;
let playerName = "";
let rocketType = "basic";
let score = 0;

let asteroids = [];
let missiles = [];
let powerups = [];

let meteorImg = new Image();
meteorImg.src = "meteor.png";

let missileImg = new Image();
missileImg.src = "missile.png";

let powerupImg = new Image();
powerupImg.src = "powerup.png";

// Boyutlandırma
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Oyunu başlat
window.startGame = function () {
  playerName = document.getElementById("playerName").value || "Oyuncu";
  rocketType = document.getElementById("rocketType").value;
  document.getElementById("startScreen").style.display = "none";
  gameRunning = true;
  gamePaused = false;
  score = 0;
  asteroids = [];
  missiles = [];
  powerups = [];
  spawnAsteroid();
  spawnPowerup();
  gameLoop();
};

// Durdur / Başlat
document.getElementById("pauseButton").addEventListener("click", function () {
  if (!gameRunning) return;
  gamePaused = !gamePaused;
  this.textContent = gamePaused ? "▶ Başlat" : "⏸ Durdur";
  if (!gamePaused) {
    gameLoop();
  }
});

// Ayar paneli aç/kapat
document.getElementById("togglePanel").addEventListener("click", function () {
  const panel = document.getElementById("controlPanel");
  panel.style.display = panel.style.display === "none" ? "block" : "none";
});

// Ana Menüye Dön
window.returnToMenu = function () {
  gameRunning = false;
  document.getElementById("startScreen").style.display = "flex";
};

// Tema değiştir (placeholder)
window.changeTheme = function () {
  alert("Tema değiştirme yakında!");
};

// Ekran görüntüsü (placeholder)
window.captureScreen = function () {
  alert("Ekran görüntüsü alma özelliği yakında!");
};

// Skor paylaş (placeholder)
window.shareScore = function () {
  alert(`${playerName} skoru: ${score}`);
};

// Füze fırlatma
canvas.addEventListener("click", (e) => {
  if (!gameRunning || gamePaused) return;
  const x = canvas.width / 2;
  const y = canvas.height;
  const targetX = e.clientX;
  const targetY = e.clientY;
  const angle = Math.atan2(targetY - y, targetX - x);
  missiles.push({
    x,
    y,
    dx: Math.cos(angle) * 10,
    dy: Math.sin(angle) * 10
  });
});

// Asteroid oluştur
function spawnAsteroid() {
  if (!gameRunning) return;
  asteroids.push({
    x: Math.random() * canvas.width,
    y: -50,
    speed: 2 + Math.random() * 3
  });
  setTimeout(spawnAsteroid, 1000);
}

// Power-up oluştur
function spawnPowerup() {
  if (!gameRunning) return;
  powerups.push({
    x: Math.random() * canvas.width,
    y: -30,
    speed: 2
  });
  setTimeout(spawnPowerup, 10000);
}

// Oyun döngüsü
function gameLoop() {
  if (!gameRunning || gamePaused) return;
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Güncelleme
function update() {
  missiles.forEach((m, i) => {
    m.x += m.dx;
    m.y += m.dy;
    if (m.y < 0) missiles.splice(i, 1);
  });

  asteroids.forEach((a, i) => {
    a.y += a.speed;
    if (a.y > canvas.height) asteroids.splice(i, 1);

    missiles.forEach((m, j) => {
      if (Math.hypot(a.x - m.x, a.y - m.y) < 30) {
        asteroids.splice(i, 1);
        missiles.splice(j, 1);
        score++;
      }
    });
  });

  powerups.forEach((p, i) => {
    p.y += p.speed;
    if (p.y > canvas.height) powerups.splice(i, 1);

    missiles.forEach((m, j) => {
      if (Math.hypot(p.x - m.x, p.y - m.y) < 30) {
        powerups.splice(i, 1);
        missiles.splice(j, 1);
        score += 5; // Bonus
      }
    });
  });
}

// Çizim
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Roket ve skor bilgisi
  ctx.fillStyle = "lime";
  ctx.font = "16px Arial";
  ctx.fillText(`🚀 Roket: ${rocketType}`, 20, 30);
  ctx.fillText(`⭐ Skor: ${score}`, 20, 50);

  // Füze
  missiles.forEach((m) => {
    ctx.drawImage(missileImg, m.x - 10, m.y - 20, 20, 40);
  });

  // Meteor
  asteroids.forEach((a) => {
    ctx.drawImage(meteorImg, a.x - 20, a.y - 20, 40, 40);
  });

  // Power-up
  powerups.forEach((p) => {
    ctx.drawImage(powerupImg, p.x - 15, p.y - 15, 30, 30);
  });
}
