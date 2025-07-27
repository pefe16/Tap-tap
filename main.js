const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
let isPaused = false;
let gameStarted = false;

document.getElementById("score").textContent = score;

const missileImg = new Image();
missileImg.src = "missile.png";

const meteorImg = new Image();
meteorImg.src = "meteor.png";

const powerupImg = new Image();
powerupImg.src = "powerup.png";

// Oyuncu konumu
const player = {
  x: canvas.width / 2,
  y: canvas.height - 60,
};

// Füzeler
const missiles = [];
function fireMissile(x, y) {
  missiles.push({ x: player.x, y: player.y, targetX: x, targetY: y });
}

// Meteorlar
const meteors = [];
function spawnMeteor() {
  const x = Math.random() * canvas.width;
  meteors.push({ x, y: -40, speed: 2 + Math.random() * 3 });
}

// Power-up
const powerups = [];
function spawnPowerup() {
  const x = Math.random() * canvas.width;
  powerups.push({ x, y: -30, speed: 2 });
}

setInterval(spawnMeteor, 800);
setInterval(() => {
  if (Math.random() < 0.3) spawnPowerup();
}, 3000);

// Tıklama ile füze atışı
canvas.addEventListener("click", (e) => {
  if (gameStarted && !isPaused) {
    fireMissile(e.clientX, e.clientY);
  }
});

// Oyun döngüsü
function update() {
  if (!gameStarted || isPaused) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Arka plan (space-bg.jpg CSS'te zaten ayarlandı)

  // Oyuncu (kontrol kulesi)
  ctx.fillStyle = "white";
  ctx.fillRect(player.x - 15, player.y - 15, 30, 30);

  // Füze güncelleme
  for (let i = 0; i < missiles.length; i++) {
    const m = missiles[i];
    const angle = Math.atan2(m.targetY - m.y, m.targetX - m.x);
    m.x += Math.cos(angle) * 10;
    m.y += Math.sin(angle) * 10;

    ctx.drawImage(missileImg, m.x - 10, m.y - 20, 20, 40);

    if (m.y < -50 || m.x < -50 || m.x > canvas.width + 50) {
      missiles.splice(i, 1);
      i--;
    }
  }

  // Meteor güncelleme
  for (let i = 0; i < meteors.length; i++) {
    const meteor = meteors[i];
    meteor.y += meteor.speed;
    ctx.drawImage(meteorImg, meteor.x - 20, meteor.y - 20, 40, 40);

    // Çarpışma kontrol
    for (let j = 0; j < missiles.length; j++) {
      const dx = meteor.x - missiles[j].x;
      const dy = meteor.y - missiles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 30) {
        meteors.splice(i, 1);
        missiles.splice(j, 1);
        score += 10;
        document.getElementById("score").textContent = score;
        i--;
        break;
      }
    }
  }

  // Power-up güncelleme
  for (let i = 0; i < powerups.length; i++) {
    const p = powerups[i];
    p.y += p.speed;
    ctx.drawImage(powerupImg, p.x - 15, p.y - 15, 30, 30);

    for (let j = 0; j < missiles.length; j++) {
      const dx = p.x - missiles[j].x;
      const dy = p.y - missiles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 30) {
        powerups.splice(i, 1);
        missiles.splice(j, 1);
        score += 50;
        document.getElementById("score").textContent = score;
        i--;
        break;
      }
    }
  }

  requestAnimationFrame(update);
}

// Ekran boyutu değişirse canvas güncelle
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  player.x = canvas.width / 2;
  player.y = canvas.height - 60;
});

// Oyun başlangıç fonksiyonu
function startGame() {
  document.getElementById("startScreen").style.display = "none";
  gameStarted = true;
  isPaused = false;
  update();
}

// Ayarları aç/kapat
document.getElementById("settingsToggle").addEventListener("click", () => {
  const panel = document.getElementById("settingsPanel");
  panel.style.display = panel.style.display === "block" ? "none" : "block";
});

// Durdur / başlat
function togglePause() {
  isPaused = !isPaused;
  if (!isPaused) update();
}

// Ana menüye dön
function goToMainMenu() {
  gameStarted = false;
  isPaused = false;
  missiles.length = 0;
  meteors.length = 0;
  powerups.length = 0;
  score = 0;
  document.getElementById("score").textContent = score;
  document.getElementById("startScreen").style.display = "flex";
}
