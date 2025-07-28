const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let playerName = "";
let score = 0;
let rocketType = "Basic";
let missiles = [];
let asteroids = [];
let powerUps = [];
let isGameOver = false;
let gameRunning = false;
let gamePaused = false;
let missedAsteroids = 0;
let lives = 5;
let lastScore = 0;
let settingsOpen = false;

const bgImage = new Image();
bgImage.src = "space-bg.jpg";

const asteroidImg = new Image();
asteroidImg.src = "asteroid.png";

const missileImg = new Image();
missileImg.src = "missile.png";

const powerUpImg = new Image();
powerUpImg.src = "powerup.png";

let player = {
  x: canvas.width / 2,
  y: canvas.height - 60,
  width: 40,
  height: 40,
  speed: 5,
};

function startGame() {
  playerName = document.getElementById("playerName").value || "Oyuncu";
  document.getElementById("startScreen").style.display = "none";
  gameRunning = true;
  isGameOver = false;
  score = 0;
  lives = 5;
  rocketType = "Basic";
  missiles = [];
  asteroids = [];
  powerUps = [];
  missedAsteroids = 0;
  spawnAsteroid();
  update();
}

function spawnAsteroid() {
  if (!gameRunning || isGameOver) return;
  const speed = Math.min(6, 2 + score / 90);
  const size = 40;
  const x = Math.random() * (canvas.width - size);
  asteroids.push({ x, y: -size, width: size, height: size, speed });
  setTimeout(spawnAsteroid, 700);
}

function shootMissile(x) {
  missiles.push({
    x: x - 5,
    y: player.y,
    width: 10,
    height: 20,
    speed: 8,
  });
  if (rocketType === "Double") {
    missiles.push({
      x: x + 15,
      y: player.y,
      width: 10,
      height: 20,
      speed: 8,
    });
  }
}

function update() {
  requestAnimationFrame(update);
  draw();

  if (!gameRunning || gamePaused || isGameOver) return;

  missiles.forEach((missile) => (missile.y -= missile.speed));
  asteroids.forEach((asteroid) => (asteroid.y += asteroid.speed));

  asteroids.forEach((asteroid, aIndex) => {
    if (asteroid.y > canvas.height) {
      missedAsteroids++;
      asteroids.splice(aIndex, 1);
      if (missedAsteroids % 10 === 0) {
        lives--;
        if (lives <= 0) endGame();
      }
    }

    missiles.forEach((missile, mIndex) => {
      if (
        missile.x < asteroid.x + asteroid.width &&
        missile.x + missile.width > asteroid.x &&
        missile.y < asteroid.y + asteroid.height &&
        missile.y + missile.height > asteroid.y
      ) {
        missiles.splice(mIndex, 1);
        asteroids.splice(aIndex, 1);
        score += 10;

        if (score === 1000) {
          rocketType = "Double";
        }
      }
    });
  });
}

function draw() {
  ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

  if (!gameRunning) return;

  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.fillText(`Skor: ${score}`, 20, 50);
  ctx.fillText(`Roket: ${rocketType}`, 20, 80);
  ctx.fillText(`Can: ${lives}`, 20, 110);

  if (!gamePaused) {
    ctx.drawImage(missileImg, player.x, player.y, player.width, player.height);

    missiles.forEach((missile) =>
      ctx.drawImage(missileImg, missile.x, missile.y, missile.width, missile.height)
    );
    asteroids.forEach((asteroid) =>
      ctx.drawImage(asteroidImg, asteroid.x, asteroid.y, asteroid.width, asteroid.height)
    );
  }

  if (isGameOver) {
    ctx.fillStyle = "#fff";
    ctx.font = "30px Arial";
    ctx.fillText("Oyun Bitti", canvas.width / 2 - 70, canvas.height / 2 - 30);

    const buttonWidth = 150;
    const buttonHeight = 50;
    const buttonX = canvas.width / 2 - buttonWidth / 2;
    const buttonY = canvas.height / 2;

    ctx.fillStyle = "#4CAF50";
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
    ctx.fillStyle = "#fff";
    ctx.font = "20px Arial";
    ctx.fillText("Tekrar Oyna", buttonX + 20, buttonY + 30);

    canvas.onclick = function (e) {
      const x = e.clientX;
      const y = e.clientY;
      if (
        x >= buttonX &&
        x <= buttonX + buttonWidth &&
        y >= buttonY &&
        y <= buttonY + buttonHeight
      ) {
        startGame();
      }
    };
  }
}

function endGame() {
  isGameOver = true;
  gameRunning = false;
  lastScore = score;
  document.getElementById("lastScore").innerText = `Son Skor: ${lastScore}`;
  document.getElementById("startScreen").style.display = "block";
}

canvas.addEventListener("click", function (e) {
  if (!gameRunning || gamePaused) return;
  shootMissile(e.clientX);
});

document.getElementById("toggleSettings").addEventListener("click", () => {
  settingsOpen = !settingsOpen;
  document.getElementById("settingsMenu").style.display = settingsOpen ? "block" : "none";
  gamePaused = settingsOpen;
});
