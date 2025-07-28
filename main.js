const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Oyun değişkenleri
let missiles = [];
let meteors = [];
let score = 0;
let rocketType = "Basic";
let playerName = "";
let gameStarted = false;
let gamePaused = false;
let meteorSpeed = 3;
let doubleRocket = false;

// Arka plan görseli
const background = new Image();
background.src = "space-bg.jpg";

// Görseller
const missileImg = new Image();
missileImg.src = "missile.png";

const meteorImg = new Image();
meteorImg.src = "meteor.png";

// Skorları yükle
const savedName = localStorage.getItem("playerName");
const bestScore = parseInt(localStorage.getItem("bestScore")) || 0;
if (savedName) document.getElementById("playerName").value = savedName;

// Oyunu başlat
function startGame() {
  playerName = document.getElementById("playerName").value || "Oyuncu";
  localStorage.setItem("playerName", playerName);
  document.getElementById("menu").style.display = "none";
  gameStarted = true;
  spawnMeteors();
  gameLoop();
}

// Ayarlar kontrolü
document.getElementById("settingsToggle").addEventListener("click", () => {
  const panel = document.getElementById("settingsPanel");
  if (panel.style.display === "none") {
    panel.style.display = "block";
    gamePaused = true;
  } else {
    panel.style.display = "none";
    gamePaused = false;
    requestAnimationFrame(gameLoop);
  }
});

// Ana menüye dön
document.getElementById("backToMenu").addEventListener("click", () => {
  location.reload();
});

// Füze gönder
canvas.addEventListener("click", (e) => {
  if (!gameStarted || gamePaused) return;
  const x = e.clientX - 10;
  const y = canvas.height - 60;

  missiles.push({ x, y, width: 20, height: 40, speed: 10 });

  // Çift roket özelliği aktifse ekstra füze
  if (doubleRocket) {
    missiles.push({ x: x + 30, y, width: 20, height: 40, speed: 10 });
  }
});

// Meteor oluştur
function spawnMeteors() {
  setInterval(() => {
    if (!gameStarted || gamePaused) return;
    const x = Math.random() * (canvas.width - 40);
    meteors.push({ x, y: -60, width: 40, height: 40, speed: meteorSpeed });
  }, 1000);
}

// Çizim fonksiyonu
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  // Füzeler
  missiles.forEach((m, i) => {
    m.y -= m.speed;
    if (m.y + m.height < 0) missiles.splice(i, 1);
    else ctx.drawImage(missileImg, m.x, m.y, m.width, m.height);
  });

  // Meteorlar
  meteors.forEach((m, i) => {
    m.y += m.speed;
    if (m.y > canvas.height) meteors.splice(i, 1);
    else ctx.drawImage(meteorImg, m.x, m.y, m.width, m.height);
  });

  // Skor
  document.getElementById("score").innerText = score;
  document.getElementById("rocketType").innerText = rocketType;
}

// Çarpışma kontrolü
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

        // Meteor hızı her 90 puanda artar (max 1000 puan)
        if (score % 90 === 0 && score <= 1000) {
          meteorSpeed += 0.5;
        }

        // Çift roket 1000 puanda açılır
        if (score >= 1000 && !doubleRocket) {
          doubleRocket = true;
          rocketType = "Double";
        }

        // En yüksek skor kaydı
        const best = parseInt(localStorage.getItem("bestScore")) || 0;
        if (score > best) {
          localStorage.setItem("bestScore", score);
        }
      }
    });
  });
}

// Ana oyun döngüsü
function gameLoop() {
  if (!gameStarted || gamePaused) return;
  draw();
  checkCollisions();
  requestAnimationFrame(gameLoop);
}

// Yeniden boyutlanınca canvas’ı ayarla
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
