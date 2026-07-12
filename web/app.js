/* オキロ！アラーム - メインロジック */
"use strict";

// ---------- ユーティリティ ----------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ---------- タブ切り替え ----------
$$(".tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    $$(".tab").forEach((b) => b.classList.remove("active"));
    $$(".tab-panel").forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    $("#tab-" + btn.dataset.tab).classList.add("active");
  });
});

// ---------- 名言 ----------
function renderQuotes() {
  const list = $("#quotes-list");
  list.innerHTML = QUOTES.map(
    (q) =>
      `<div class="quote-item"><p>${q.text}</p><p class="quote-author">— ${q.author}</p></div>`
  ).join("");
  pickQuoteOfDay();
}
function pickQuoteOfDay(random = false) {
  const idx = random
    ? Math.floor(Math.random() * QUOTES.length)
    : new Date().getDate() % QUOTES.length;
  $("#quote-of-day-text").textContent = QUOTES[idx].text;
  $("#quote-of-day-author").textContent = "— " + QUOTES[idx].author;
}
$("#shuffle-quote").addEventListener("click", () => pickQuoteOfDay(true));

// ---------- 睡眠Tips ----------
function renderTips() {
  $("#tips-list").innerHTML = TIPS.map(
    (t) =>
      `<div class="tip-item"><div class="icon">${t.icon}</div><div><h3>${t.title}</h3><p>${t.body}</p></div></div>`
  ).join("");
}

// ---------- ヒーロー画像ローテーション ----------
let heroIdx = 0;
setInterval(() => {
  heroIdx = (heroIdx + 1) % HERO_IMAGES.length;
  const img = $("#hero-img");
  if (img) img.src = HERO_IMAGES[heroIdx];
}, 8000);

// ---------- カスタム音源（IndexedDB） ----------
const DB_NAME = "okiro-alarm";
let customSoundBlob = null;

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore("sounds");
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function saveCustomSound(file) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("sounds", "readwrite");
    tx.objectStore("sounds").put(file, "custom");
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}
async function loadCustomSound() {
  const db = await openDB();
  return new Promise((resolve) => {
    const req = db.transaction("sounds").objectStore("sounds").get("custom");
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => resolve(null);
  });
}

$("#custom-sound-file").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  await saveCustomSound(file);
  customSoundBlob = file;
  $("#custom-sound-status").innerHTML =
    `<p class="note">✅ 「${file.name}」を保存しました。アラーム音の選択肢に「カスタム音源」が追加されます。</p>`;
  populateSoundSelect();
});

// ---------- サウンド一覧 ----------
function allSounds() {
  const sounds = [...BUILTIN_SOUNDS, ...VOICE_SOUNDS];
  if (customSoundBlob) {
    sounds.push({ id: "custom", name: "カスタム音源", file: null });
  }
  return sounds;
}

function populateSoundSelect() {
  const sel = $("#alarm-sound");
  const prev = sel.value;
  sel.innerHTML = allSounds()
    .map((s) => `<option value="${s.id}">${s.name}</option>`)
    .join("");
  if (prev) sel.value = prev;
}

function renderSoundLists() {
  const mk = (s) =>
    `<div class="sound-item"><span>${s.name}</span>
     <button class="btn-secondary" data-play="${s.id}">▶ 試聴</button></div>`;
  $("#builtin-sounds").innerHTML = BUILTIN_SOUNDS.map(mk).join("");
  $("#voice-sounds").innerHTML = VOICE_SOUNDS.map(mk).join("");
  $$("button[data-play]").forEach((b) =>
    b.addEventListener("click", () => previewSound(b.dataset.play))
  );
}

// ---------- Web Audio 再生（音量エスカレーション付き） ----------
let audioCtx = null;
let currentSource = null;
let currentGain = null;
let previewTimer = null;

function ctx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

async function soundToBuffer(id) {
  const c = ctx();
  const s = allSounds().find((x) => x.id === id);
  let arrayBuf;
  if (id === "custom" && customSoundBlob) {
    arrayBuf = await customSoundBlob.arrayBuffer();
  } else if (s && s.file) {
    arrayBuf = await (await fetch(s.file)).arrayBuffer();
  } else {
    return null;
  }
  return c.decodeAudioData(arrayBuf);
}

function stopPlayback() {
  if (previewTimer) { clearTimeout(previewTimer); previewTimer = null; }
  if (currentSource) {
    try { currentSource.stop(); } catch (_) {}
    currentSource = null;
  }
  if (navigator.vibrate) navigator.vibrate(0);
}

async function playSound(id, { loop = false, escalate = true } = {}) {
  stopPlayback();
  const c = ctx();
  const buffer = await soundToBuffer(id);
  if (!buffer) return;
  const src = c.createBufferSource();
  src.buffer = buffer;
  src.loop = loop;
  const gain = c.createGain();
  if (escalate) {
    gain.gain.setValueAtTime(0.15, c.currentTime);
    gain.gain.linearRampToValueAtTime(1.0, c.currentTime + 25);
  } else {
    gain.gain.value = 1.0;
  }
  src.connect(gain).connect(c.destination);
  src.start();
  currentSource = src;
  currentGain = gain;
}

