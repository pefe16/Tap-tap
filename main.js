const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Oyun kontrol değişkenleri
let gameRunning = false;
let gamePaused = false;
let playerName = "";
let rocketType = "basic";

// Oyun objeleri
let asteroids = [];
let missiles = [];
let score = 0;

// Boyutlandırma
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// ⭐ Başlangıç ekranından oyuna geçiş
window.startGame = function () {
  playerName = document.getElementById("playerName").value || "Oyuncu";
  rocketType = document.getElementById("rocketType").value;
  document.getElementById("startScreen").style.display = "none";
  gameRunning = true;
  gamePaused = false;
  gameLoop();
};

// 🎮 Oyun duraklat / başlat
document.getElementById("pauseButton").addEventListener("click", function () {
  if (!gameRunning) return;
  gamePaused = !gamePaused;
  this.textContent = gamePaused ? "▶ Başlat" : "⏸ Durdur";
  if (!gamePaused) {
    gameLoop();
  }
});

// ⚙️ Ayar panelini aç/kapat
document.getElementById("togglePanel").addEventListener("click", function () {
  const panel = document.getElementById("controlPanel");
  panel.style.display = panel.style.display === "none" ? "block" : "none";
});

// 🛰️ Oyun döngüsü
function gameLoop() {
  if (!gameRunning || gamePaused) return;
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// 🛠️ Güncelleme fonksiyonu
function update() {
  // Asteroid ve füze hareketleri burada işlenecek
}

// 🎨 Çizim fonksiyonu
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Örnek roket ve asteroid çerçevesi
  ctx.fillStyle = "lime";
  ctx.font = "16px Arial";
  ctx.fillText(`👤 ${playerName}`, 20, 30);
  ctx.fillText(`🚀 Roket: ${rocketType}`, 20, 50);
  ctx.fillText(`⭐ Skor: ${score}`, 20, 70);
}

// 🌙 Tema değiştirme (placeholder)
window.changeTheme = function () {
  alert("Tema değiştirme henüz entegre edilmedi!");
};

// 📸 Ekran görüntüsü alma (placeholder)
window.captureScreen = function () {
  alert("Ekran görüntüsü alma özelliği henüz entegre edilmedi!");
};

// 📤 Skor paylaşımı (placeholder)
window.shareScore = function () {
  alert(`${playerName} skoru: ${score}! Paylaşım yakında aktif!`);
};
