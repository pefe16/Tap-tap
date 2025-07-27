const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

let score = 0;
let isPaused = false;
let gameStarted = false;

document.getElementById("score").textContent = score;

const rocketImg = new Image();
rocketImg.src = "missile.png";

const meteorImg = new Image();
meteorImg.src = "meteor.png";

const powerupImg = new Image();
powerupImg.src = "powerup.png";

function startGame() {
  document.getElementById("startScreen").style.display = "none";
  gameStarted = true;
}

function togglePause() {
  isPaused = !isPaused;
  document.getElementById("pauseBtn").textContent = isPaused ? "▶️ Devam" : "⏸️ Durdur";
}

function toggleSettings() {
  const panel = document.getElementById("settingsPanel");
  panel.style.display = panel.style.display === "none" ? "block" : "none";
}

function returnToMenu() {
  window.location.reload();
}

class Rocket {
  constructor(x, y) {
    this.x = x;
    this.y = height - 60;
    this.targetY = y;
    this.speed = 10;
    this.width = 16;
    this.height = 40;
  }

  update() {
    this.y -= this.speed;
  }

  draw() {
    ctx.drawImage(rocketImg, this.x - this.width / 2, this.y, this.width, this.height);
  }

  isOutOfScreen() {
    return this.y + this.height < 0;
  }
}

class Meteor {
  constructor() {
    this.x = Math.random() * width;
    this.y = -50;
    this.speed = 2 + Math.random() * 3;
    this.size = 40 + Math.random() * 20;
  }

  update() {
    this.y += this.speed;
  }

  draw() {
    ctx.drawImage(meteorImg, this.x, this.y, this.size, this.size);
  }

  isHit(rocket) {
    return (
      this.x < rocket.x &&
      rocket.x < this.x + this.size &&
      rocket.y < this.y + this.size &&
      rocket.y > this.y
    );
  }
}

class PowerUp {
  constructor() {
    this.x = Math.random() * width;
    this.y = -50;
    this.speed = 3;
    this.size = 30;
  }

  update() {
    this.y += this.speed;
  }

  draw() {
    ctx.drawImage(powerupImg, this.x, this.y, this.size, this.size);
  }

  isHit(rocket) {
    return (
      this.x < rocket.x &&
      rocket.x < this.x + this.size &&
      rocket.y < this.y + this.size &&
      rocket.y > this.y
    );
  }
}

let rockets = [];
let meteors = [];
let powerups = [];

canvas.addEventListener("click", (e) => {
  if (!isPaused && gameStarted) {
    const rocket = new Rocket(e.clientX, e.clientY);
    rockets.push(rocket);
  }
});

function spawnMeteor() {
  if (!isPaused && gameStarted) {
    meteors.push(new Meteor());
  }
}

function spawnPowerUp() {
  if (!isPaused && gameStarted) {
    powerups.push(new PowerUp());
  }
}

setInterval(spawnMeteor, 1000);
setInterval(spawnPowerUp, 7000);

function gameLoop() {
  ctx.clearRect(0, 0, width, height);

  if (!isPaused && gameStarted) {
    rockets.forEach((rocket, rIndex) => {
      rocket.update();
      rocket.draw();

      meteors.forEach((meteor, mIndex) => {
        if (meteor.isHit(rocket)) {
          meteors.splice(mIndex, 1);
          rockets.splice(rIndex, 1);
          score++;
          document.getElementById("score").textContent = score;
        }
      });

      powerups.forEach((powerup, pIndex) => {
        if (powerup.isHit(rocket)) {
          powerups.splice(pIndex, 1);
          rockets.splice(rIndex, 1);
          score += 5;
          document.getElementById("score").textContent = score;
        }
      });

      if (rocket.isOutOfScreen()) {
        rockets.splice(rIndex, 1);
      }
    });

    meteors.forEach((meteor) => {
      meteor.update();
      meteor.draw();
    });

    powerups.forEach((powerup) => {
      powerup.update();
      powerup.draw();
    });
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
