const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let missiles = [];
let meteors = [];
let powerUps = [];
let score = 0;

const missileImg = new Image();
missileImg.src = "missile.png";

const meteorImg = new Image();
meteorImg.src = "meteor.png";

const powerUpImg = new Image();
powerUpImg.src = "powerup.png";

const bgImg = new Image();
bgImg.src = "space-bg.jpg";

// Oyuncu nesnesi
const player = {
  x: canvas.width / 2,
  y: canvas.height - 80,
  width: 40,
  height: 40,
};

// Ayar paneli
const settingsBtn = document.createElement("button");
settingsBtn.innerHTML = "⚙️ Ayarları Aç/Kapat";
settingsBtn.style.position = "absolute";
settingsBtn.style.top = "20px";
settingsBtn.style.right = "20px";
settingsBtn.style.zIndex = 2;
settingsBtn.style.padding = "10px";
settingsBtn.style.border = "2px solid lime";
settingsBtn.style.borderRadius = "10px";
settingsBtn.style.background = "black";
settingsBtn.style.color = "lime";
settingsBtn.style.fontSize = "16px";
document.body.appendChild(settingsBtn);

const settingsPanel = document.createElement("div");
settingsPanel.style.position = "absolute";
settingsPanel.style.top = "70px";
settingsPanel.style.right = "20px";
settingsPanel.style.padding = "10px";
settingsPanel.style.background = "rgba(0,0,0,0.7)";
settingsPanel.style.color = "white";
settingsPanel.style.display = "none";
settingsPanel.style.zIndex = 2;
settingsPanel.innerHTML = `
  <button id="backToMenu">🔙 Ana Menüye Dön</button><br><br>
`;
document.body.appendChild(settingsPanel);

settingsBtn.addEventListener("click", () => {
  settingsPanel.style.display = settingsPanel.style.display === "none" ? "block" : "none";
});

document.getElementById("backToMenu").addEventListener("click", () => {
  location.reload();
});

// Füze gönderme - düz yukarı
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const missileX = e.clientX - rect.left;
  missiles.push({
    x: missileX - 10,
    y: player.y,
    width: 20,
    height: 40,
    speed: 7
  });
});

// Meteor üret
function spawnMeteor() {
  meteors.push({
    x: Math.random() * (canvas.width - 40),
    y: -40,
    width: 40,
    height: 40,
    speed: 2 + Math.random() * 3
  });
}

// Power-up üret
function spawnPowerUp() {
  powerUps.push({
    x: Math.random() * (canvas.width - 30),
    y: -30,
    width: 30,
    height: 30,
    speed: 2
  });
}

// Çizim
function draw() {
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

  // Oyuncu
  ctx.drawImage(icon, player.x - player.width / 2, player.y, player.width, player.height);

  // Füzeler
  missiles.forEach((m) => {
    ctx.drawImage(missileImg, m.x, m.y, m.width, m.height);
  });

  // Meteorlar
  meteors.forEach((m) => {
    ctx.drawImage(meteorImg, m.x, m.y, m.width, m.height);
  });

  // Power-up
  powerUps.forEach((p) => {
    ctx.drawImage(powerUpImg, p.x, p.y, p.width, p.height);
  });

  // Skor
  ctx.fillStyle = "lime";
  ctx.font = "20px Arial";
  ctx.fillText("⭐ Skor: " + score, 20, 40);
  ctx.fillText("🚀 Roket: Basic", 20, 70);
}

// Güncelleme
function update() {
  missiles.forEach((m, i) => {
    m.y -= m.speed;
    if (m.y < -m.height) missiles.splice(i, 1);
  });

  meteors.forEach((m, i) => {
    m.y += m.speed;
    if (m.y > canvas.height) meteors.splice(i, 1);
  });

  powerUps.forEach((p, i) => {
    p.y += p.speed;
    if (p.y > canvas.height) powerUps.splice(i, 1);
  });

  // Çarpışmalar
  missiles.forEach((m, mi) => {
    meteors.forEach((me, mei) => {
      if (m.x < me.x + me.width &&
          m.x + m.width > me.x &&
          m.y < me.y + me.height &&
          m.y + m.height > me.y) {
        missiles.splice(mi, 1);
        meteors.splice(mei, 1);
        score++;
      }
    });

    powerUps.forEach((p, pi) => {
      if (m.x < p.x + p.width &&
          m.x + m.width > p.x &&
          m.y < p.y + p.height &&
          m.y + m.height > p.y) {
        missiles.splice(mi, 1);
        powerUps.splice(pi, 1);
        score += 5;
      }
    });
  });
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Başlangıçta üretmeye başla
setInterval(spawnMeteor, 1200);
setInterval(spawnPowerUp, 7000);

const icon = new Image();
icon.src = "icon.png";

bgImg.onload = () => {
  gameLoop();
};
