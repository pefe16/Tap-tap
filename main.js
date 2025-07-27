const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let asteroids = [], missiles = [];
let score = 0, hiscore = +localStorage.astroHiscore||0, level = 1, lives = 1, playing = true;
const explode = document.getElementById("explode");
const fire = document.getElementById("fire");
const music = document.getElementById("music");
music.volume = 0.15;
music.play();

document.getElementById("hiscore").textContent = hiscore;

function asteroidImg() {
  const img = new Image();
  img.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Asteroid_Eros_-_cropped.jpg/80px-Asteroid_Eros_-_cropped.jpg";
  return img;
}
const asteroidImage = asteroidImg();

function spawnAsteroid() {
  asteroids.push({
    x: Math.random() * (canvas.width - 44) + 22,
    y: -44,
    r: Math.random()*12+18,
    speed: Math.random()*2+level+0.5,
    angle: Math.random()*Math.PI*2,
    rotation: (Math.random()-0.5)*0.05
  });
}
function fireMissile(x) {
  missiles.push({ x, y: canvas.height - 18, r: 5, speed: 9+level });
  fire.currentTime = 0; fire.play();
}

canvas.addEventListener("click", (e) => {
  if (!playing) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  fireMissile(x);
});

function update() {
  asteroids.forEach(a => {
    a.y += a.speed;
    a.angle += a.rotation;
  });
  missiles.forEach(m => m.y -= m.speed);

  // Çarpışma Kontrolü
  asteroids.forEach((a, ai) => {
    missiles.forEach((m, mi) => {
      const dx = a.x - m.x;
      const dy = a.y - m.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < a.r + m.r) {
        explode.currentTime=0; explode.play();
        // Patlama animasyonu (basit çember)
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r+10, 0, 2 * Math.PI);
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 4;
        ctx.stroke();
        asteroids.splice(ai,1); missiles.splice(mi,1);
        score++;
        if (score > hiscore) {
          hiscore = score;
          localStorage.astroHiscore = hiscore;
        }
        document.getElementById("score").textContent = score;
        document.getElementById("hiscore").textContent = hiscore;
      }
    });
  });

  // Asteroid yere düşerse
  for (let i = 0; i < asteroids.length; i++) {
    if (asteroids[i].y > canvas.height + 25) {
      playing = false;
    }
  }

  // Level sistemi (her 10 skor = seviye)
  let newLevel = 1 + Math.floor(score/10);
  if(newLevel !== level) {
    level = newLevel;
    document.getElementById("level").textContent = level;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  asteroids.forEach(a => {
    ctx.save();
    ctx.translate(a.x, a.y);
    ctx.rotate(a.angle);
    ctx.drawImage(asteroidImage, -a.r, -a.r, a.r*2, a.r*2);
    ctx.restore();
  });

  ctx.fillStyle = "#00eaff";
  missiles.forEach(m => {
    ctx.beginPath();
    ctx.arc(m.x, m.y, m.r, 0, Math.PI*2);
    ctx.fill();
  });

  if(!playing) {
    ctx.fillStyle = "#f44";
    ctx.font = "bold 32px Orbitron,sans-serif";
    ctx.fillText("GAME OVER", 70, canvas.height/2);
    ctx.font = "18px Orbitron,sans-serif";
    ctx.fillText("Yeniden başlatmak için butona tıkla!", 20, canvas.height/2+40);
  }
}

function gameLoop() {
  if (playing) {
    update();
    draw();
    requestAnimationFrame(gameLoop);
  } else {
    draw();
  }
}

let asteroidInterval = setInterval(spawnAsteroid, 900);

function restartGame() {
  score = 0; level = 1; asteroids=[]; missiles=[]; playing = true;
  document.getElementById("score").textContent = score;
  document.getElementById("level").textContent = level;
  clearInterval(asteroidInterval);
  asteroidInterval = setInterval(spawnAsteroid, 900);
  gameLoop();
}
gameLoop();

// Oyuncu Adı Kaydet
const nameInput = document.getElementById("playerName");
nameInput.value = localStorage.playerName||"";
nameInput.onchange = () => localStorage.playerName = nameInput.value;
