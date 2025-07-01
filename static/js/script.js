const socket = io();
const notifLog = document.getElementById("notifLog");
const notifCount = document.getElementById("notif-count");
let notifActive = 0;

// Notifikasi popup di UI
socket.on('notification', ({ message, alert }) => {
  console.log("📩 Notif:", message);
  const item = document.createElement("div");
  item.classList.add("notif-item");
  item.innerText = message;

  if (alert) {
    item.classList.add("notif-alert");
    socket.emit("play_mic");
  } else {
    item.style.borderLeftColor = "lime";
    item.style.backgroundColor = "rgba(0,255,0,0.1)";
  }

  notifLog.prepend(item);
  notifActive++;
  notifCount.innerText = `${notifActive} aktif`;
  notifLog.scrollTop = 0;

  setTimeout(() => {
    item.remove();
    notifActive--;
    notifCount.innerText = notifActive > 0 ? `${notifActive} aktif` : "";
  }, 10000);
});

// Countdown per kendaraan
socket.on('countdown_update', ({ vehicle_id, time_left }) => {
  const msg = `⏳ Kendaraan ID ${vehicle_id} akan menerima peringatan dalam ${time_left} detik.`;
  const item = document.createElement("div");
  item.classList.add("notif-item", "notif-alert");
  item.innerText = msg;
  notifLog.prepend(item);
  notifLog.scrollTop = 0;
  setTimeout(() => item.remove(), 1000);
});

socket.on("update_stats", ({ respon, pelanggaran }) => {
  animateStat("stat-respon", respon);
  animateStat("stat-pelanggaran", pelanggaran);
});


function animateStat(id, target) {
  const el = document.getElementById(id);
  let current = parseInt(el.innerText) || 0;
  console.log(`[STAT] ${id}: current=${current}, target=${target}`); // Debug log
  const step = target > current ? 1 : -1;
  const tick = () => {
    if (current !== target) {
      current += step;
      el.innerText = current;
      setTimeout(tick, 20);
    }
  };
  tick();
}


function handleCameraError() {
  document.getElementById("camera-error").classList.remove("hidden");
}

// expose playMic to window if you need to call it elsewhere
window.playMic = () => socket.emit("play_mic");
