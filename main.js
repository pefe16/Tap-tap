const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let asteroids = [], missiles = [];
let score = 0, level = 1, hiscore = +localStorage.hiscore || 0;
let playing = true;
let theme = "dark";
let rocketType = "default";
let slowMotion = false;
let shieldActive = false;

// UI elemanları
document.getElementById("score").textContent = score;
document.getElementById("level").textContent = level;
document.getElementById("hiscore").textContent = hiscore;

const nameInput = document.getElementById("playerName");
nameInput.value = localStorage.playerName || "";
nameInput.oninput = () => localStorage.playerName = nameInput.value;

const rocketSelect = document.getElementById("rocketType");
rocketSelect.value = localStorage.rocketType || "default";
rocketSelect.onchange = () => {
  rocketType = rocketSelect.value;
  localStorage.rocketType = rocketType;
};

// Ses ayarları
const music = new Audio("https://cdn.pixabay.com/audio/2022/12/19/audio_124b03d723.mp3");
music.loop = true;
music.volume = parseFloat(document.getElementById("musicVolume").value);
music.play();
document.getElementById("musicVolume").oninput = e => music.volume = parseFloat(e.target.value);

const fxVolumeSlider = document.getElementById("fxVolume");
let fxVolume = parseFloat(fxVolumeSlider.value);
fxVolumeSlider.oninput = e => fxVolume = parseFloat(e.target.value);

function playFx(url) {
  const fx = new Audio(url);
  fx.volume = fxVolume;
  fx.play();
}

function spawnAsteroid() {
  asteroids.push({
    x: Math.random() * canvas.width,
    y: -20,
    r: 16 + Math.random() * 10,
    speed: (Math.random() * 1 + 1) * level / (slowMotion ? 3 : 1)
  });
}

function fireMissile(x) {
  let missilesToFire = (rocketType === "dual") ? [x - 10, x + 10] : [x];
  missilesToFire.forEach(mx => {
    missiles.push({ x: mx, y: canvas.height - 30, r: 5 });
    playFx("https://cdn.pixabay.com/audio/2022/03/15/audio_115b6e2721.mp3");
  });
  if (window.navigator.vibrate) navigator.vibrate(50);
}

canvas.addEventListener("click", (e) => {
  if (!playing) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  fireMissile(x);
});

function update() {
  if (!playing) return;

  asteroids.forEach(a => a.y += a.speed);
  missiles.forEach(m => m.y -= 6);

  missiles = missiles.filter(m => m.y > 0);
  asteroids = asteroids.filter(a => a.y < canvas.height);

  asteroids.forEach((a, ai) => {
    missiles.forEach((m, mi) => {
      const dx = a.x - m.x, dy = a.y - m.y;
      if (Math.hypot(dx, dy) < a.r + m.r) {
        playFx("https://cdn.pixabay.com/audio/2022/10/16/audio_12a049f072.mp3");
        asteroids.splice(ai, 1);
        missiles.splice(mi, 1);
        score++;
        level = 1 + Math.floor(score / 10);
        if (score > hiscore) {
          hiscore = score;
          localStorage.hiscore = score;
        }
        document.getElementById("score").textContent = score;
        document.getElementById("level").textContent = level;
        document.getElementById("hiscore").textContent = hiscore;
      }
    });
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "orange";
  asteroids.forEach(a => {
    ctx.beginPath();
    ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = "#00ffff";
  missiles.forEach(m => {
    ctx.beginPath();
    ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
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

function toggleTheme() {
  theme = theme === "dark" ? "light" : "dark";
  document.body.style.background = theme === "dark" ? "black" : "white";
  document.body.style.color = theme === "dark" ? "lime" : "black";
}

function takeScreenshot() {
  const img = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = img;
  a.download = "taptap_score.png";
  a.click();
}

function shareScore() {
  const name = nameInput.value || "Oyuncu";
  const msg = `${name} Tap Tap Missile'da ${score} skor yaptı! 🚀`;
  if (navigator.share) {
    navigator.share({ title: "Skor Paylaşımı", text: msg });
  } else {
    alert("Tarayıcın paylaşmayı desteklemiyor. Skorun: " + score);
  }
}