async function previewSound(id) {
  await playSound(id, { loop: false, escalate: false });
  previewTimer = setTimeout(stopPlayback, 5000);
}

// ---------- アラーム管理 ----------
let alarms = JSON.parse(localStorage.getItem("alarms") || "[]");
let ringing = null; // 現在鳴動中のアラーム

function saveAlarms() {
  localStorage.setItem("alarms", JSON.stringify(alarms));
}

function renderAlarms() {
  const ul = $("#alarm-list");
  if (!alarms.length) {
    ul.innerHTML = `<li><span class="meta">アラームはまだありません</span></li>`;
    return;
  }
  const soundName = (id) => (allSounds().find((s) => s.id === id) || {}).name || id;
  ul.innerHTML = alarms
    .map(
      (a, i) => `<li>
        <div>
          <div class="time">${a.time}</div>
          <div class="meta">${soundName(a.sound)}${a.vibrate ? " / バイブ" : ""}${a.escalate ? " / エスカレーション" : ""}</div>
        </div>
        <input type="checkbox" class="toggle" data-i="${i}" ${a.enabled ? "checked" : ""} title="有効/無効">
        <button class="del" data-i="${i}" title="削除">🗑</button>
      </li>`
    )
    .join("");
  ul.querySelectorAll(".del").forEach((b) =>
    b.addEventListener("click", () => {
      alarms.splice(Number(b.dataset.i), 1);
      saveAlarms();
      renderAlarms();
    })
  );
  ul.querySelectorAll(".toggle").forEach((b) =>
    b.addEventListener("change", () => {
      alarms[Number(b.dataset.i)].enabled = b.checked;
      saveAlarms();
    })
  );
}

$("#add-alarm").addEventListener("click", () => {
  const time = $("#alarm-time").value;
  if (!time) return;
  alarms.push({
    time,
    sound: $("#alarm-sound").value,
    vibrate: $("#alarm-vibrate").checked,
    escalate: $("#alarm-escalate").checked,
    enabled: true,
    lastFired: null,
  });
  saveAlarms();
  renderAlarms();
  // ユーザー操作のタイミングでAudioContextを解錠しておく（自動再生制限対策）
  ctx();
  if (Notification && Notification.permission === "default") {
    Notification.requestPermission();
  }
});

// ---------- 鳴動 ----------
function startRinging(alarm) {
  ringing = alarm;
  const overlay = $("#ring-overlay");
  overlay.classList.remove("hidden");
  $("#ring-img").src = HERO_IMAGES[Math.floor(Math.random() * HERO_IMAGES.length)];
  const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  $("#ring-quote").textContent = `${q.text} — ${q.author}`;
  playSound(alarm.sound, { loop: true, escalate: alarm.escalate });
  if (alarm.vibrate && navigator.vibrate) {
    // 継続バイブレーション
    const pattern = [600, 200, 600, 200, 1000, 300];
    navigator.vibrate(pattern);
    ringing._vibTimer = setInterval(() => navigator.vibrate(pattern), 3000);
  }
  if (Notification && Notification.permission === "granted") {
    new Notification("⏰ オキロ！アラーム", { body: "朝だ！起きろ！ " + alarm.time });
  }
}

function stopRinging() {
  stopPlayback();
  if (ringing && ringing._vibTimer) clearInterval(ringing._vibTimer);
  ringing = null;
  $("#ring-overlay").classList.add("hidden");
}

$("#stop-btn").addEventListener("click", stopRinging);
$("#snooze-btn").addEventListener("click", () => {
  const snoozed = ringing;
  stopRinging();
  if (!snoozed) return;
  const d = new Date(Date.now() + 5 * 60 * 1000);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  alarms.push({ ...snoozed, time: `${hh}:${mm}`, lastFired: null, _vibTimer: undefined, snooze: true });
  saveAlarms();
  renderAlarms();
});

// 毎秒チェック
setInterval(() => {
  if (ringing) return;
  const now = new Date();
  const hhmm =
    String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");
  const today = now.toDateString();
  for (const a of alarms) {
    if (!a.enabled) continue;
    if (a.time === hhmm && a.lastFired !== today + hhmm) {
      a.lastFired = today + hhmm;
      // スヌーズで作った一時アラームは発火後に自動削除
      if (a.snooze) {
        const idx = alarms.indexOf(a);
        setTimeout(() => {
          if (idx >= 0) { alarms.splice(idx, 1); saveAlarms(); renderAlarms(); }
        }, 0);
      }
      saveAlarms();
      startRinging(a);
      break;
    }
  }
}, 1000);

// ---------- PWA: Service Worker登録 ----------
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}

// ---------- 初期化 ----------
(async function init() {
  customSoundBlob = await loadCustomSound();
  if (customSoundBlob) {
    $("#custom-sound-status").innerHTML =
      `<p class="note">✅ カスタム音源が保存済みです。</p>`;
  }
  populateSoundSelect();
  renderSoundLists();
  renderQuotes();
  renderTips();
  renderAlarms();
})();
