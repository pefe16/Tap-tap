const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let missiles = [];
let enemies = [];
let score = 0;

function spawnEnemy() {
  enemies.push({ x: Math.random() * canvas.width, y: 0, r: 10 });
}

function fireMissile(x) {
  missiles.push({ x: x, y: canvas.height - 20, r: 5 });
  window.navigator.vibrate(50); // iPhone'da kısa titreşim
}

function update() {
  enemies.forEach(e => e.y += 2);
  missiles.forEach(m => m.y -= 5);

  enemies = enemies.filter(e => e.y < canvas.height);
  missiles = missiles.filter(m => m.y > 0);

  enemies.forEach((e, ei) => {
    missiles.forEach((m, mi) => {
      const dx = e.x - m.x;
      const dy = e.y - m.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < e.r + m.r) {
        enemies.splice(ei, 1);
        missiles.splice(mi, 1);
        score++;
        document.getElementById("score").textContent = score;
        const boom = new Audio("https://www.soundjay.com/explosion/explosion-01.mp3");
        boom.play();
      }
    });
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "red";
  enemies.forEach(e => {
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = "cyan";
  missiles.forEach(m => {
    ctx.beginPath();
    ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
    ctx.fill();
  });
}

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  fireMissile(x);
});

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

setInterval(spawnEnemy, 1000);
gameLoop();

function toggleTheme() {
  const body = document.body;
  if (body.style.background === "white") {
    body.style.background = "#000";
    body.style.color = "#0f0";
  } else {
    body.style.background = "white";
    body.style.color = "#000";
  }
}
