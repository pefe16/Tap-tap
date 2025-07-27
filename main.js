const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let playerName = "";
let score = 0;
let gameRunning = false;
let gamePaused = false;

let missiles = [];
let asteroids = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Başlatma
window.startGame = function () {
  playerName = document.getElementById("playerName").value || "Oyuncu";
  document.getElementById("startScreen").style.display = "none";
  score = 0;
  gameRunning = true;
  gamePaused = false;
  asteroids = [];
  missiles = [];
  spawnAsteroid();
  gameLoop();
};

// Durdur / Devam
window.togglePause = function () {
  if (!gameRunning) return;
  gamePaused = !gamePaused;
  if (!gamePaused) {
    gameLoop();
  }
};

// Ana Menüye Dön
window.backToMenu = function () {
  gameRunning = false;
  gamePaused = false;
  missiles = [];
  asteroids = [];
  document.getElementById("startScreen").style.display = "block";
};

// Ayarları Aç / Kapat
window.toggleSettings = function () {
  const panel = document.getElementById("settingsPanel");
  panel.style.display = panel.style.display === "none" ? "block" : "none";
};

// Füze Fırlatma (sadece yukarıya düz)
canvas.addEventListener("click", function (e) {
  if (!gameRunning || gamePaused) return;
  missiles.push({
    x: e.clientX,
    y: canvas.height - 20,
    dy: -10
  });
});

// Asteroid üret
function spawnAsteroid() {
  if (!gameRunning) return;
  asteroids.push({
    x: Math.random() * canvas.width,
    y: -40,
    dy: 2 + Math.random() * 2
  });
  setTimeout(spawnAsteroid, 1000);
}

// Oyun Döngüsü
function gameLoop() {
  if (!gameRunning || gamePaused) return;
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Güncelle
function update() {
  // Füze hareketi
  missiles.forEach((m, i) => {
    m.y += m.dy;
    if (m.y < -20) missiles.splice(i, 1);
  });

  // Asteroid hareketi ve çarpışma kontrolü
  asteroids.forEach((a, ai) => {
    a.y += a.dy;
    if (a.y > canvas.height) asteroids.splice(ai, 1);

    missiles.forEach((m, mi) => {
      if (Math.hypot(a.x - m.x, a.y - m.y) < 25) {
        asteroids.splice(ai, 1);
        missiles.splice(mi, 1);
        score++;
        updateScore();
      }
    });
  });
}

// Skoru Güncelle
function updateScore() {
  document.getElementById("scoreDisplay").textContent = `⭐ Skor: ${score}`;
}

// Çizim
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Füze
  ctx.fillStyle = "lime";
  missiles.forEach(m => {
    ctx.fillRect(m.x - 2, m.y, 4, 10);
  });

  // Asteroid
  ctx.fillStyle = "red";
  asteroids.forEach(a => {
    ctx.beginPath();
    ctx.arc(a.x, a.y, 20, 0, Math.PI * 2);
    ctx.fill();
  });

  // Oyuncu bilgisi
  ctx.fillStyle = "lime";
  ctx.font = "14px Arial";
  ctx.fillText(`👤 ${playerName}`, 10, canvas.height - 10);
}
