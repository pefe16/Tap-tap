const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let playerName = "";
let score = 0;
let lives = 5;
let missedMeteors = 0;
let gameRunning = false;
let gamePaused = false;
let lastScore = 0;

let missiles = [];
let meteors = [];

const missileImg = new Image();
missileImg.src = "missile.png";

const meteorImg = new Image();
meteorImg.src = "meteor.png";

const bgImage = new Image();
bgImage.src = "space-bg.jpg";

function spawnMeteor() {
  const x = Math.random() * canvas.width;
  meteors.push({
    x: x,
    y: -60,
    width: 50,
    height: 50,
    speed: 3 + Math.random() * 2
  });
}

function spawnMissile(x, y) {
  missiles.push({
    x: x - 12,
    y: y,
    width: 25,
    height: 40,
    speed: 10
  });
}

function resetGame() {
  score = 0;
  lives = 5;
  missedMeteors = 0;
  missiles = [];
  meteors = [];
  gameRunning = true;
  gamePaused = false;
  document.getElementById("gameOverScreen").style.display = "none";
}

function draw() {
  if (gameRunning && !gamePaused) {
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  if (!gameRunning || gamePaused) return;

  // Meteorları çiz
  for (let i = meteors.length - 1; i >= 0; i--) {
    let m = meteors[i];
    m.y += m.speed;

    ctx.drawImage(meteorImg, m.x, m.y, m.width, m.height);

    if (m.y > canvas.height) {
      meteors.splice(i, 1);
      missedMeteors++;
      if (missedMeteors >= 10) {
        lives--;
        missedMeteors = 0;
        if (lives <= 0) {
          gameRunning = false;
          lastScore = score;
          document.getElementById("lastScoreDisplay").innerText = `Son Skor: ${lastScore}`;
          document.getElementById("gameOverScreen").style.display = "flex";
        }
      }
    }
  }

  // Füzeleri çiz
  for (let i = missiles.length - 1; i >= 0; i--) {
    let ms = missiles[i];
    ms.y -= ms.speed;

    ctx.drawImage(missileImg, ms.x, ms.y, ms.width, ms.height);

    if (ms.y + ms.height < 0) {
      missiles.splice(i, 1);
    } else {
      for (let j = meteors.length - 1; j >= 0; j--) {
        let m = meteors[j];
        if (
          ms.x < m.x + m.width &&
          ms.x + ms.width > m.x &&
          ms.y < m.y + m.height &&
          ms.y + ms.height > m.y
        ) {
          score += 10;
          meteors.splice(j, 1);
          missiles.splice(i, 1);
          break;
        }
      }
    }
  }

  // Skor ve istatistik güncelle
  document.getElementById("score").innerText = `Skor: ${score}`;
  document.getElementById("rocketType").innerText = `Roket: Basic`;
  document.getElementById("lives").innerText = `Can: ${lives}`;
}

function update() {
  if (gameRunning && !gamePaused) {
    draw();
    requestAnimationFrame(update);
  } else if (gameRunning && gamePaused) {
    draw(); // sadece durdurulmuş ekranı göster
  }
}

canvas.addEventListener("click", function (e) {
  if (!gameRunning || gamePaused) return;
  spawnMissile(e.clientX, canvas.height - 100);
});

setInterval(() => {
  if (gameRunning && !gamePaused) spawnMeteor();
}, 800);

// Başlat butonu
document.getElementById("startButton").addEventListener("click", () => {
  playerName = document.getElementById("playerName").value || "Oyuncu";
  document.getElementById("startScreen").style.display = "none";
  gameRunning = true;
  gamePaused = false;
  update();
});

// Tekrar oyna
document.getElementById("restartButton").addEventListener("click", () => {
  resetGame();
  update();
});

// Ayarlar butonu
document.getElementById("settingsButton").addEventListener("click", () => {
  const panel = document.getElementById("settingsPanel");
  const isOpen = panel.style.display === "block";
  panel.style.display = isOpen ? "none" : "block";
  gamePaused = !isOpen;
  if (!isOpen) {
    update(); // devam ettir
  }
});

// Ana menüye dön
document.getElementById("backToMenu").addEventListener("click", () => {
  document.getElementById("settingsPanel").style.display = "none";
  document.getElementById("startScreen").style.display = "flex";
  lastScore = score;
  document.getElementById("lastScoreDisplay").innerText = `Son Skor: ${lastScore}`;
  gameRunning = false;
  gamePaused = false;
});
