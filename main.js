// 🌌 Galaksi yıldız kayması efekti
const starCanvas = document.getElementById("stars");
const starCtx = starCanvas.getContext("2d");
starCanvas.width = window.innerWidth;
starCanvas.height = window.innerHeight;

let stars = [];
for (let i = 0; i < 100; i++) {
  stars.push({
    x: Math.random() * starCanvas.width,
    y: Math.random() * starCanvas.height,
    r: Math.random() * 1.5,
    dx: Math.random() * 0.5 + 0.2,
    dy: Math.random() * 0.5 + 0.2
  });
}

function drawStars() {
  starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
  starCtx.fillStyle = "white";
  stars.forEach(s => {
    starCtx.beginPath();
    starCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    starCtx.fill();
    s.x -= s.dx;
    s.y += s.dy;
    if (s.x < 0 || s.y > starCanvas.height) {
      s.x = Math.random() * starCanvas.width;
      s.y = -5;
    }
  });
  requestAnimationFrame(drawStars);
}
drawStars();

// 🚀 Oyun başlangıcı
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let asteroids = [], missiles = [], powerUps = [];
let score = 0, level = 1, hiscore = +localStorage.hiscore || 0;
let rocketType = localStorage.rocketType || "default";
let slowMotion = false, shieldActive = false, theme = "dark";
let difficultyFactor = 1;

document.getElementById("score").textContent = score;
document.getElementById("level").textContent = level;
document.getElementById("hiscore").textContent = hiscore;

const nameInput = document.getElementById("playerName");
nameInput.value = localStorage.playerName || "";
nameInput.oninput = () => localStorage.playerName = nameInput.value;

const rocketSelect = document.getElementById("rocketType");
rocketSelect.value = rocketType;
rocketSelect.onchange = () => {
  rocketType = rocketSelect.value;
  localStorage.rocketType = rocketType;
};

// Ses ayarları
const music = new Audio("https://cdn.pixabay.com/audio/2022/12/19/audio_124b03d723.mp3");
music.loop = true;
music.volume = parseFloat(document.getElementById("musicVolume").value);
music.play();

document.getElementById("musicVolume").oninput = e => {
  music.volume = parseFloat(e.target.value);
};

let fxVolume = parseFloat(document.getElementById("fxVolume").value);
document.getElementById("fxVolume").oninput = e => fxVolume = parseFloat(e.target.value);

function playFx(url) {
  const fx = new Audio(url);
  fx.volume = fxVolume;
  fx.play();
}

function fireMissile(x) {
  const missileSet = rocketType === "dual" ? [x - 10, x + 10] : [x];
  missileSet.forEach(mx => {
    missiles.push({ x: mx, y: canvas.height - 30, r: 4 });
    playFx("https://cdn.pixabay.com/audio/2022/03/15/audio_115b6e2721.mp3");
  });
  if (navigator.vibrate) navigator.vibrate(50);
}

function spawnAsteroid() {
  const r = 18 + Math.random() * 12;
  const speed = (1.5 + Math.random()) * level * difficultyFactor;
  asteroids.push({
    x: Math.random() * canvas.width,
    y: -r,
    r,
    speed,
    dir: Math.random() > 0.5 ? 1 : -1,
    swing: Math.random() * 0.5 + 0.2
  });
}

function spawnPowerUp() {
  const types = ["shield", "slow", "score"];
  const type = types[Math.floor(Math.random() * types.length)];
  powerUps.push({
    x: Math.random() * canvas.width,
    y: -20,
    type,
    speed: 2
  });
}

function checkCollision(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy) < a.r + b.r;
}

function toggleTheme() {
  theme = theme === "dark" ? "light" : "dark";
  document.body.style.background = theme === "dark" ? "black" : "white";
  document.body.style.color = theme === "dark" ? "lime" : "black";
}

function takeScreenshot() {
  const img = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = img;
  a.download = "screenshot.png";
  a.click();
}

function shareScore() {
  const msg = `${nameInput.value || "Oyuncu"} ${score} skor yaptı! 🚀`;
  if (navigator.share) {
    navigator.share({ title: "Skorum", text: msg });
  } else {
    alert("Tarayıcın desteklemiyor. Skorun: " + score);
  }
}

canvas.addEventListener("click", e => {
  const x = e.clientX - canvas.getBoundingClientRect().left;
  fireMissile(x);
});

function update() {
  missiles.forEach(m => m.y -= 8);
  asteroids.forEach(a => {
    a.y += a.speed;
    a.x += Math.sin(a.y * a.swing) * a.dir;
  });
  powerUps.forEach(p => p.y += p.speed);

  missiles = missiles.filter(m => m.y > 0);
  asteroids = asteroids.filter(a => a.y < canvas.height);
  powerUps = powerUps.filter(p => p.y < canvas.height);

  asteroids.forEach((a, ai) => {
    missiles.forEach((m, mi) => {
      if (checkCollision(a, m)) {
        asteroids.splice(ai, 1);
        missiles.splice(mi, 1);
        score++;
        if (score > hiscore) {
          hiscore = score;
          localStorage.hiscore = score;
        }
        if (score % 10 === 0) {
          level++;
          difficultyFactor += 0.1;
        }
        document.getElementById("score").textContent = score;
        document.getElementById("level").textContent = level;
        document.getElementById("hiscore").textContent = hiscore;
        playFx("https://cdn.pixabay.com/audio/2022/10/16/audio_12a049f072.mp3");
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      }
    });
  });

  powerUps.forEach((p, pi) => {
    if (checkCollision(p, { x: canvas.width / 2, y: canvas.height - 30, r: 20 })) {
      if (p.type === "shield") shieldActive = true;
      if (p.type === "slow") slowMotion = true;
      if (p.type === "score") score += 5;
      playFx("https://cdn.pixabay.com/audio/2022/11/15/audio_a17290c21e.mp3");
      powerUps.splice(pi, 1);
    }
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "orange";
  asteroids.forEach(a => {
    ctx.beginPath();
    ctx.arc(a.x, a.y, a.r, 0, 2 * Math.PI);
    ctx.fill();
  });

  ctx.fillStyle = "cyan";
  missiles.forEach(m => {
    ctx.beginPath();
    ctx.arc(m.x, m.y, m.r, 0, 2 * Math.PI);
    ctx.fill();
  });

  powerUps.forEach(p => {
    ctx.fillStyle = p.type === "shield" ? "lime" : p.type === "slow" ? "blue" : "yellow";
    ctx.beginPath();
    ctx.arc(p.x, p.y, 8, 0, 2 * Math.PI);
    ctx.fill();
  });
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
setInterval(spawnAsteroid, 1000);
setInterval(spawnPowerUp, 5000);
